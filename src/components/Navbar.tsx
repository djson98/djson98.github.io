import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { ContactPopover } from '@/components/ContactPopover'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects', end: false },
] as const

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'shrink-0 rounded-md px-3 py-2 text-[15px] font-medium md:py-1.5 md:text-sm',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
  )

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(navLinkClass({ isActive }), 'min-w-0 shrink font-display text-base tracking-tight')
          }
        >
          Dongju Son
        </NavLink>

        <div className="hidden min-w-0 shrink-0 items-center gap-0.5 lg:flex lg:flex-nowrap">
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
          <ContactPopover
            align="end"
            side="bottom"
            triggerClassName="shrink-0 px-3 py-1.5 text-[13px] sm:text-sm"
          />
          <ThemeToggle className="shrink-0" />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 lg:hidden hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </nav>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-14 z-40 bg-black/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            className="fixed left-0 right-0 top-14 z-50 border-b border-border/60 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-3 sm:px-6">
              {navItems.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <ContactPopover
                align="start"
                side="bottom"
                triggerClassName="w-full px-3 py-2.5 text-left text-[15px]"
              />
              <div className="mt-1 flex items-center justify-between px-3 py-2">
                <span className="text-[15px] font-medium text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
