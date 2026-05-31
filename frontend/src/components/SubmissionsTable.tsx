import { useEffect, useState } from "react";
import {
  getSubmissions,
  type PaginatedSubmissions,
  type SubmissionStatus,
} from "../api/submissions";

const PAGE_SIZE = 10;

const statusLabels: Record<SubmissionStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const statuses = Object.keys(statusLabels) as SubmissionStatus[];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SubmissionsTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
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
            dateFrom,
            dateTo,
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
  }, [dateFrom, dateTo, page, search, status]);

  function resetPage() {
    setPage(1);
  }

  return (
    <section className="submissions">
      <div className="filters">
        <label>
          Search title
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder="Search submissions"
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as SubmissionStatus | "");
              resetPage();
            }}
          >
            <option value="">All statuses</option>
            {statuses.map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusLabels[statusValue]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Updated from
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              resetPage();
            }}
          />
        </label>

        <label>
          Updated to
          <input
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              resetPage();
            }}
          />
        </label>
      </div>

      {isLoading && <p>Loading submissions...</p>}
      {error && <p role="alert">{error}</p>}

      {!isLoading && !error && data?.items.length === 0 && (
        <p>No submissions found.</p>
      )}

      {!isLoading && !error && data !== null && data.items.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>DOI suffix</th>
                <th>Status</th>
                <th>Created date</th>
                <th>Updated date</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.title}</td>
                  <td>{submission.doi_suffix}</td>
                  <td>{statusLabels[submission.status]}</td>
                  <td>{formatDate(submission.created_at)}</td>
                  <td>{formatDate(submission.updated_at)}</td>
                  <td>
                    <a href={`/submissions/${submission.id}/edit`}>Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      )}
    </section>
  );
}
