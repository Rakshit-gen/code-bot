# Codebase Analysis Agent

AI-powered codebase analyzer using Groq (Llama 3.3 70B) and GitHub API with FastAPI. No Redis required - completely stateless service.

## Features

- **Multiple Analysis Types**: General, Security, Architecture, Code Quality, Performance
- **GitHub Integration**: Webhook support for automated analysis on push
- **Stateless Design**: No database or Redis needed
- **FastAPI**: High-performance async API with automatic OpenAPI docs
- **Groq LLM**: Lightning-fast inference with Llama 3.3 70B

## Backend Microservices at

PR Review Agent - https://github.com/Rakshit-gen/agent-prm
Codebase Review Agent - https://github.com/Rakshit-gen/agent-code-manage

## Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GITHUB_TOKEN=ghp_your_actual_github_token_here
PORT=8000
```

**Get API Keys:**
- Groq API: https://console.groq.com/keys (Sign up for free)
- GitHub Token: https://github.com/settings/tokens (Create personal access token with `repo` scope)

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Locally

```bash
python main.py
```

### 4. Deploy to Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables in Render dashboard:
   - `GROQ_API_KEY`
   - `GITHUB_TOKEN`
   - `PORT=8000`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## API Endpoints

### Interactive API Docs

FastAPI provides automatic interactive documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Analyze Repository

```bash
POST /analyze
Content-Type: application/json

{
  "repository": "owner/repo-name",
  "type": "general"
}
```

**Repository formats supported:**
- `owner/repo` (e.g., `facebook/react`)
- `https://github.com/owner/repo`
- `https://www.github.com/owner/repo`

**Analysis Types:**
- `general` - Comprehensive overview
- `security` - Security vulnerabilities and best practices
- `architecture` - Design patterns and structure
- `quality` - Code quality and maintainability
- `performance` - Performance bottlenecks and optimization

**Example:**

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "facebook/react",
    "type": "architecture"
  }'
```

Or use the interactive docs at `/docs` for easy testing!

### Health Check

```bash
GET /health
```

### GitHub Webhook

```bash
POST /webhook
```

Set up webhook in GitHub repository settings:
- Payload URL: `https://your-service.onrender.com/webhook`
- Content type: `application/json`
- Events: Push events

## Response Format

```json
{
  "success": true,
  "repository": "owner/repo",
  "analysis_type": "general",
  "analysis": "Detailed analysis text...",
  "files_analyzed": 10,
  "stars": 12500,
  "language": "Python"
}
```

## Key Features

- **Fast Analysis**: Groq provides blazing-fast inference speeds
- **Multiple Model Fallbacks**: Automatically tries alternative models if rate limited
  - Primary: Llama 3.3 70B Versatile (best quality, latest model)
  - Fallback 1: Qwen3 32B (large 32K context window)
  - Fallback 2: Gemma2 9B IT (Google's efficient model)
  - Fallback 3: Llama 3.1 8B Instant (fastest, lower token usage)
- **Deep Directory Exploration**: Recursively analyzes all folders including:
  - `app/` folders (Next.js)
  - `src/` directories
  - `components/` folders
  - `pages/`, `api/`, `lib/`, etc.
- **README Priority**: Always includes README.md as the first file analyzed
- **Smart File Prioritization**: Focuses on important files first (main, index, routes, components)
- **Flexible Repository Input**: Accepts both `owner/repo` format and full GitHub URLs
- **Async Operations**: FastAPI's async support for better performance
- **Auto Documentation**: Interactive API docs at `/docs` and `/redoc`
- Analyzes up to 10 key source files across all directories (README + 9 other files)
- Reads repository structure up to 3 levels deep (50 items max)
- Includes README content (first 1000 chars)
- Each file limited to 1000 characters in analysis
- Files over 50KB are skipped to avoid token limits
- Supports 12+ programming languages
- Automatic webhook-based analysis

## Error Handling

All errors return appropriate HTTP status codes with error messages:

```json
{
  "success": false,
  "error": "Error description"
}
```

## Notes

- **Deep Folder Analysis**: The service recursively explores ALL directories including:
  - Next.js: `app/`, `pages/`, `components/`, `lib/`, `public/`
  - React: `src/`, `components/`, `hooks/`, `utils/`
  - Backend: `api/`, `routes/`, `controllers/`, `models/`, `services/`
  - Any nested structure is automatically explored
- **Smart Prioritization**: Files are analyzed in order of importance:
  1. Main entry points (main.*, app.*, index.*)
  2. API routes and controllers
  3. Components and pages
  4. Configuration files
  5. Other source files
- **Rate Limits**: The service automatically falls back to faster models if you hit Groq's rate limits
- **Token Optimization**: Request size optimized to stay within free tier limits (6000 TPM)
- **Free Tier**: Groq offers generous free tier - upgrade for more at https://console.groq.com/settings/billing
- Files over 50KB are skipped to avoid token limits
- Maximum 10 files analyzed per request
- Each file limited to 1000 characters in analysis
- README limited to 1000 characters
- Repository structure limited to 50 items
- Works with public repositories (private repos need appropriate GitHub token permissions)
