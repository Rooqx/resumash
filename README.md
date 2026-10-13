# Resumash

Resumash is a resume builder and AI-assisted resume tailor. Users can build
resumes in editable templates, review evidence-backed AI suggestions against
a specific job description, and export PDFs from the browser. **No account or
sign-up is required.**

## Codebase

- `client/`: React 19, Vite, TanStack Router/Query, Tailwind; resume
  builder, PDF preview/export, resume tailoring and review.
- `server/`: Express 5 + TypeScript; PDF text extraction, model generation,
  evidence and schema validation, anonymous background jobs.
- `server/src/workers/tailor.worker.ts`: independent BullMQ processor.
- `server/README.md`: complete API and deployment documentation.

## Anonymous resume tailoring

1. The browser generates a UUID job ID and a random 256-bit access token,
   saves them in IndexedDB, and submits the PDF and job description.
2. The backend validates the upload, extracts PDF text, stores the extracted
   text in a 24-hour expiring Redis key, and queues an opaque BullMQ job ID.
   It responds immediately with HTTP 202.
3. The worker generates and validates the resume. The original evidence
   checks remain mandatory; AI edits require explicit user approval.
4. The frontend polls for status using the job ID and access token (in an
   HTTP header), retrieves the completed result, and saves the review draft
   locally. Refreshing or temporarily disconnecting does not discard the job.
5. Input data is deleted after worker processing; credentials and result
   expire 24 hours after submission. BullMQ never stores resume text in
   its job data. A repeated submission with the same ID and token does not
   launch a second AI request.

The access token is generated *in the browser before upload*, rather than
received for the first time in the server response. That enables secure
recovery even when the original HTTP 202 acknowledgement is lost. The
server stores a SHA-256 digest, never the plaintext token. Do not put the
token in a URL, console log, or analytics event.

## Workspace UX

The current UI includes a root-level background tailoring widget, a two-mode tailoring
review flow, AI-first interview with manual resume editing, ATS-first templates,
mobile preview/export controls, and an editable locally saved cover letter with
browser PDF export. The completed tailoring result remains evidence-gated.

See [Workspace UX contracts](docs/UX_REDESIGN.md) for lifecycle, privacy,
accessibility, operational caveats and acceptance requirements.

## Local development

Requires a running Redis/Valkey instance compatible with BullMQ, Bun,
and an OpenAI-compatible LLM provider.

```bash
# Terminal 1 — Redis is already running
cd server
bun install
# Configure REDIS_URI, LLM_API_KEY, LLM_URL, MODEL, and allowed origins in .env
bun run dev

# Terminal 2 — always run a worker alongside the API
cd server
bun run dev:worker

# Terminal 3
cd client
bun install
# Configure VITE_BACKEND_URL for the Express API
bun run dev
```

Production requires **two processes** connecting to the **same**
Redis/Valkey deployment: `bun run start` (Express) and
`bun run start:worker` (BullMQ). Build the server first with
`bun run build`. Configure TLS, private network access, sufficient memory,
durability settings, and encryption at rest on Redis. Do not publish worker
credentials or Redis ports. If the worker is not deployed, jobs remain queued
until their input expires.

## Verification

```bash
cd server && bun run typecheck && bun test && bun run build
cd client && bun run typecheck && bun test src && bun run build
```

GitHub Actions also runs a Redis-backed backend integration test and a
Chromium frontend acceptance suite on pull requests. Live paid-model
evaluation requires real provider credentials and is separate from CI.

## Privacy and limitations

Uploaded PDFs are parsed in memory; extracted text and results live in
expiring Redis keys. Browser-draft saving retains resume data on the
current device. Anonymous jobs are accessible only to holders of the
recovery capability. Clearing site storage loses recovery access; it does
not cancel already submitted jobs. A remote worker interruption can cause
a job to fail; there are no automatic paid AI retries. Completed resumes
must be reviewed for factual accuracy before use.

See [server/README.md](server/README.md) for status codes, quotas,
monitoring, full environment options, and operational caveats.
