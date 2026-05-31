from datetime import date
from math import ceil

from app.database import get_db
from app.models import Author, Submission
from app.schemas import PaginatedSubmissions, SubmissionCreate, SubmissionRead, SubmissionUpdate
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Date, cast, func, select
from sqlalchemy.orm import Session, selectinload

router = APIRouter(prefix="/api/submissions", tags=["submissions"])


def build_submission(payload: SubmissionCreate | SubmissionUpdate) -> Submission:
    return Submission(
        title=payload.title,
        manuscript_number=payload.manuscript_number,
        doi_suffix=payload.doi_suffix,
        abstract=payload.abstract,
        status=payload.status,
        authors=[
            Author(name=author.name, email=author.email)
            for author in payload.authors
        ],
    )


@router.get("", response_model=PaginatedSubmissions)
def list_submissions(
    search: str | None = None,
    status: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
) -> PaginatedSubmissions:
    filters = []

    if search:
        filters.append(Submission.title.ilike(f"%{search}%"))
    if status:
        filters.append(Submission.status == status)
    if date_from:
        filters.append(cast(Submission.updated_at, Date) >= date_from)
    if date_to:
        filters.append(cast(Submission.updated_at, Date) <= date_to)

    page = max(page, 1)
    page_size = max(page_size, 1)

    total = db.scalar(select(func.count()).select_from(Submission).where(*filters)) or 0
    submissions = db.scalars(
        select(Submission)
        .options(selectinload(Submission.authors))
        .where(*filters)
        .order_by(Submission.updated_at.desc(), Submission.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return PaginatedSubmissions(
        items=submissions,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total else 0,
    )


@router.get("/{submission_id}", response_model=SubmissionRead)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
) -> Submission:
    submission = db.scalar(
        select(Submission)
        .options(selectinload(Submission.authors))
        .where(Submission.id == submission_id)
    )
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission


@router.post("", response_model=SubmissionRead)
def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
) -> Submission:
    submission = build_submission(payload)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return get_submission(submission.id, db)


@router.put("/{submission_id}", response_model=SubmissionRead)
def update_submission(
    submission_id: int,
    payload: SubmissionUpdate,
    db: Session = Depends(get_db),
) -> Submission:
    submission = db.scalar(
        select(Submission)
        .options(selectinload(Submission.authors))
        .where(Submission.id == submission_id)
    )
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.title = payload.title
    submission.manuscript_number = payload.manuscript_number
    submission.doi_suffix = payload.doi_suffix
    submission.abstract = payload.abstract
    submission.status = payload.status
    submission.authors = [
        Author(name=author.name, email=author.email)
        for author in payload.authors
    ]

    db.commit()
    db.refresh(submission)
    return get_submission(submission.id, db)
