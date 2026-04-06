import { NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header
      className={
        isHome
          ? 'sticky top-0 z-50 w-full border-b border-white/30 bg-white/45 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/35'
          : 'sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-md'
      }
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <NavLink
          to="/"
          className="font-display text-sm font-semibold tracking-tight text-foreground/95 transition-opacity hover:opacity-75"
        >
          Dongju Son
        </NavLink>
        <div className="flex items-center gap-1">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/projects', label: 'Projects', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors sm:text-sm ${
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
