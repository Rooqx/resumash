import { expect, test } from "bun:test";
import { assertNumericalClaimsSupported } from "./numeric-evidence";
test("permits supported numerical achievements", () => {
 expect(() => assertNumericalClaimsSupported("Saved 12% in costs", ["Reduced costs by 12%"])).not.toThrow();
});
test("blocks invented percentages", () => {
 expect(() => assertNumericalClaimsSupported("Helped customers", ["Increased sales by 35%"])).toThrow();
});
