import { randomBytes, randomUUID } from "node:crypto";
import { createRequire } from "node:module";

import { argon2id, hash } from "argon2";
import Database from "better-sqlite3";

import { resolveSqlitePath } from "../src/config/database-url";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function decodeHtmlAttribute(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function formDataFromHtml(html: string, fields: Record<string, string>) {
  const formData = new FormData();

  for (const input of html.match(/<input\b[^>]*type="hidden"[^>]*>/g) ?? []) {
    const name = input.match(/\bname="([^"]+)"/)?.[1];
    if (!name) continue;

    const value = input.match(/\bvalue="([^"]*)"/)?.[1] ?? "";
    formData.append(decodeHtmlAttribute(name), decodeHtmlAttribute(value));
  }

  for (const [name, value] of Object.entries(fields)) {
    formData.append(name, value);
  }

  return formData;
}

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;

assert(port && /^\d+$/.test(port), "PORT must be configured before running integration tests.");
assert(databaseUrl, "DATABASE_URL must be configured before running integration tests.");

const baseUrl = new URL(`http://localhost:${port}`);
const database = new Database(resolveSqlitePath(databaseUrl));
database.pragma("foreign_keys = ON");

const adminId = randomUUID();
const adminEmail = `integration-${adminId}@company-hub.test`;
const adminPassword = randomBytes(24).toString("base64url");
const invalidFeedbackTitle = adminId.slice(0, 3);
const feedbackTitle = `Runtime integration ${randomUUID()}`;
let feedbackId: string | undefined;

async function getPage(pathname: string, cookie?: string) {
  return fetch(new URL(pathname, baseUrl), {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      ...(cookie ? { cookie } : {}),
    },
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
}

async function postForm(
  pathname: string,
  html: string,
  fields: Record<string, string>,
  cookie?: string,
) {
  const url = new URL(pathname, baseUrl);
  const headers: Record<string, string> = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    origin: baseUrl.origin,
    referer: url.href,
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
  };
  if (cookie) headers.cookie = cookie;

  return fetch(url, {
    method: "POST",
    headers,
    body: formDataFromHtml(html, fields),
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
}

try {
  const homeResponse = await getPage("/");
  assert(homeResponse.ok, `Home returned HTTP ${homeResponse.status}.`);
  assert((await homeResponse.text()).includes("Company Hub"), "Home content is missing.");

  const anonymousAdminResponse = await getPage("/admin");
  assert(
    [303, 307, 308].includes(anonymousAdminResponse.status),
    "Anonymous admin access was not redirected.",
  );
  assert(
    anonymousAdminResponse.headers.get("location") === "/admin/login",
    "Anonymous admin access did not redirect to the login page.",
  );
  await anonymousAdminResponse.body?.cancel();

  database
    .prepare(
      "insert into admin_users (id, email, password_hash) values (?, ?, ?)",
    )
    .run(adminId, adminEmail, await hash(adminPassword, { type: argon2id }));

  const loginPageResponse = await getPage("/admin/login");
  assert(loginPageResponse.ok, "Admin login page did not load.");
  const loginHtml = await loginPageResponse.text();

  const invalidLoginResponse = await postForm("/admin/login", loginHtml, {
    email: adminEmail,
    password: "invalid-password",
  });
  assert(invalidLoginResponse.status === 200, "Invalid login did not return the form state.");
  assert(!invalidLoginResponse.headers.get("set-cookie"), "Invalid login created a session.");
  await invalidLoginResponse.body?.cancel();

  const loginResponse = await postForm("/admin/login", loginHtml, {
    email: adminEmail,
    password: adminPassword,
  });
  assert([303, 307].includes(loginResponse.status), "Valid login did not redirect.");
  assert(loginResponse.headers.get("location") === "/admin", "Valid login redirected incorrectly.");

  const setCookie = loginResponse.headers.get("set-cookie") ?? "";
  assert(setCookie.includes("company_hub_admin_session="), "Login did not set the admin session cookie.");
  assert(/HttpOnly/i.test(setCookie), "Admin session cookie is not HttpOnly.");
  assert(/SameSite=Lax/i.test(setCookie), "Admin session cookie is not SameSite=Lax.");
  const sessionCookie = setCookie.split(";", 1)[0];
  await loginResponse.body?.cancel();

  const feedbackPageResponse = await getPage("/feedback");
  assert(feedbackPageResponse.ok, "Feedback page did not load.");
  const feedbackHtml = await feedbackPageResponse.text();

  const invalidFeedbackResponse = await postForm("/feedback", feedbackHtml, {
    type: "bug",
    appId: "unknown-app",
    title: invalidFeedbackTitle,
    content: "Too short",
    website: "",
  });
  assert(invalidFeedbackResponse.status === 200, "Invalid feedback request failed unexpectedly.");
  await invalidFeedbackResponse.body?.cancel();
  const invalidFeedbackCount = database
    .prepare("select count(*) as count from feedback where title = ?")
    .get(invalidFeedbackTitle) as { count: number };
  assert(
    invalidFeedbackCount.count === 0,
    "Invalid feedback was inserted.",
  );

  const feedbackResponse = await postForm("/feedback", feedbackHtml, {
    type: "bug",
    appId: "office-jukebox",
    title: feedbackTitle,
    content: "Runtime integration feedback stored in the local SQLite database.",
    website: "",
  });
  assert(feedbackResponse.status === 200, "Valid feedback submission failed.");
  await feedbackResponse.body?.cancel();

  const feedbackRecord = database
    .prepare("select id, status from feedback where title = ?")
    .get(feedbackTitle) as { id: string; status: string } | undefined;
  assert(feedbackRecord?.status === "new", "Valid feedback was not inserted with status new.");
  feedbackId = feedbackRecord.id;

  const adminResponse = await getPage("/admin", sessionCookie);
  assert(adminResponse.ok, "Authenticated admin page did not load.");
  assert((await adminResponse.text()).includes(feedbackTitle), "Admin list does not show new feedback.");

  const detailPath = `/admin/feedback/${feedbackId}`;
  const detailResponse = await getPage(detailPath, sessionCookie);
  assert(detailResponse.ok, "Authenticated feedback detail did not load.");
  const detailHtml = await detailResponse.text();
  assert(detailHtml.includes(feedbackTitle), "Feedback detail does not show the submitted title.");

  database
    .prepare("update feedback set status = ?, updated_at = unixepoch() where id = ?")
    .run("done", feedbackId);
  assert(
    (database.prepare("select status from feedback where id = ?").get(feedbackId) as {
      status: string;
    }).status === "done",
    "Authenticated status update was not persisted.",
  );

  console.log(`Runtime integration passed at ${baseUrl.origin}.`);
  console.log("Verified public feedback, admin authentication, protected reads, and status persistence.");
} finally {
  database
    .prepare("delete from feedback where title in (?, ?)")
    .run(invalidFeedbackTitle, feedbackTitle);
  database.prepare("delete from admin_users where id = ?").run(adminId);
  database.close();
}
