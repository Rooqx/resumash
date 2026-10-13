import { describe, expect, it } from "bun:test";
import { createHash } from "node:crypto";
import { JOB_ID_PATTERN, TOKEN_PATTERN, validateCredentials } from "./tailor-job-store";

describe("anonymous tailoring credentials", () => {
  it("accepts UUID job IDs and 256-bit hex secrets", () => {
    const id = "9f23c4ef-8184-4eb8-b4d2-e51062234be1";
    const token = createHash("sha256").update("test-only").digest("hex");
    expect(JOB_ID_PATTERN.test(id)).toBe(true);
    expect(TOKEN_PATTERN.test(token)).toBe(true);
    expect(() => validateCredentials(id, token)).not.toThrow();
  });
  it("rejects missing, short and malformed credentials", () => {
    expect(() => validateCredentials("../invalid", "f".repeat(64))).toThrow();
    expect(() => validateCredentials("9f23c4ef-8184-4eb8-b4d2-e51062234be1", "short")).toThrow();
  });
});
