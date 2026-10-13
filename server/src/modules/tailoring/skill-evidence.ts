/**
 * Verify skills against the candidate's source, not job requirements.
 * Minor formatting and explicit tool-name aliases are allowed; unsupported
 * skills are dropped from full-optimization drafts, never silently accepted.
 */
const compact = (text: string) => text.normalize("NFKC").toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, "");
const spaced = (text: string) => text.normalize("NFKC").toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");

// These refer to the same named technology, not adjacent technologies.
// Whole-term boundaries below prevent Java from matching JavaScript.
const aliases: Record<string, string[]> = {
  postgres: ["postgresql"],
  postgresql: ["postgres"],
  express: ["expressjs", "express js"],
  expressjs: ["express", "express js"],
  react: ["reactjs", "react js"],
  reactjs: ["react", "react js"],
  vue: ["vuejs", "vue js"],
  vuejs: ["vue", "vue js"],
  nodejs: ["node js"],
  nextjs: ["next js"],
};
const groupLabel = /^(languages|programming languages|frameworks|libraries|frontend|backend|web development|databases|data & storage|cloud & infrastructure|cloud|devops|infrastructure|tools|testing|testing & quality|data engineering|data & analytics|apis & integrations|other skills|technical skills|relevant skills|software)$/i;

export function skillClearlyInSource(source: string, skill: string): boolean {
  const rawSkill = skill.normalize("NFKC").trim();
  // Preserve distinguishing punctuation in language names.
  if (/^c\+\+$/i.test(rawSkill)) return /(?:^|[^\p{L}\p{N}])c\s*\+\s*\+(?=$|[^\p{L}\p{N}])/iu.test(source);
  if (/^c#$/i.test(rawSkill)) return /(?:^|[^\p{L}\p{N}])c\s*#(?=$|[^\p{L}\p{N}])/iu.test(source);
  const needle = compact(rawSkill);
  if (!needle) return false;
  const haystack = ` ${spaced(source)} `;
  const variants = [spaced(rawSkill), ...(aliases[needle] ?? [])];
  return variants.some(variant => variant.length > 0 && haystack.includes(` ${variant} `));
}

type SkillResume = {
  fields: Record<string, Array<Record<string, unknown>>>;
  tagFields?: Record<string, { tags: string[]; input: string; suggestions: string[] }>;
};

/** Compact retained skill indices together; preserve all non-skill resume data. */
export function omitUnverifiedSkills<T extends SkillResume>(
  source: string, resume: T,
): { resume: T; removedCount: number } {
  const rows = resume.fields.skills ?? [];
  const tags = resume.tagFields ?? {};
  const retainedRows: Array<Record<string, unknown>> = [];
  const retainedTags: typeof tags = Object.fromEntries(
    Object.entries(tags).filter(([key]) => !/^skills-\d+$/.test(key)),
  );
  let removedCount = 0;
  for (const [index, row] of rows.entries()) {
    const label = typeof row.skillName === "string" ? row.skillName.trim() : "";
    const original = tags[`skills-${index}`];
    const candidates = original?.tags ?? [];
    if (candidates.length) {
      const supported = candidates.filter(skill => skillClearlyInSource(source, skill));
      removedCount += candidates.length - supported.length;
      if (supported.length === 0) continue;
      const next = retainedRows.length;
      // Non-category labels can themselves assert proficiency, even when
      // their tags are supported. Replace unsupported labels with a neutral
      // category, rather than displaying an AI-invented skill as the heading.
      const verifiedLabel = label && (groupLabel.test(label) || skillClearlyInSource(source, label));
      if (!verifiedLabel) removedCount++;
      retainedRows.push(verifiedLabel ? row : { ...row, skillName: "Relevant Skills" });
      retainedTags[`skills-${next}`] = { ...original!, tags: supported };
    } else if (label && !groupLabel.test(label) && skillClearlyInSource(source, label)) {
      retainedRows.push(row);
    } else {
      // An empty category or unverified stand-alone skill is not informative.
      if (label && !groupLabel.test(label)) removedCount++;
    }
  }
  return {
    resume: {
      ...resume,
      fields: { ...resume.fields, skills: retainedRows },
      tagFields: retainedTags,
    },
    removedCount,
  };
}
