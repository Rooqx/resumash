import { afterAll, beforeAll, expect, test } from "bun:test";
import type { Server } from "node:http";
import express from "express";
import uploadMiddleware, { uploadErrorHandler } from "./uploads.middleware";
import { tailorInputSchema } from "../modules/resume/resume.schema";

let server: Server;
let url: string;

// Actual multipart HTTP parsing, without Redis, model calls or real resumes.
beforeAll(async () => {
  const app = express();
  app.post("/tailor", uploadMiddleware(), (req, res) => {
    const checked = tailorInputSchema.safeParse(req.body);
    if (!checked.success) {
      res.status(400).json({ message: "Invalid tailoring inputs" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "Missing PDF" });
      return;
    }
    res.status(202).json({
      mode: checked.data.optimizationMode,
      filename: req.file.originalname,
      size: req.file.size,
    });
  });
  app.use(uploadErrorHandler);
  server = await new Promise<Server>(resolve => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No port");
  url = `http://127.0.0.1:${address.port}/tailor`;
});

afterAll(async () => {
  if (server) await new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
});

function makeForm(mode?: "full" | "conservative", extra = false): FormData {
  const form = new FormData();
  form.append("jobDescription", "Seeking a backend engineer building API services and data pipelines.");
  if (mode) form.append("optimizationMode", mode);
  if (extra) form.append("unexpected", "not allowed");
  form.append("resume", new Blob(["%PDF-1.4\nSynthetic PDF for middleware test."], { type: "application/pdf" }), "test.pdf");
  return form;
}

test("accepts two text fields plus one PDF (full optimization)", async () => {
  const response = await fetch(url, { method: "POST", body: makeForm("full") });
  expect(response.status).toBe(202);
  expect(await response.json()).toMatchObject({ mode: "full", filename: "test.pdf", size: 43 });
});

test("accepts conservative optimization mode", async () => {
  const response = await fetch(url, { method: "POST", body: makeForm("conservative") });
  expect(response.status).toBe(202);
  expect((await response.json() as {mode:string}).mode).toBe("conservative");
});

test("accepts legacy one-text-field uploads and applies the full default", async () => {
  const response = await fetch(url, { method: "POST", body: makeForm() });
  expect(response.status).toBe(202);
  expect((await response.json() as {mode:string}).mode).toBe("full");
});

test("rejects a third text field with a specific 400 message", async () => {
  const response = await fetch(url, { method: "POST", body: makeForm("full", true) });
  expect(response.status).toBe(400);
  expect((await response.json() as {message:string}).message).toContain("at most two text fields");
});

test("rejects two PDF files as an invalid upload", async () => {
  const form = makeForm("full");
  form.append("resume", new Blob(["%PDF-extra"], {type:"application/pdf"}), "second.pdf");
  const response = await fetch(url, {method:"POST",body:form});
  expect(response.status).toBe(400);
  expect((await response.json() as {message:string}).message).toContain("Invalid resume upload");
});
