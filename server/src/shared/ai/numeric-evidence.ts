import { AppError } from "../../middlewares/error.middleware";

/** Conservative numeric check for model-written prose. Not a truthfulness guarantee. */
export function assertNumericalClaimsSupported(source: string, prose: string[]): void {
  const numbers = (text: string) => [...text.matchAll(/\b\d+(?:[.,]\d+)*(?:%|x)?\b/g)].map(match => match[0]);
  const known = new Set(numbers(source));
  if (prose.some(line => numbers(line).some(value => !known.has(value)))) {
    throw new AppError("AI introduced a number not found in candidate evidence", 502);
  }
}
