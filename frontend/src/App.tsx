import type { ComponentType, ReactNode } from 'react'
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

function getEditSubmissionId(pathname: string) {
  const match = pathname.match(/^\/submissions\/(\d+)\/edit$/)
  return match ? Number(match[1]) : null
}

function AppShell({ children, pathname }: { children: ReactNode; pathname: string }) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] pl-40 text-[#323232]">
      <Sidebar pathname={pathname} />
      {children}
    </div>
  )
}

function SubmissionsDashboard() {
  return (
    <main className="min-h-screen px-5 py-6">
      <header className="mb-12 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#39AE2A]">Dashboard</h1>
        <a
          className="rounded-md bg-[#39AE2A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#347554]"
          href="/submissions/new"
        >
          + New submission
        </a>
      </header>

      <SubmissionsTable />
    </main>
  )
}

function App() {
  const pathname = window.location.pathname
  const editSubmissionId = getEditSubmissionId(pathname)
  const DummyPage = dummyPages[pathname]

  if (pathname === '/' || pathname === '/dashboard' || pathname === '/submissions') {
    return (
      <AppShell pathname={pathname}>
        <SubmissionsDashboard />
      </AppShell>
    )
  }

  if (pathname === '/submissions/new') {
    return (
      <AppShell pathname={pathname}>
        <SubmissionCreatePage />
      </AppShell>
    )
  }

  if (editSubmissionId !== null) {
    return (
      <AppShell pathname={pathname}>
        <SubmissionEditPage submissionId={editSubmissionId} />
      </AppShell>
    )
  }

  if (DummyPage) {
    return (
      <AppShell pathname={pathname}>
        <DummyPage />
      </AppShell>
    )
  }

  return (
    <AppShell pathname={pathname}>
      <main className="min-h-screen px-5 py-6">
        <h1 className="text-3xl font-bold text-[#39AE2A]">Page not found</h1>
      </main>
    </AppShell>
  )
}

export default App
