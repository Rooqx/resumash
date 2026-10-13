import { expect, test } from "bun:test";
import { AppError } from "../../middlewares/error.middleware";
import { skillClearlyInSource, omitUnverifiedSkills } from "./skill-evidence";
import { assertTailoredSkillTagsSupported } from "./tailor.service";
import { assertNumericalClaimsSupported } from "../../shared/ai/numeric-evidence";
import { assertSourceEntitiesPreserved } from "../../shared/ai/source-entities";

const fact = {input: "", suggestions: []};
test("accepts exact sourced skills and narrow product-name spelling variants", () => {
  const resume = "Built React.js frontends, REST APIs, and PostgreSQL databases using Express.js.";
  expect(skillClearlyInSource(resume, "React")).toBe(true);
  expect(skillClearlyInSource(resume, "Postgres")).toBe(true);
  expect(skillClearlyInSource(resume, "Express")).toBe(true);
  expect(skillClearlyInSource(resume, "Python")).toBe(false);
});

test("short programming language names must be whole words in source", () => {
  expect(skillClearlyInSource("Ongoing work with Google analytics", "Go")).toBe(false);
  expect(skillClearlyInSource("Developed Go services", "Go")).toBe(true);
  expect(skillClearlyInSource("Commercial web projects", "R")).toBe(false);
});

test("does not accept substring lookalikes or erase meaningful language punctuation", () => {
  expect(skillClearlyInSource("Built JavaScript applications", "Java")).toBe(false);
  expect(skillClearlyInSource("Built Java applications", "JavaScript")).toBe(false);
  expect(skillClearlyInSource("Applied TypeScript daily", "Script")).toBe(false);
  expect(skillClearlyInSource("Built C services", "C++")).toBe(false);
  expect(skillClearlyInSource("Built C++ services", "C++")).toBe(true);
  expect(skillClearlyInSource("Used C# and .NET", "C#")).toBe(true);
  expect(skillClearlyInSource("Built Node.js and Next.js services", "NodeJS")).toBe(true);
  expect(skillClearlyInSource("Built Node.js and Next.js services", "NextJS")).toBe(true);
  expect(skillClearlyInSource("Built with PostgreSQL", "Postgres")).toBe(true);
});

test("omits unsupported skill claims, preserves legitimate experience and reindexes skill tags", () => {
  const source = "Developed APIs using TypeScript and Postgres.";
  const original = {
    inputValue: { summary: "Developed APIs using TypeScript and Postgres." },
    fields: {
      experience: [{companyName:"Example Labs",jobSummary:"Developed APIs using TypeScript and Postgres."}],
      skills: [{skillName:"Languages"},{skillName:"Cloud & Infrastructure"},{skillName:"Data & Storage"}],
    },
    tagFields: {
      "jobHighlights-0": {tags:["Developed APIs using TypeScript and Postgres."],...fact},
      "skills-0": {tags:["TypeScript","Python"],...fact},
      "skills-1": {tags:["Kubernetes"],...fact},
      "skills-2": {tags:["PostgreSQL"],...fact},
    },
  };
  const sanitized = omitUnverifiedSkills(source, original);
  expect(sanitized.removedCount).toBe(2);
  expect(sanitized.resume.fields.experience).toEqual(original.fields.experience);
  expect(sanitized.resume.fields.skills).toEqual([
    {skillName:"Languages"}, {skillName:"Data & Storage"},
  ]);
  expect(sanitized.resume.tagFields?.["skills-0"]?.tags).toEqual(["TypeScript"]);
  expect(sanitized.resume.tagFields?.["skills-1"]?.tags).toEqual(["PostgreSQL"]);
  expect(sanitized.resume.tagFields?.["skills-2"]).toBeUndefined();
  expect(sanitized.resume.tagFields?.["jobHighlights-0"]).toEqual(original.tagFields["jobHighlights-0"]);
  expect(original.tagFields["skills-0"].tags).toContain("Python");
  expect(() => assertTailoredSkillTagsSupported(source, sanitized.resume)).not.toThrow();
  expect(() => assertTailoredSkillTagsSupported(source, original)).toThrow(AppError);
});

test("drops unverified standalone skill rows without changing sourced ones", () => {
  const base = {
    fields: {skills:[{skillName:"Python"},{skillName:"TypeScript"}]},
    tagFields: {},
  };
  const result = omitUnverifiedSkills("Built TypeScript services.",base);
  expect(result.removedCount).toBe(1);
  expect(result.resume.fields.skills).toEqual([{skillName:"TypeScript"}]);
});

test("critical numeric and employer checks still reject invented claims", () => {
  expect(() => assertNumericalClaimsSupported("Maintained records", ["Raised profit by 45%"])).toThrow();
  expect(() => assertSourceEntitiesPreserved("Worked at Example Labs", {
    experience:[{companyName:"Fictional New Employer"}],
  })).toThrow();
});
