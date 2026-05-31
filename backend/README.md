# Backend

FastAPI API for the author submissions dashboard.

## Setup

From the repo root, start Postgres:

```sh
docker compose up -d postgres
```

From `backend/`, install dependencies and run the API:

```sh
uv sync
uv run uvicorn main:app --reload
```

The API defaults to:

```sh
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/submissions_db
```

Set `DATABASE_URL` if you want to use a different local database.

## Endpoints

- `GET /health`
- `GET /api/submissions`
- `GET /api/submissions/{id}`
- `POST /api/submissions`
- `PUT /api/submissions/{id}`

Tables are created automatically on app startup.
