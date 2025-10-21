import { Router, type Request } from "express";

import { uploadResume } from "../controllers/resuem.controller";
import uploadMiddleware from "../middlewares/uploads.middleware";
const resumeRouter = Router();

const upload = await uploadMiddleware();
resumeRouter.post("/upload", upload.single("resume"), uploadResume);

export default resumeRouter;
