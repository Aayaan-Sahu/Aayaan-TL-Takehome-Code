export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'

export type Author = {
  id: number
  name: string
  email: string | null
}

export type Submission = {
  id: number
  title: string
  manuscript_number: string
  doi_suffix: string
  abstract: string
  status: SubmissionStatus
  authors: Author[]
  created_at: string
  updated_at: string
}

export type PaginatedSubmissions = {
  items: Submission[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type SubmissionListParams = {
  search?: string
  status?: SubmissionStatus | ''
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export async function getSubmissions(
  params: SubmissionListParams,
  signal?: AbortSignal,
): Promise<PaginatedSubmissions> {
  const query = new URLSearchParams()

  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  if (params.dateFrom) query.set('date_from', params.dateFrom)
  if (params.dateTo) query.set('date_to', params.dateTo)
  if (params.page) query.set('page', String(params.page))
  if (params.pageSize) query.set('page_size', String(params.pageSize))

  const response = await fetch(`/api/submissions?${query.toString()}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('Unable to load submissions.')
  }

  return response.json()
}
