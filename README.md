# Jaylen D. Berry Foundation — Intern portal

A dark, minimal landing page for interns: password-gated access, deliverable tracking (session-only state), required learning links, and a **Coming soon** area for a future Google Drive–connected resource assistant.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ recommended

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_PORTAL_PASSWORD` | Plain text password shown to interns. Required for the gate to accept a login. |

Copy `.env.example` to `.env` and set `VITE_PORTAL_PASSWORD` (any string you share with interns):

```powershell
copy .env.example .env
```

Then edit `.env` with your chosen password. Without this file, the gate shows a configuration message instead of accepting a login.

**Security note:** This project checks the password in the browser for convenience. The value is bundled into client assets—suitable for a soft gate or staging, not for sensitive data. For production, use server-side authentication (session cookies, OAuth, etc.).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

Output is in `dist/`.

## Future: Google Drive + chat assistant

A typical path to the “ask questions about our files” experience:

1. **Google Drive API** — Service account or OAuth for the Foundation’s Drive folder; list and export file metadata and text (Docs as HTML/text, PDFs via extraction).
2. **Indexing** — On a schedule or on file change, chunk text and embed with an embedding model; store vectors in a small DB (e.g. Postgres + pgvector, or a hosted vector store).
3. **Chat API** — Backend route that accepts the user message, retrieves relevant chunks (RAG), and returns an answer with optional citations (file name + link).
4. **Frontend** — Replace the disabled textarea/button with calls to that API; keep the same UI shell.

Alternatively, **Google’s** own AI + Workspace integrations may evolve to support Q&A over Drive with fewer moving parts—worth re-evaluating when you implement.

## License

Private / foundation use.
# JDBF-test-site
