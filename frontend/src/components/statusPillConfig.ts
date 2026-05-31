import type { SubmissionStatus } from "../api/submissions";

export type StatusPillType = SubmissionStatus | "unsubmitted" | "published";

export const statusPillLabels: Record<StatusPillType, string> = {
  draft: "Unsubmitted",
  unsubmitted: "Unsubmitted",
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Published",
  published: "Published",
  rejected: "Rejected",
};

export const statusPillStyles: Record<StatusPillType, string> = {
  draft: "unsubmitted",
  unsubmitted: "unsubmitted",
  submitted: "submitted",
  under_review: "review",
  accepted: "published",
  published: "published",
  rejected: "rejected",
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  draft: statusPillLabels.draft,
  submitted: statusPillLabels.submitted,
  under_review: statusPillLabels.under_review,
  accepted: statusPillLabels.accepted,
  rejected: statusPillLabels.rejected,
};
