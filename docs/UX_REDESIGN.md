# Resumash workspace UX and implementation contracts

The no-account application has three connected tasks: **Build**, **Tailor**, and **Cover letter**.
No step may overwrite the user's existing draft without an explicit selection or confirmation.

## Tailoring: one job manager, one recovery capability

- `TailoringJobProvider` is mounted at `routes/__root.tsx`; the tailoring route does **not** own polling.
- Generate a fresh UUID and 256-bit anonymous token, **commit it to IndexedDB before POST**. Submit PDF + job description; accept the server's 202 acknowledgement. Do not store the token in links, logs, or analytics.
- The app-level TanStack Query polls only while a job exists. Polling may pause while the tab is hidden and resumes when focused; a closed browser cannot receive real-time notifications. **Never** trigger full-screen navigation loaders for background queries.
- After acceptance, show an accessible modal. Minimize to a draggable desktop widget; mobile docks above the bottom action bar. No fake numerical progress bar.
- On success, validate and persist the resulting review document before clearing the recovery token. Display a toast throughout the app; auto-navigate to review after a short delay only if not interrupting active editing. The toast offers **Stay here**. Reopening the route must reveal the result.
- `Clear local work`/forgetting credentials is not a cancellation request to BullMQ. Never label it as one.
- Failed, expired, disconnected, invalid, or rejected submissions must have actionable user messages. Unknown network state is polled instead of silently duplicated.

## Tailoring review contract

- Setup mode owns the source resume and job description.
- Results mode owns original/tailored/comparison previews and evidence-backed suggestions.
- All suggestions start rejected. Only checked edits are applied after an explicit review acknowledgement.
- `Change resume or job` goes back to setup; current completed result is retained until a replacement is submitted.
- A reviewed result can be handed to the resume builder without reentering the AI onboarding interview.

## Resume builder

- New empty workspaces start in the guided four-step AI interview with **Build manually** available.
- Collect real facts, optional separately described achievements, and opt-in wording polish. The backend preserves identity, employers, dates, credentials, and numerical-source checks.
- A single editor data model receives accepted AI drafts; no second incompatible resume store is created.
- For fresh resumes, default to **ATS Essential**; gallery order is ATS Essential, Professional Classic, then the three design-led options. Once chosen, use a compact current-template summary with **Change template**.
- Desktop uses a bounded internal form panel while retaining a preview alongside it. On phones, avoid nested form scrolling, and provide persistent **Preview** and **Download** buttons. **Edit** is the normal workspace, not an extra tab.
- Section changes return focus and scroll to the new heading. Completed work auto-saves; large repeated fields cannot push the entire desktop page indefinitely.
- Legacy tag groups stored as indexed keys must shift together with experience, skill, and project records on insertion/deletion. New records use stable UUIDs.

## Cover letter

- Users can type from scratch or explicitly populate facts from the local resume/approved tailored resume.
- The AI endpoint remains fact-restricted and generated numerical claims are validated against input evidence.
- Locally autosaved drafts are editable; replacing an edited draft requires confirmation.
- Default cover layout is ATS/Classic; a Modern PDF style is offered. The layout can reflect the selected resume template on first load and can be changed.
- PDF export is text-based, paginated A4 from React-PDF, generated locally in the browser without sending the export to a server.
- On mobile, accessible preview dialog and persistent preview/export controls remove the need to scroll to the header.

## Privacy and production constraints

- Browser localStorage retains sensitive drafts and the original PDF lives in IndexedDB; these are tied to the current browser profile. Clearing storage loses recovery. Shared/public devices need local clearing before sign-out.
- Background jobs still require a separate BullMQ worker and Redis with private networking, TLS, adequate memory, and storage retention. Production integration with a live paid model requires credentials and staging validation.
- Cover-letter generation currently uses a synchronous API request with a browser timeout; if model latency often approaches that limit, move it to the durable job queue separately.
- Multi-device synchronization and true server-side cancellation are not implemented; don't display UI copy promising either one.

## Acceptance and auditing

CI runs backend typechecking, Bun tests, Redis integration, frontend TypeScript/build, unit tests, and Chromium workflows. The browser tests cover:
- Active tailoring across route navigation, minimized status, background polling without the blocking overlay, completion and navigation.
- Job token retention during refresh, original PDF draft restoration and clear.
- AI-first vs manual builder, step/template persistence, mobile PDF preview/zoom and local PDF export.
- Cover-letter source reuse, editing, and PDF download.

Additional manual device/assistive-tech review is needed before declaring WCAG compliance: 320/375/390/430 px and tablet/desktop layouts, light/dark contrast, keyboard-only dialogs, reduced motion, screen readers, screen orientation, long translated content, and long repeated fields.
