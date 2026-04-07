import { useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'theme'
const THEME_TRANSITION_MS = 480

function readDarkFromDom(): boolean {
  return document.documentElement.classList.contains('dark')
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 라이트: 해만 → 클릭 시 다크 + 달.
 * 다크: 달만 → 클릭 시 라이트 + 해.
 * 전환 시 `html.theme-transitioning`으로 전역 색 보간 (index.css).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(readDarkFromDom)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }, [dark])

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current)
    }
  }, [])

  const handleClick = () => {
    if (prefersReducedMotion()) {
      setDark((d) => !d)
      return
    }

    const root = document.documentElement
    root.classList.add('theme-transitioning')

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDark((d) => !d)
      })
    })

    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => {
      root.classList.remove('theme-transitioning')
      transitionTimer.current = null
    }, THEME_TRANSITION_MS)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground',
        'transition-colors duration-150',
        'hover:bg-secondary/70 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span key={dark ? 'dark' : 'light'} className="theme-icon-in inline-flex">
        {dark ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
      </span>
    </button>
  )
}
