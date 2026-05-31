import type { ReactNode } from 'react'

type NavItem = {
  label: string
  href: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5Z" />
    ),
  },
  {
    label: 'Forms',
    href: '/forms',
    icon: (
      <path d="M6 3h12v18H6V3Zm3 5h6M9 12h6M9 16h4" />
    ),
  },
  {
    label: 'Users',
    href: '/users',
    icon: (
      <path d="M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2 21a6 6 0 0 1 12 0M13 18a5 5 0 0 1 8 3" />
    ),
  },
  {
    label: 'Manuscripts',
    href: '/manuscripts',
    icon: (
      <path d="M7 3h7l4 4v14H7V3Zm7 0v5h4M10 12h5M10 16h5" />
    ),
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: (
      <path d="m4 17 4-4 3 3 6-8 3 4M4 21h16" />
    ),
  },
  {
    label: 'My profile',
    href: '/my-profile',
    icon: (
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />
    ),
  },
]

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  )
}

export function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-40 flex-col bg-[#39AE2A] px-5 py-5 text-white">
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#39AE2A]">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 1 1 16 0H4Z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold leading-tight">Max Bacon</p>
          <p className="flex items-center gap-1 text-xs leading-tight">
            <span className="h-2 w-2 rounded-full border border-white bg-red-600" />
            Offline
          </p>
        </div>
      </div>

      <nav className="grid gap-2 text-xs font-medium">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === '/dashboard' &&
              (pathname === '/' || pathname === '/submissions' || pathname.startsWith('/submissions')))

          return (
            <a
              className={`flex items-center gap-2 rounded-md px-1 py-1.5 ${
                isActive ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
              href={item.href}
              key={item.href}
            >
              <NavIcon>{item.icon}</NavIcon>
              {item.label}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
