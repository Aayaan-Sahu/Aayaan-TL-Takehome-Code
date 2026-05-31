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
const toolbarButtonClasses =
  "inline-flex h-[35px] items-center justify-center rounded-[5px] border-0 bg-[#39ae2a] px-4 font-[Roboto,sans-serif] text-xs leading-normal text-white no-underline transition-colors duration-[120ms] hover:bg-[#2f9324]";
const tableHeadingClasses =
  "border-b border-[#dedede] px-6 py-3.5 text-left text-xs font-normal uppercase leading-[1.15] text-black";
const tableCellClasses =
  "overflow-hidden text-ellipsis border-b border-[#dedede] px-6 py-[34px] align-middle text-base leading-[22px] text-black";
const messageCellClasses =
  "border-b border-[#dedede] px-8 py-[34px] text-left text-base font-normal italic text-[#6c6c6c]";
const paginationButtonClasses =
  "rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 text-[#24292f] transition-colors duration-[120ms] enabled:hover:border-[#8c959f] enabled:hover:bg-[#eef1f4] disabled:text-[#8c959f]";
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
    <section className="mt-[-36px] max-[720px]:mt-0">
      <div className="mb-[30px] flex items-center justify-end gap-2 max-[720px]:flex-col max-[720px]:items-stretch">
        <label className="block">
          <span className="sr-only">Search submissions</span>
          <input
            className="box-border h-[35px] w-[369px] rounded-[5px] border border-[#39ae2a] bg-white px-3 font-[Roboto,sans-serif] text-xs shadow-[0_1px_4px_rgb(0_0_0_/_20%)] max-[720px]:w-full"
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
          className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-full border-0 bg-[#39ae2a] p-0 text-white max-[720px]:w-full max-[720px]:rounded-[5px]"
          type="button"
          aria-label="Search submissions"
          onClick={resetPage}
        >
          <svg className="h-[17px] w-[17px]" aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path
              d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        <Link className={`${toolbarButtonClasses} font-semibold max-[720px]:w-full`} to="/submissions/new">
          + New submission
        </Link>
      </div>

      <div className="overflow-hidden rounded border border-[#dedede] bg-white shadow-[0_1px_4px_rgb(0_0_0_/_12%)] max-[720px]:overflow-x-auto">
        <div className="flex h-[95px] items-center justify-between border-b border-[#dedede] px-8 max-[720px]:h-[72px] max-[720px]:px-[18px]">
          <h2 className="m-0 font-[Roboto,sans-serif] text-base font-bold text-black">Your Submissions</h2>
        </div>

        <table
          className="w-full table-fixed border-collapse font-[Roboto,sans-serif] max-[720px]:min-w-[940px]"
          aria-busy={isLoading}
        >
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[25%]" />
            <col className="w-[16%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="bg-[#f8f8f9]">
            <tr>
              <th className={`${tableHeadingClasses} [overflow-wrap:anywhere]`}>
                MANUSCRIPT
                <br />
                NUMBER
              </th>
              <th className={`${tableHeadingClasses} [overflow-wrap:anywhere]`}>Title</th>
              <th className={tableHeadingClasses}>
                <label className="relative inline-flex h-[35px] w-28 cursor-pointer items-center justify-between rounded-md border border-[#dedede] bg-[#f8f8f9] py-0 pl-2.5 pr-9 font-[Roboto,sans-serif] text-[#323232] shadow-[inset_0_0_4px_rgb(0_0_0_/_25%)] focus-within:border-[#39ae2a] focus-within:shadow-[inset_0_0_4px_rgb(0_0_0_/_25%),0_0_0_2px_rgb(57_174_42_/_18%)]">
                  <span className="text-xs font-normal uppercase leading-none tracking-[0.12px] text-[#323232]">
                    Status
                  </span>
                  <span className="pointer-events-none absolute right-[35px] top-[7px] h-5 w-px bg-[#9b9b9b]" />
                  <span className="pointer-events-none absolute right-[13px] top-3 h-[7px] w-[7px] rotate-45 border-b-[1.5px] border-r-[1.5px] border-[#6c6c6c]" />
                  <select
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
              <th className={tableHeadingClasses}>Created</th>
              <th className={tableHeadingClasses}>Updated</th>
              <th className={`${tableHeadingClasses} overflow-visible text-clip`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isInitialLoading && (
              <tr>
                <td className={messageCellClasses} colSpan={6}>
                  Loading submissions...
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td className={messageCellClasses} colSpan={6} role="alert">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && !hasSubmissions && (
              <tr>
                <td className={messageCellClasses} colSpan={6}>
                  No submissions found.
                </td>
              </tr>
            )}

            {!error &&
              submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className={`${tableCellClasses} [overflow-wrap:anywhere]`}>
                    {submission.manuscript_number}
                  </td>
                  <td className={`${tableCellClasses} font-medium [overflow-wrap:anywhere]`}>
                    {submission.title}
                  </td>
                  <td className={tableCellClasses}>
                    <StatusPill type={submission.status} />
                  </td>
                  <td className={tableCellClasses}>{formatDate(submission.created_at)}</td>
                  <td className={tableCellClasses}>{formatDate(submission.updated_at)}</td>
                  <td className={`${tableCellClasses} overflow-visible text-clip`}>
                    <Link
                      className={`${toolbarButtonClasses} h-7 min-w-[140px] uppercase`}
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
          <div className="mt-4 flex items-center justify-end gap-3 px-6 py-[18px] font-[Roboto,sans-serif]">
            <button
              className={paginationButtonClasses}
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
              className={paginationButtonClasses}
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
