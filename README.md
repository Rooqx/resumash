# Jobbygenie
 AI Profile Autofill & Job Find Chrome Extension 🤖💼
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]

## One-line summary
A Chrome extension that uses AI to **generate and autofill profile and form content** (bios, skills, gig descriptions), provide **smart replies**, and now **discover jobs, filter, and match** users to relevant web2 and web3 job listings — with a local-first UX, a minimal backend proxy for API keys, and a freemium model (Hugging Face free tier for basic users; OpenAI for premium).

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation (Quickstart)](#installation-quickstart)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Known Issues](#known-issues)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features
- **AI Autofill Engine** — Automatically detects and fills form fields (bio, skills, summary) using AI.
- **Tone Selector** — Pick Professional, Casual, Persuasive, or Friendly tones.
- **Reusable Snippets** — Save and reuse generated content.
- **Multi-profile Support** — Switch personas: Freelancer, Job Seeker, Founder.
- **Quick Rewriter** — Highlight text to rewrite, shorten, or expand.
- **Keyword Optimizer** — SEO suggestions for profiles and gig descriptions.
- **Smart Reply Assistant** — Context-aware reply suggestions.
- **Job Search & Aggregation** — Discover opportunities from multiple sources.
- **Intelligent Matching** — Rank jobs by relevance to your profile.
- **Quick Apply** — Generate tailored application content and autofill forms.
- **Safety First** — Copy-paste fallback and disclaimer for sensitive sites.

---

## Tech Stack

**Frontend (Chrome Extension)**
- Vite + React + TypeScript
- Tailwind CSS
- Chrome Extension Manifest V3

**Backend**
- Express.js + TypeScript
- Hugging Face Inference API (free tier)
- Optional: OpenAI for premium users
- Job aggregation via APIs/RSS feeds
- Hosting: Render (or any preferred host)

---

## Installation (Quickstart)

> Minimal steps to get running locally.

```bash
# Clone
git clone https://github.com/yourusername/ai-profile-autofill.git
cd ai-profile-autofill

# Build and load extension
cd extension
npm install
npm run build

# Start backend
cd ../backend
npm install
export HUGGING_FACE_API_KEY="your_hf_token_here"
npm run dev
```

Then open Chrome → `chrome://extensions` → enable Developer mode → Load unpacked → select `extension/dist` (or extension directory during development).

---

## Usage

### AI Autofill & Writing Assistant
1. Click the extension icon in the toolbar.
2. Choose a profile (e.g., "Freelancer") and tone (e.g., "Professional").
3. Click **Generate** or **Autofill** to fill fields like Bio or Skills.
4. To rewrite text: highlight any text → right-click → **Rewrite with AI**.

### Job Search & Quick Apply
1. Open the extension and go to the **Jobs** tab.
2. Use the search bar and filters (remote, web3, location).
3. Click **Quick Apply** to generate a tailored cover message.
4. Insert generated message into the application form or copy for manual paste.

---

## Configuration

### Environment variables (backend)
| Variable | Component | Description |
|---|---:|---|
| HUGGING_FACE_API_KEY | Backend | Hugging Face token for inference API |
| OPENAI_API_KEY | Backend (optional) | OpenAI key for premium features |
| VITE_BACKEND_URL | Frontend | Backend API URL (e.g. http://localhost:3000) |
| PORT | Backend | Server port (default: 3000 or 3001) |
| JOB_API_KEYS | Backend | Optional job API keys (Remotive, RemoteOK) |

Set variables in a `.env` file or export them in your shell.

---

## API Documentation

**Base URL:** `http://localhost:3000` (or your deployed API)

### POST `/generate`
**Description:** Core endpoint for AI generation tasks (autofill, rewrite, reply).

**Request**
```json
{
  "model": "hf-mistral",
  "type": "autofill|rewrite|keywords|reply",
  "tone": "professional",
  "profile": "freelancer",
  "context": {
    "pageUrl": "...",
    "selectedText": "...",
    "formFields": [{ "name": "bio", "value": "" }]
  }
}
```

**Response**
```json
{
  "ok": true,
  "result": "Generated content here...",
  "meta": { "tokens": 123 }
}
```

### POST `/jobs/search`
**Description:** Search aggregated job listings.

**Request**
```json
{
  "q": "react developer",
  "filters": { "remote": true, "web3": true, "location": "" },
  "page": 1,
  "perPage": 20
}
```

**Response**
```json
{
  "ok": true,
  "results": [
    { "id": "...", "title": "React Developer", "company": "X", "url": "..." }
  ],
  "total": 123
}
```

---

## Contributing
We welcome contributions!

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Run tests & lint: `npm test && npm run lint`
4. Commit with clear message: `git commit -m "feat: add job search filter"`
5. Push and open a Pull Request.

_Add a `CONTRIBUTING.md` and PR template for maintainers._

---

## Roadmap
- Embedding-based job matching
- Alerts & saved searches
- Premium tier with OpenAI models
- Job scraping (careful: respect ToS)
- Team collaboration & cross-browser support

---

## Known Issues
- Sites using complex frameworks may block programmatic insertion.
- Anti-automation measures limit functionality on some platforms.
- Free model outputs can vary in quality — allow user review before inserting.
- Aggregation limited to available APIs and feeds.

---

## License
This project is licensed under the **MIT License**. See `LICENSE` for details.

---

## Acknowledgements
- Hugging Face — free model access
- Job API providers (Remotive, RemoteOK, WeWorkRemotely)
- Chrome Extensions docs and the open-source community

---

