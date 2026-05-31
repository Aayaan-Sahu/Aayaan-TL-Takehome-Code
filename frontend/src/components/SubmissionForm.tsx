import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createSubmission,
  getSubmission,
  updateSubmission,
  type AuthorInput,
  type Submission,
  type SubmissionPayload,
  type SubmissionStatus,
} from '../api/submissions'
import { CancelButton, PrimaryButton } from './Buttons'
import { submissionStatusLabels } from './statusPillConfig'

type FormAuthor = {
  name: string
  email: string
}

type FormState = {
  title: string
  doiSuffix: string
  abstract: string
  manuscriptNumber: string
  status: SubmissionStatus
  authors: FormAuthor[]
}

type AuthorErrors = {
  name?: string
  email?: string
}

type FormErrors = {
  title?: string
  doiSuffix?: string
  abstract?: string
  authors?: string
  authorErrors: AuthorErrors[]
}

const blankAuthor = { name: '', email: '' }
const doiPattern = /^[A-Za-z0-9._/-]+$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const statuses = Object.keys(submissionStatusLabels) as SubmissionStatus[]

function makeEmptyForm(): FormState {
  return {
    title: '',
    doiSuffix: '',
    abstract: '',
    manuscriptNumber: `MS-${Date.now()}`,
    status: 'draft',
    authors: [{ ...blankAuthor }],
  }
}

function makeFormFromSubmission(submission: Submission): FormState {
  return {
    title: submission.title,
    doiSuffix: submission.doi_suffix,
    abstract: submission.abstract,
    manuscriptNumber: submission.manuscript_number,
    status: submission.status,
    authors: submission.authors.map((author) => ({
      name: author.name,
      email: author.email ?? '',
    })),
  }
}

function hasErrors(errors: FormErrors) {
  return Boolean(
    errors.title ||
      errors.doiSuffix ||
      errors.abstract ||
      errors.authors ||
      errors.authorErrors.some((author) => author.name || author.email),
  )
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = { authorErrors: form.authors.map(() => ({})) }
  const title = form.title.trim()
  const doiSuffix = form.doiSuffix.trim()
  const abstract = form.abstract.trim()

  if (!title) errors.title = 'Title is required.'
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.'
  else if (title.length > 200) errors.title = 'Title must be fewer than 200 characters.'

  if (!doiSuffix) errors.doiSuffix = 'DOI suffix is required.'
  else if (doiSuffix.length > 100) errors.doiSuffix = 'DOI suffix must be fewer than 100 characters.'
  else if (doiSuffix.includes(' ')) errors.doiSuffix = 'DOI suffix cannot contain spaces.'
  else if (!doiPattern.test(doiSuffix)) {
    errors.doiSuffix =
      'DOI suffix can only contain letters, numbers, hyphens, underscores, periods, and slashes.'
  }

  if (!abstract) errors.abstract = 'Abstract is required.'
  else if (abstract.length < 20) errors.abstract = 'Abstract must be at least 20 characters.'
  else if (abstract.length > 5000) errors.abstract = 'Abstract must be fewer than 5000 characters.'

  if (form.authors.length === 0) errors.authors = 'At least one author is required.'

  form.authors.forEach((author, index) => {
    const name = author.name.trim()
    const email = author.email.trim()

    if (!name) errors.authorErrors[index].name = 'Author name is required.'
    if (email && !emailPattern.test(email)) {
      errors.authorErrors[index].email = 'Author email must be valid.'
    }
  })

  return errors
}

function buildPayload(form: FormState): SubmissionPayload {
  return {
    title: form.title.trim(),
    manuscript_number: form.manuscriptNumber,
    doi_suffix: form.doiSuffix.trim(),
    abstract: form.abstract.trim(),
    status: form.status,
    authors: form.authors.map<AuthorInput>((author) => ({
      name: author.name.trim(),
      email: author.email.trim() || null,
    })),
  }
}

type SubmissionFormProps = {
  initialSubmission?: Submission
}

