import { SubmissionsTable } from './components/SubmissionsTable'
import './App.css'

function App() {
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

export default App
