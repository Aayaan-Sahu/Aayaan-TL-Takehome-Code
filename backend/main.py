from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from app.database import Base, engine
from app.routers.submissions import router as submissions_router
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Author Submissions API", lifespan=lifespan)

app.include_router(submissions_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
