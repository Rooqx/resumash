import { expect, test } from "bun:test";
import { assertBaselineProseSupported } from "./baseline-evidence";

test("allows transcribed source prose across whitespace and punctuation", () => {
 expect(() => assertBaselineProseSupported(
  "Alex Example\n\nMaintained daily inventory records, using Excel.",
  {
   inputValue: { summary: "" },
   fields: { experience: [{ jobSummary: "Maintained daily inventory records using Excel" }] },
   tagFields: {},
  },
 )).not.toThrow();
});

test("rejects unsupported rewrite inside supposedly unchanged baseline", () => {
 expect(() => assertBaselineProseSupported(
  "Maintained daily inventory records",
  {
   inputValue: { summary: "Led a national transformation programme" },
   fields: {},
   tagFields: {},
  },
 )).toThrow();
});
