# Resumash frontend

React 19 / TanStack Router + Query / Vite / Tailwind 4; anonymous resume creation,
AI-assisted tailoring, cover-letter generation, and text PDF export.

## Start
```bash
bun install
bun run dev
```
Set `VITE_BACKEND_URL` to the Express API. Both the Express API and a separate
BullMQ worker must be running for anonymous tailoring; the cover-letter and
AI-builder endpoints require the backend's configured model provider.

## Working with resume data
- `routes/__root.tsx`: background-job manager and single toaster, outside the pages.
- `features/resume-tailor/components/TailoringJobManager.tsx`: anonymous job lifecycle,
  capability persistence, global toast and nonblocking polling/status UI.
- `routes/tailor-resume/index.tsx`: setup/review and approved-change handoff.
- `routes/build-resume/index.tsx`: AI-first entry, ATS gallery, manual editor and PDF controls.
- `features/resume-builder/components/AiResumeQuestionnaire.tsx`: guided source-of-truth interview.
- `routes/cover-letter/index.tsx`: saved letter editor, opt-in resume reuse and PDF download.
- `features/cover-letter/export/CoverLetterPdfDocument.tsx`: two A4 PDF layouts.

See [workspace contracts](../docs/UX_REDESIGN.md) before changing polling, local
storage, generated claims or repeated-field index handling.

## Verification
```bash
bun run typecheck
bun test src
bun run build
```
Playwright browser tests run in CI with mocked API responses. Do not treat
those as live-model or production-worker validation.
