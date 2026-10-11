import { Router } from "express";
import { aiRateLimit } from "../middlewares/tailor-rate-limit";
import { coverLetterInputSchema } from "../modules/cover-letter/cover-letter.schema";
import { generateCoverLetter } from "../modules/cover-letter/cover-letter.service";

const router = Router();

/** Generate an editable draft. Each anonymous IP gets its own finite quota. */
router.post("/generate", aiRateLimit("letter", 20), async (req, res, next) => {
  try {
    const input = coverLetterInputSchema.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ message: "Invalid cover letter details", issues: input.error.flatten() });
      return;
    }
    const draft = await generateCoverLetter(input.data);
    res.json({ success: true, data: draft });
  } catch (error) { next(error); }
});
export default router;
