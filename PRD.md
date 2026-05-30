PRD: Author Submissions Dashboard
1. Overview

Build a local web application that lets an author manage research publication submissions. The author should be able to view all submissions, search/filter them, create a new submission, and edit an existing submission. Data must persist in a local Postgres database.

This PRD intentionally covers only the author-facing development task. Reviewer status, reviewer management, authentication, editor workflows, and production publishing workflows are out of scope. The broader Kotahi PRD includes reviewer/editor workflows, but the take-home development scope only asks for the author submission dashboard and create/edit flow.

2. Goals

The app should allow the author to:

View a paginated table of submissions.
Search submissions by title.
Filter submissions by status.
Filter submissions by date range.
Create a new submission.
Edit an existing submission.
Persist all submission data in Postgres.
Validate form inputs with clear error messages.
3. Non-Goals

Do not implement:

Authentication or login.
Multiple authors/users.
Reviewer status card.
Reviewer assignment functionality.
Editor dashboard.
Admin dashboard.
Actual DOI registration.
File uploads.
Deployment.
Fully responsive mobile layout.
4. User
Primary User

Author

The author can create and edit their own submissions. Since authentication is out of scope, the app can assume all submissions belong to the same author.

5. Core Pages
5.1 Submissions Dashboard

Route:

/submissions

The dashboard displays all submissions in a table.

Requirements

The page must include:

Page title: Submissions
Create button: New Submission
Search input for submission title
Status filter
Date filter
Paginated table
Table rows with:
Title
DOI suffix
Status tag
Created date
Updated date
Edit button
Table Behavior
Search should filter by title.
Status filter should filter by selected status.
Date filter should filter by created date or updated date. Pick one and label it clearly. I recommend filtering by updated_at.
Pagination should allow moving between pages.
Empty state should appear when no submissions match the filters.
5.2 Create Submission Page

Route:

/submissions/new

The create page allows the author to create a new submission.

Fields
Title
DOI suffix
Authors
Abstract
Status
Behavior
User fills out the form.
User clicks Create Submission.
If validation passes, the submission is saved to Postgres.
User is redirected back to the dashboard.
The new submission appears in the table.
5.3 Edit Submission Page

Route:

/submissions/:id/edit

The edit page allows the author to edit an existing submission.

Fields
Title
DOI suffix
Authors
Abstract
Status
Behavior
Page loads existing submission data.
User edits fields.
User clicks Save Changes.
If validation passes, the submission is updated in Postgres.
User is redirected back to the dashboard.
Updated data appears in the table.
6. Data Model

Keep the schema simple.

submissions
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  manuscript_number TEXT NOT NULL,
  doi_suffix TEXT NOT NULL,
  abstract TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
authors

Since each submission can have multiple authors, use a separate table.

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT
);

This is better than storing authors as a comma-separated string because the create/edit form needs to support adding multiple authors cleanly.

7. Status Values

Use a small fixed enum.

type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected";

Display labels:

{
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected"
}

Do not overbuild a flexible status system. The task only needs status tags and filtering.

8. API Requirements

FastAPI should expose these endpoints.

Get paginated submissions
GET /api/submissions

Query params:

search?: string
status?: string
date_from?: string
date_to?: string
page?: number
page_size?: number

Response:

{
  "items": [
    {
      "id": 1,
      "title": "Example Submission",
      "doi_suffix": "example-submission-2026",
      "abstract": "This is an abstract.",
      "status": "draft",
      "authors": [
        {
          "id": 1,
          "name": "Aayaan Sahu",
          "email": "aayaan@example.com"
        }
      ],
      "created_at": "2026-05-30T12:00:00",
      "updated_at": "2026-05-30T12:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
Get one submission
GET /api/submissions/{id}
Create submission
POST /api/submissions
Update submission
PUT /api/submissions/{id}

No delete endpoint is required unless you want it for testing. The task only asks for create and edit.

9. Form Validation

Apply validation on both frontend and backend.

Title

Rules:

Required
Minimum 3 characters
Maximum 200 characters

Error examples:

Title is required.
Title must be at least 3 characters.
Title must be fewer than 200 characters.
DOI Suffix

Rules:

Required
Maximum 100 characters
Only allow letters, numbers, hyphens, underscores, periods, and slashes
No spaces

Regex:

^[A-Za-z0-9._/-]+$

Error examples:

DOI suffix is required.
DOI suffix cannot contain spaces.
DOI suffix can only contain letters, numbers, hyphens, underscores, periods, and slashes.
Authors

Rules:

At least one author required
Each author name is required
Email is optional
If email is provided, it must be valid

Error examples:

At least one author is required.
Author name is required.
Author email must be valid.
Abstract

Rules:

Required
Minimum 20 characters
Maximum 5000 characters

Error examples:

Abstract is required.
Abstract must be at least 20 characters.
Abstract must be fewer than 5000 characters.
Status

Rules:

Required
Must be one of the allowed status values
10. Frontend Components

Recommended React component structure:

src/
  api/
    submissions.ts
  components/
    Layout.tsx
    Sidebar.tsx
    StatusTag.tsx
    Pagination.tsx
    SubmissionTable.tsx
    SubmissionForm.tsx
    AuthorFields.tsx
  pages/
    SubmissionsDashboard.tsx
    SubmissionCreatePage.tsx
    SubmissionEditPage.tsx
    DummyPage.tsx

The sidebar can link to dummy pages, but only the submissions dashboard needs real functionality.

11. UX Requirements

The app should include:

Loading state while submissions are fetched.
Error state if the API request fails.
Empty state when there are no submissions.
Clear form validation messages.
Disabled submit button while form is submitting.
Success behavior after create/edit, such as redirecting to dashboard.
Dates formatted clearly, for example:
May 30, 2026

or

05/30/2026

Pick one format and use it consistently.

12. Acceptance Criteria

The feature is complete when:

A user can open the dashboard and see a table of persisted submissions.
A user can search submissions by title.
A user can filter submissions by status.
A user can filter submissions by date.
A user can move through paginated results.
A user can click New Submission and create a valid submission.
A user can click Edit on a row and update that submission.
Created and edited submissions remain after refreshing the page.
Invalid form inputs show clear validation errors.
Sidebar dummy links show placeholder pages instead of broken routes.
README explains how to run the React app, FastAPI server, and local Postgres database.
13. Recommended MVP Build Order
Set up React, FastAPI, and Postgres connection.
Create database tables and seed a few submissions.
Implement backend CRUD for submissions and authors.
Build dashboard table without filters.
Add create submission page.
Add edit submission page.
Add search, status filter, date filter, and pagination.
Add form validation and loading/error/empty states.
Polish styling and README.
