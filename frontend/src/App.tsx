import { SubmissionsTable } from './components/SubmissionsTable'
import { SubmissionCreatePage, SubmissionEditPage } from './components/SubmissionForm'
import './App.css'

function getEditSubmissionId(pathname: string) {
  const match = pathname.match(/^\/submissions\/(\d+)\/edit$/)
  return match ? Number(match[1]) : null
}

function SubmissionsDashboard() {
  return (
    <main>
      <header className="page-header">
        <h1>Submissions</h1>
        <a href="/submissions/new">New Submission</a>
      </header>

      <SubmissionsTable />
    </main>
  )
}

function App() {
  const pathname = window.location.pathname
  const editSubmissionId = getEditSubmissionId(pathname)

  if (pathname === '/' || pathname === '/submissions') {
    return <SubmissionsDashboard />
  }

  if (pathname === '/submissions/new') {
    return <SubmissionCreatePage />
  }

  if (editSubmissionId !== null) {
    return <SubmissionEditPage submissionId={editSubmissionId} />
  }

  return (
    <main>
      <h1>Page not found</h1>
      <p>This page has not been implemented.</p>
    </main>
  )
}

export default App
