import { expect, test } from "bun:test";
import { tailoringResultSchema } from "./tailor.schema";
import { capValidWritingNotes, mergeTailoringWritingNotes, MAX_TAILORING_WRITING_NOTES } from "./writing-notes";

const valid = () => ({
  resume: {
    inputValue: { fullName: "Alex Example", summary: "Built TypeScript services with PostgreSQL." },
    fields: {
      experience: [{
        companyName: "Example Co",
        jobPosition: "Backend Developer",
        jobSummary: "Built TypeScript services with PostgreSQL.",
      }],
      skills: [{skillName:"TypeScript"}],
    },
    tagFields: {},
  },
  suggestions: [],
  requirements: [],
  missingRequirements: [],
  clarificationQuestions: [],
  writingNotes: ["Verify descriptions against your work history."],
});

test("surplus valid writing notes are capped without rejecting an otherwise valid resume", () => {
  const source = valid();
  const extraNotes = Array.from({length: 12}, (_, index) => `Note ${index + 1} for the user.`);
  const parsed = tailoringResultSchema.parse({...source, writingNotes: extraNotes});
  expect(parsed.writingNotes).toEqual(extraNotes.slice(0, MAX_TAILORING_WRITING_NOTES));
  expect(parsed.resume).toEqual(source.resume);
  expect(parsed.requirements).toEqual(source.requirements);
  expect(parsed.suggestions).toEqual(source.suggestions);
  expect(extraNotes).toHaveLength(12); // Input is not mutated.
});

test("missing notes default to an empty array; valid notes remain unchanged", () => {
  const {writingNotes: _ignored, ...withoutNotes} = valid();
  expect(tailoringResultSchema.parse(withoutNotes).writingNotes).toEqual([]);
  const notes = ["Keep evidence clear.", "Explain outcomes without invented metrics."];
  expect(tailoringResultSchema.parse({...valid(), writingNotes: notes}).writingNotes).toEqual(notes);
});

test("rejects malformed note content even when it occurs beyond the eighth entry", () => {
  const long = "x".repeat(251);
  const malformed = [...Array.from({length: 8}, (_, i) => `Note ${i}`), 123];
  expect(tailoringResultSchema.safeParse({...valid(), writingNotes: malformed}).success).toBe(false);
  expect(tailoringResultSchema.safeParse({...valid(), writingNotes: [long, ...Array(8).fill("ok")]}).success).toBe(false);
  expect(capValidWritingNotes("not an array")).toBe("not an array");
});

test("invalid resume fields or evidence suggestions still fail strict validation", () => {
  expect(tailoringResultSchema.safeParse({
    ...valid(), resume: {...valid().resume, inputValue: {fullName: 99}},
    writingNotes: Array(10).fill("Valid note"),
  }).success).toBe(false);
  expect(tailoringResultSchema.safeParse({
    ...valid(), suggestions: [{proposed:"Invented claim"}], writingNotes: Array(10).fill("Valid note"),
  }).success).toBe(false);
  expect(tailoringResultSchema.safeParse({
    ...valid(), unexpected: "extra top-level property", writingNotes: Array(10).fill("Valid note"),
  }).success).toBe(false);
});

test("writing quality notes remain present and total stays within schema limit", () => {
  const model = Array.from({length: 8}, (_, i) => `AI note ${i}`);
  const audit = ["Remove repeated bullets.", "Replace generic promotional language with specific, evidenced work."];
  const merged = mergeTailoringWritingNotes(model, audit);
  expect(merged).toHaveLength(8);
  expect(merged.slice(0, 2)).toEqual(audit);
  expect(merged).toContain("AI note 0");
  expect(merged).not.toContain("AI note 7");
  expect(tailoringResultSchema.parse({...valid(), writingNotes: merged}).writingNotes).toEqual(merged);
  expect(mergeTailoringWritingNotes(["same", "same"], ["same", "different"])).toEqual(["same", "different"]);
});
