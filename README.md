# Author Submissions Dashboard

React + Vite + TypeScript frontend with a FastAPI backend and PostgreSQL database.

## Prerequisites

- Git
- Docker Desktop
- Python 3.11+
- `uv` for Python dependency management
- Node.js 20+ and npm

If you do not have `uv` installed:

```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## 1. Start PostgreSQL with Docker

Install and open Docker Desktop first. From the project root, start the local Postgres container:

```sh
docker compose up -d postgres
```

This starts Postgres on local port `5433` with:

```sh
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=submissions_db
```

To confirm the container is running:

```sh
docker compose ps
```

## 2. Run the Backend

In a new terminal:

```sh
cd backend
uv sync
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend uses this default database URL:

```sh
postgresql+psycopg://postgres:postgres@localhost:5433/submissions_db
```

You can override it with `DATABASE_URL` if needed:

```sh
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/submissions_db uv run uvicorn main:app --reload --port 8000
```

Verify the API:

```sh
curl http://localhost:8000/health
```

Expected response:

```json
{"status":"ok"}
```

The backend creates the required tables automatically when it starts.

## 3. Run the Frontend

In another new terminal:

```sh
cd frontend
npm install
npm run dev
```

Open the app at:

```sh
http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:8000`, so the backend should be running before using the dashboard.

## Useful Commands

Stop the database container:

```sh
docker compose down
```

Reset the local database completely:

```sh
docker compose down -v
docker compose up -d postgres
```

Run the frontend production build:

```sh
cd frontend
npm run build
```

## Database Data

To add data, use the app's New Submission flow or call the API directly:

```sh
curl -X POST http://localhost:8000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Submission",
    "manuscript_number": "MS-001",
    "doi_suffix": "sample.001",
    "abstract": "This is a sample abstract with enough text to pass validation.",
    "status": "submitted",
    "authors": [
      {
        "name": "Jane Author",
        "email": "jane@example.com"
      }
    ]
  }'
```
