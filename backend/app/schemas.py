from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AuthorBase(BaseModel):
    name: str
    email: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Author name is required.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()
        if not value:
            return None
        if "@" not in value or "." not in value.rsplit("@", 1)[-1]:
            raise ValueError("Author email must be valid.")
        return value


class AuthorCreate(AuthorBase):
    pass


class AuthorRead(AuthorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class SubmissionBase(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    manuscript_number: str
    doi_suffix: str = Field(max_length=100, pattern=r"^[A-Za-z0-9._/-]+$")
    abstract: str = Field(min_length=20, max_length=5000)
    status: Literal["draft", "submitted", "under_review", "accepted", "rejected"]

    @field_validator("title", "manuscript_number", "doi_suffix", "abstract", mode="before")
    @classmethod
    def strip_text(cls, value: Any) -> Any:
        if isinstance(value, str):
            return value.strip()
        return value


class SubmissionCreate(SubmissionBase):
    authors: list[AuthorCreate] = Field(min_length=1)


class SubmissionUpdate(SubmissionBase):
    authors: list[AuthorCreate] = Field(min_length=1)


class SubmissionRead(SubmissionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    authors: list[AuthorRead]
    created_at: datetime
    updated_at: datetime


class PaginatedSubmissions(BaseModel):
    items: list[SubmissionRead]
    total: int
    page: int
    page_size: int
    total_pages: int
