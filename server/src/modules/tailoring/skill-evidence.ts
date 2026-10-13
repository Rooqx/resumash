/**
 * Verify skills against the candidate's source, not job requirements.
 * Minor formatting and explicit tool-name aliases are allowed; unsupported
 * skills are dropped from full-optimization drafts, never silently accepted.
 */
const compact = (text: string) => text.normalize("NFKC").toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, "");
const spaced = (text: string) => text.normalize("NFKC").toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, " ").trim();

// Only narrowly equivalent written variants, not loosely related technology.
const aliases: Record<string, string[]> = {
  postgres: ["postgresql"],
  postgresql: ["postgres"],
  express: ["expressjs"],
  expressjs: ["express"],
  react: ["reactjs"],
  reactjs: ["react"],
  vue: ["vuejs"],
  vuejs: ["vue"],
};
const groupLabel = /^(languages|programming languages|frameworks|libraries|frontend|backend|web development|databases|data & storage|cloud & infrastructure|cloud|devops|infrastructure|tools|testing|testing & quality|data engineering|data & analytics|apis & integrations|other skills|technical skills|relevant skills|software)$/i;

export function skillClearlyInSource(source: string, skill: string): boolean {
  const needle = compact(skill);
  if (!needle) return false;
  const sourceCompact = compact(source);
  // For short names ("Go", "C", "R"), avoid substring matches in unrelated words.
  if (needle.length < 3) return spaced(source).split(" ").includes(needle);
  return [needle, ...(aliases[needle] ?? [])].some(candidate => sourceCompact.includes(candidate));
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
      retainedRows.push(row);
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
