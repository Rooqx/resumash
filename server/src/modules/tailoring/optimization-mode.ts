import { z } from "zod";

/** Full optimization is the default; conservative mode is an explicit opt-out. */
export const optimizationModeSchema = z.enum(["full", "conservative"]).default("full");
export type OptimizationMode = z.infer<typeof optimizationModeSchema>;
