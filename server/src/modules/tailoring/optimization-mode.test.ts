import { test, expect } from "bun:test";
import { optimizationModeSchema } from "./optimization-mode";
import { assertTailoredSkillTagsSupported } from "./tailor.service";

test("full default, explicit conservative, reject invalid mode", () => {
  expect(optimizationModeSchema.parse(undefined)).toBe("full");
  expect(optimizationModeSchema.parse("conservative")).toBe("conservative");
  expect(optimizationModeSchema.safeParse("invalid").success).toBe(false);
});
test("rejects skills unsupported by candidate resume", () => {
  const source = "Built TypeScript APIs with PostgreSQL and Docker.";
  expect(() => assertTailoredSkillTagsSupported(source, {
    fields: { skills: [{skillName:"Languages"},{skillName:"Data & Storage"}] },
    tagFields: { "skills-0":{tags:["TypeScript"]}, "skills-1":{tags:["PostgreSQL"]} },
  })).not.toThrow();
  expect(() => assertTailoredSkillTagsSupported(source, {
    fields: { skills: [{skillName:"Languages"}] },
    tagFields: { "skills-0":{tags:["Python"]} },
  })).toThrow();
});
