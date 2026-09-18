import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveSqlitePath } from "./database-url";

describe("resolveSqlitePath", () => {
  it("resolves a relative file URL from the project directory", () => {
    expect(resolveSqlitePath("file:./data/company-hub.db", "/workspace/company-hub")).toBe(
      path.join("/workspace/company-hub", "data/company-hub.db"),
    );
  });

  it("keeps an absolute database path outside the source directory", () => {
    expect(
      resolveSqlitePath("file:/var/lib/company-hub/company-hub.db", "/workspace/company-hub"),
    ).toBe("/var/lib/company-hub/company-hub.db");
  });

  it("rejects database URLs that are not SQLite file URLs", () => {
    expect(() => resolveSqlitePath("postgres://localhost/company-hub", "/workspace")).toThrow(
      "DATABASE_URL must use the file: scheme",
    );
  });
});
