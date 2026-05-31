import type { ComponentType } from 'react'
import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { FormsPage } from './components/FormsPage'
import { ManuscriptsPage } from './components/ManuscriptsPage'
import { MyProfilePage } from './components/MyProfilePage'
import { ReportsPage } from './components/ReportsPage'
import { Sidebar } from './components/Sidebar'
import { SubmissionsTable } from './components/SubmissionsTable'
import { SubmissionCreatePage, SubmissionEditPage } from './components/SubmissionForm'
import { UsersPage } from './components/UsersPage'
import './App.css'

const dummyPages: Record<string, ComponentType> = {
  '/forms': FormsPage,
  '/users': UsersPage,
  '/manuscripts': ManuscriptsPage,
  '/reports': ReportsPage,
  '/my-profile': MyProfilePage,
}

function AppShell() {
  return (
    <div className="min-h-screen bg-[#f8f8f9] pl-[232px] text-[#323232]">
      <Sidebar />
      <Outlet />
    </div>
  )
}

function SubmissionsDashboard() {
  return (
    <main className="min-h-screen px-5 py-6">
      <header className="mb-0 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#39AE2A]">Dashboard</h1>
      </header>

      <SubmissionsTable />
    </main>
  )
}

function SubmissionEditRoute() {
  const { submissionId } = useParams()
  const parsedId = Number(submissionId)

  if (!Number.isInteger(parsedId)) {
    return <NotFoundPage />
  }

  return <SubmissionEditPage submissionId={parsedId} />
}

function NotFoundPage() {
  return (
    <main className="min-h-screen px-5 py-6">
      <h1 className="text-3xl font-bold text-[#39AE2A]">Page not found</h1>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<SubmissionsDashboard />} />
        <Route path="submissions" element={<SubmissionsDashboard />} />
        <Route path="submissions/new" element={<SubmissionCreatePage />} />
        <Route path="submissions/:submissionId/edit" element={<SubmissionEditRoute />} />

        {Object.entries(dummyPages).map(([path, Page]) => (
          <Route key={path} path={path.slice(1)} element={<Page />} />
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
