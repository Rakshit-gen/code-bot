# code-bot (Aegis)

The web front end for two code review agents. You paste a GitHub pull request or a repository, and it shows what the agents found, file by file.

This repo is only the UI. The work happens in two separate FastAPI services:

| Page | What it does | Backend |
|---|---|---|
| `/review` | Reviews one pull request with four agents (security, performance, architecture, quality) and lists issues per file with line, severity and a suggested fix | [agent-prm](https://github.com/Rakshit-gen/agent-prm) |
| `/analyze` | Reads a whole repository and writes a report of one kind: general, security, architecture, quality or performance | [agent-code-manage](https://github.com/Rakshit-gen/agent-code-manage) |

Both backends call Llama 3.3 70B on Groq.

## How the PR review page talks to its backend

1. `POST /analyze-pr` with the repo URL and PR number. The backend answers right away with a task id.
2. Every 2.5 seconds, `GET /status/{id}`. The page shows each agent's progress as it comes in.
3. When the status is `completed`, `GET /results/{id}` and render the issues.
4. It gives up after 60 polls (about 2.5 minutes) and shows a timeout.

The repository page is simpler: one `POST /analyze` that waits for the full report.

## Run it locally

You need Node 18+.

```bash
git clone https://github.com/Rakshit-gen/code-bot.git
cd code-bot
npm install
npm run dev
```

Open http://localhost:3000.

The backend URLs are hardcoded to the hosted Render instances:

- `components/PRReviewPage.tsx`: `https://agent-prm.onrender.com`
- `components/CodeBaseAnalyzer.tsx`: `https://agent-code-manage.onrender.com`

To use your own backends, change those two constants. Both run on Render's free tier, so the first request after a quiet period can take 30 seconds or more while the service wakes up.

## Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS with shadcn/ui components
- `motion` for animations, `lucide-react` for icons
- Light and dark theme toggle

## Layout

```
app/page.tsx                    landing page
app/review/page.tsx             PR review
app/analyze/page.tsx            repository analysis
components/PRReviewPage.tsx     PR form, polling, results
components/CodeBaseAnalyzer.tsx repo form and report view
components/FileCard.tsx         issues for one file
components/IssueCard.tsx        a single issue
components/ui/                  shadcn/ui primitives
```

## Limits

- Desktop only. On a phone or tablet the tool pages show a message instead of the form.
- No API URL config through env vars yet, see above.
- The UI has no auth and does not store anything. Results live in the page until you leave it.