function SubmissionForm({ initialSubmission }: SubmissionFormProps) {
  const navigate = useNavigate()
  const abstractRef = useRef<HTMLTextAreaElement | null>(null)
  const [form, setForm] = useState<FormState>(() =>
    initialSubmission ? makeFormFromSubmission(initialSubmission) : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({ authorErrors: form.authors.map(() => ({})) })
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useLayoutEffect(() => {
    const textarea = abstractRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [form.abstract])

  function updateField<Field extends keyof Omit<FormState, 'authors'>>(
    field: Field,
    value: FormState[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateAuthor(index: number, field: keyof FormAuthor, value: string) {
    setForm((current) => ({
      ...current,
      authors: current.authors.map((author, authorIndex) =>
        authorIndex === index ? { ...author, [field]: value } : author,
      ),
    }))
  }

  function addAuthor() {
    setForm((current) => ({
      ...current,
      authors: [...current.authors, { ...blankAuthor }],
    }))
  }

  function removeAuthor(index: number) {
    setForm((current) => {
      if (current.authors.length === 1) return current
      return {
        ...current,
        authors: current.authors.filter((_, authorIndex) => authorIndex !== index),
      }
    })
  }

  async function saveSubmission() {
    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    setSubmitError('')

    if (hasErrors(nextErrors)) return

    setIsSubmitting(true)
    try {
      const payload = buildPayload(form)
      if (initialSubmission) {
        await updateSubmission(initialSubmission.id, payload)
      } else {
        await createSubmission(payload)
      }
      navigate('/submissions')
    } catch {
      setSubmitError('Unable to save submission.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-shell">
      <div className="form-card">
        <div className="form-header">
          <h1>Research Object Submission Form</h1>
          <p>Please fill out the form below to complete your submission.</p>
        </div>

        <div className="form-body">
          {submitError && (
            <p className="error-message" role="alert">
              {submitError}
            </p>
          )}

          <label className="form-field">
            Title
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </label>

          <div className="author-section">
            <h2>Add Co-Authors</h2>
            {errors.authors && <span className="field-error">{errors.authors}</span>}

            {form.authors.map((author, index) => (
              <div className="author-row" key={index}>
                <label className="form-field">
                  Author name
                  <input
                    value={author.name}
                    onChange={(event) => updateAuthor(index, 'name', event.target.value)}
                    aria-invalid={Boolean(errors.authorErrors[index]?.name)}
                  />
                  {errors.authorErrors[index]?.name && (
                    <span className="field-error">{errors.authorErrors[index].name}</span>
                  )}
                </label>

                <label className="form-field">
                  Email address
                  <input
                    type="email"
                    value={author.email}
                    onChange={(event) => updateAuthor(index, 'email', event.target.value)}
                    aria-invalid={Boolean(errors.authorErrors[index]?.email)}
                  />
                  {errors.authorErrors[index]?.email && (
                    <span className="field-error">{errors.authorErrors[index].email}</span>
                  )}
                </label>

                {form.authors.length > 1 && (
                  <button
                    className="remove-author"
                    type="button"
                    onClick={() => removeAuthor(index)}
                    aria-label={`Remove author ${index + 1}`}
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            <button className="link-button" type="button" onClick={addAuthor}>
              Add another person
            </button>
          </div>

          <label className="form-field">
            DOI
            <input
              value={form.doiSuffix}
              onChange={(event) => updateField('doiSuffix', event.target.value)}
              aria-invalid={Boolean(errors.doiSuffix)}
            />
            {errors.doiSuffix && <span className="field-error">{errors.doiSuffix}</span>}
          </label>

          <label className="form-field">
            Status
            <select
              value={form.status}
              onChange={(event) => updateField('status', event.target.value as SubmissionStatus)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {submissionStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            Abstract
            <textarea
              ref={abstractRef}
              value={form.abstract}
              onChange={(event) => updateField('abstract', event.target.value)}
              aria-invalid={Boolean(errors.abstract)}
            />
            {errors.abstract && <span className="field-error">{errors.abstract}</span>}
            <span className="field-help">Please provide a short summary of your submission</span>
          </label>
        </div>

        <div className="form-actions">
          <CancelButton
            type="button"
            disabled={isSubmitting}
            onClick={() => navigate('/submissions')}
            text="Cancel"
          />
          <PrimaryButton
            type="button"
            disabled={isSubmitting}
            onClick={saveSubmission}
            text={
              isSubmitting
                ? 'Saving...'
                : initialSubmission
                  ? 'Save Changes'
                  : 'Create Submission'
            }
          />
        </div>
      </div>
    </section>
  )
}

export function SubmissionCreatePage() {
  return <SubmissionForm />
}

export function SubmissionEditPage({ submissionId }: { submissionId: number }) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadSubmission() {
      setIsLoading(true)
      setError('')

      try {
        const nextSubmission = await getSubmission(submissionId, controller.signal)
        setSubmission(nextSubmission)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError('Unable to load submission.')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadSubmission()

    return () => controller.abort()
  }, [submissionId])

  if (isLoading) return <main><p>Loading submission...</p></main>
  if (error) return <main><p role="alert">{error}</p></main>
  if (!submission) return <main><p>Submission not found.</p></main>

  return <SubmissionForm initialSubmission={submission} />
}
