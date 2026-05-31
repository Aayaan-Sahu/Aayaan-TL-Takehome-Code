import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSubmissions,
  type PaginatedSubmissions,
  type SubmissionStatus,
} from "../api/submissions";
import { StatusPill } from "./StatusPill";
import { submissionStatusLabels } from "./statusPillConfig";

const PAGE_SIZE = 10;

const statuses = Object.keys(submissionStatusLabels) as SubmissionStatus[];
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value: string) {
  return dateFormatter
    .format(new Date(value))
    .replace(/\bAM\b/g, "am")
    .replace(/\bPM\b/g, "pm");
}

export function SubmissionsTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "">("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedSubmissions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadSubmissions() {
      setIsLoading(true);
      setError("");

      try {
        const submissions = await getSubmissions(
          {
            search: search.trim(),
            status,
            page,
            pageSize: PAGE_SIZE,
          },
          controller.signal,
        );
        setData(submissions);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Unable to load submissions.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadSubmissions();

    return () => controller.abort();
  }, [page, search, status]);

  function resetPage() {
    setPage(1);
  }

  const submissions = data?.items ?? [];
  const hasSubmissions = submissions.length > 0;
  const isInitialLoading = isLoading && data === null;

  return (
    <section className="submissions">
      <div className="submissions-toolbar">
        <label className="submissions-search">
          <span className="sr-only">Search submissions</span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder="Search"
          />
        </label>

        <button
          className="submissions-search-button"
          type="button"
          aria-label="Search submissions"
          onClick={resetPage}
        >
          <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path
              d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        <Link className="submissions-new-link" to="/submissions/new">
          + New submission
        </Link>
      </div>

      <div className="submissions-card">
        <div className="submissions-card-header">
          <h2>Your Submissions</h2>
        </div>

        <table className="submissions-table" aria-busy={isLoading}>
          <colgroup>
            <col className="submissions-column-manuscript" />
            <col className="submissions-column-title" />
            <col className="submissions-column-status" />
            <col className="submissions-column-created" />
            <col className="submissions-column-updated" />
            <col className="submissions-column-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>
                MANUSCRIPT
                <br />
                NUMBER
              </th>
              <th>Title</th>
              <th>
                <label className="submissions-status-filter">
                  <span>Status</span>
                  <select
                    value={status}
                    onChange={(event) => {
                      setStatus(event.target.value as SubmissionStatus | "");
                      resetPage();
                    }}
                  >
                    <option value="">All</option>
                    {statuses.map((statusValue) => (
                      <option key={statusValue} value={statusValue}>
                        {submissionStatusLabels[statusValue]}
                      </option>
                    ))}
                  </select>
                </label>
              </th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isInitialLoading && (
              <tr>
                <td className="submissions-message-cell" colSpan={6}>
                  Loading submissions...
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td className="submissions-message-cell" colSpan={6} role="alert">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && !hasSubmissions && (
              <tr>
                <td className="submissions-message-cell" colSpan={6}>
                  No submissions found.
                </td>
              </tr>
            )}

            {!error &&
              submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.manuscript_number}</td>
                  <td>{submission.title}</td>
                  <td>
                    <StatusPill type={submission.status} />
                  </td>
                  <td>{formatDate(submission.created_at)}</td>
                  <td>{formatDate(submission.updated_at)}</td>
                  <td>
                    <Link
                      className="submissions-edit-link"
                      to={`/submissions/${submission.id}/edit`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {!isLoading && !error && hasSubmissions && data !== null && (
          <div className="pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {data.page} of {Math.max(data.total_pages, 1)}
            </span>
            <button
              type="button"
              disabled={data.total_pages === 0 || page >= data.total_pages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
