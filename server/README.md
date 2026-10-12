# Resumash API — Backend Guide

The API is a small Express + TypeScript modular monolith. All AI features use
one OpenAI-compatible Atria OpenAI SDK client and Zod validation. Resume PDFs are
rendered in the browser with the existing React PDF dependency.

## Environment configuration

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP listen port |
| `NODE_ENV` | `development` / `production` |
| `LLM_API_KEY` | Atria API key |
| `LLM_URL` | OpenAI-compatible provider API URL ending in `/v1` or `/v1/chat/completions` |
| `LLM_PROVIDER` | Optional safe provider label for observability, e.g. `tokenharbor` (defaults to `openai-compatible`) |
| `MODEL` | OpenAI-compatible model identifier; for example `Atria-Dawn-Preview`; return valid JSON per prompt |
| `REDIS_URI` | Required shared Redis/Valkey URL for atomic AI quotas |
| `FRONTEND_DEVELOPMENT_URL` | Allowed development web origin |
| `FRONTEND_PRODUCTION_URL` | Allowed production web origin |
| `TRUST_PROXY_HOPS` | Number of **trusted** reverse proxy hops; set only after inspecting deployment topology |
| `ENABLE_LEGACY_PDF_EXPORT` | Optional rollback flag; defaults to disabled |

Never expose `LLM_API_KEY` to Vite/React environment variables.

**IP quota correctness:** If a reverse proxy is present, Express must resolve
the actual client IP. Configure `TRUST_PROXY_HOPS` based on your hosting
infrastructure, not untrusted forwarded headers. An incorrect value can
cause many visitors to share one quota or permit spoofed IPs.

**No login:** Quotas use IPs, so multiple visitors sharing a mobile network or
office NAT can share the same allowance.

**No public upload directory:** PDFs are checked for the `%PDF-` signature,
limited to 10 MiB, parsed from memory and never served over `/uploads`.

## API routes

### `POST /api/v1/resumes/upload`

Existing compatibility route. Multipart form upload:

- `resume`: PDF, maximum 10 MiB
- `jobDescription`: string, 20–20,000 characters

Response remains compatible with the current frontend's nested
`data.data` resume payload, with additional optional review suggestions and
missing-requirement information.

Rate limit: **10 attempts per client IP, per five-hour fixed window**.

### `POST /api/v1/resumes/ai-build`

Request JSON (all arrays except `skills` can be empty):

```json
{
  "fullName": "Alex Chen",
  "targetRole": "Customer Support Specialist",
  "careerLevel": "entry",
  "email": "alex@example.com",
  "phone": "",
  "location": "Ilorin, Nigeria",
  "skills": ["Customer service", "Order tracking"],
  "experience": [
    {
      "company": "Example Retail",
      "position": "Sales Assistant",
      "startDate": "2025",
      "endDate": "2026",
      "responsibilities": "Helped customers, processed purchases and organized inventory."
    }
  ],
  "education": [],
  "projects": [],
  "additionalInfo": ""
}
```

The service generates a summary and experience bullets, while copying identity,
employment dates, employers, roles, education and skill names directly from the
questionnaire. The returned resume is **editable and requires user review**.

Rate limit: 10 attempts/IP/5 hours, separate from the Tailor allowance.

### `POST /api/v1/cover-letters/generate`

```json
{
  "applicantName": "Alex Chen",
  "targetRole": "Customer Support Specialist",
  "company": "Example Company",
  "jobDescription": "Position description (at least twenty characters)",
  "experience": "I helped customers and tracked purchases at a local retail shop.",
  "tone": "professional"
}
```

The returned letter is a review-required draft, not a verified statement of
qualification. Rate limit: 20 attempts/IP/5 hours, separate from other features.

## Quotas and errors

Redis implements atomic fixed-window counters, beginning with the first request.
AI requests are rejected with HTTP `429` after the allowance is used, including
`Retry-After`, `RateLimit-Remaining`, and `RateLimit-Reset` headers.
If Redis is unavailable, the API fails closed with HTTP `503`.
There is also an in-process cap of six simultaneous model requests per instance.

No expensive operation should bypass request size, quota or runtime validation.

## Quality checks

From the `server/` directory:

```bash
bun install
bun run typecheck
bun run build
```

The matching GitHub Actions workflow executes these checks on the redesign
branch and pull requests. No new automated test suite was added per scope.

**Known limitations and release gates:**

- A production Redis URL, Atria credential and suitable model are required.
- Live model quality and provider JSON response reliability must be checked with real
  credentials; compilation alone cannot verify an inference response.
- The legacy Playwright PDF endpoint is disabled unless explicitly re-enabled
  for controlled rollback. Do not use it for new exports because it transmits
  personal resume data through a URL.
- Text-only PDF extraction does not support scanned resumes or DOCX files yet.
- Candidate review is mandatory; numerical checking and source quotes do not
  establish the truthfulness of every generated claim.
- Frontend PDF pagination/text extraction must be visually checked on longer resumes.

## Production observability

Server logs are **single-line JSON** on stdout/stderr, suitable for Render
Logs, CloudWatch, Datadog or another configured log sink. No server-side log
files or publicly accessible log endpoint are created.

- `http.request.started`: server-generated request ID, HTTP method, path
- `http.request.completed`: request ID, HTTP status and latency in milliseconds
- `http.request.error`: request ID, error class and HTTP status
- `ai.request.started`: request ID, model, provider and in-flight AI calls
- `ai.request.failed`: provider HTTP status, normalized category (authentication,
  rate_limit, billing, timeout, connection, provider_failure), optional error
  code and upstream request ID; never the provider's raw error/body
- `ai.request.completed`: model, latency, input/output/total tokens and
  optional estimated USD cost (not billed cost)
- `ai.response.invalid`: empty output, JSON parse or schema validation failure,
  plus issue count only; no generated text

The API includes `X-Request-ID` in responses. Search your provider's logs for
that ID to find the related HTTP and AI events. On failed requests, look for
`ai.request.failed` to see the actual upstream **status/category**. If the
provider returns a successful HTTP response but invalid JSON, inspect
`ai.response.invalid`.

### Optional token cost estimates

Set both values (USD **per million** tokens):

```dotenv
LLM_INPUT_USD_PER_MILLION=YOUR_VERIFIED_INPUT_RATE
LLM_OUTPUT_USD_PER_MILLION=YOUR_VERIFIED_OUTPUT_RATE
LOG_LEVEL=info
```

Do not guess the prices; retrieve the current rates for your specific
Atria model from your account. `estimatedCostUsd` stays `null` unless both
rates and token counts are present. Retry calls, discounts, minimum charges,
cache rates and provider-specific billing can make the true bill different.

Logs deliberately exclude IP addresses, user identity, query strings,
request/response bodies, resumes, prompts, provider error messages, cookies,
authorization headers and API credentials. Without authentication Resumash
does **not** know which individual user made a request; request IDs show
per-request activity, not a personal activity history.

### Tailor response validation

Schema validation failures emit `ai.response.invalid` with a bounded `issues`
array containing only safe structural paths and Zod error codes. No model
response text, source quotes, unknown property names, or candidate data are logged.
The minimal response normalizer accepts a single `result` wrapper but does not
alter evidence claims, missing data, or incompatible types. Backend numeric,
source-entity, baseline-prose and citation checks still run after validation.
Provider identity is configured with `LLM_PROVIDER`; model, endpoint, and
credentials remain separately configurable.
