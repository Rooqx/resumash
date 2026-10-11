import { PDFParse } from "pdf-parse";
import { AppError } from "../../middlewares/error.middleware";

const MAX_RESUME_TEXT = 35_000;

/**
 * Extract selectable text from a validated PDF buffer.
 * Never write private candidate documents to public disk paths.
 * The parser instance is destroyed even when extraction fails.
 */
export async function parseResumePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text = result.text.replace(/\r/g, "").trim();
    if (text.length < 50) throw new AppError("Unable to read enough text from this PDF", 422);
    if (text.length > MAX_RESUME_TEXT) {
      throw new AppError("Resume contains too much text to process", 413);
    }
    return text;
  } finally {
    await parser.destroy();
  }
}
