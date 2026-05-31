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
      className="sidebar-nav-icon"
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
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <svg
            aria-hidden="true"
            className="sidebar-avatar-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 1 1 16 0H4Z" />
          </svg>
        </div>
        <div className="sidebar-profile-text">
          <p>Max Bacon</p>
          <p className="sidebar-status">
            <span />
            Offline
          </p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === '/dashboard' &&
              (pathname === '/' || pathname === '/submissions' || pathname.startsWith('/submissions')))

          return (
            <a
              className={`sidebar-nav-link${isActive ? ' is-active' : ''}`}
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
