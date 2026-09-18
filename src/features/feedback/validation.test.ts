import { describe, expect, it } from "vitest";

import {
  validateFeedbackFields,
  validateFeedbackStatus,
} from "./validation";

describe("validateFeedbackFields", () => {
  it("normalizes a valid feedback submission", () => {
    const result = validateFeedbackFields({
      type: "bug",
      appId: "office-jukebox",
      content: "  Bai hat moi khong duoc them vao hang doi.  ",
      website: "",
    });

    expect(result).toEqual({
      success: true,
      data: {
        type: "bug",
        app_id: "office-jukebox",
        content: "Bai hat moi khong duoc them vao hang doi.",
      },
    });
  });

  it("allows feedback that is not tied to a specific app", () => {
    const result = validateFeedbackFields({
      type: "idea",
      appId: "",
      content: "Company Hub nen co them khu vuc tong hop tai lieu noi bo.",
      website: "",
    });

    expect(result).toMatchObject({
      success: true,
      data: { app_id: null },
    });
  });

  it("rejects invalid types, unknown apps, and short content", () => {
    const result = validateFeedbackFields({
      type: "complaint",
      appId: "unknown-app",
      content: "Qua ngan",
      website: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(["appId", "content", "type"]);
    }
  });

  it("silently rejects submissions that fill the honeypot", () => {
    const result = validateFeedbackFields({
      type: "bug",
      appId: "ma-soi",
      content: "Noi dung nay du dai nhung den tu mot bot tu dong.",
      website: "https://spam.example.com",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.form).toBeTruthy();
      expect(result.errors.content).toBeUndefined();
    }
  });
});

describe("validateFeedbackStatus", () => {
  it("accepts a supported status", () => {
    expect(validateFeedbackStatus("in_progress")).toEqual({
      success: true,
      data: "in_progress",
    });
  });

  it("rejects an unsupported status", () => {
    const result = validateFeedbackStatus("archived");
    expect(result.success).toBe(false);
  });
});
