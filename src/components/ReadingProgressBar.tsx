import { useEffect, useState, type RefObject } from 'react'

/** 네비 h-14 아래 고정 읽기 진행률 (3px) */
const PROGRESS_H = 3

export function ReadingProgressBar({
  articleRef,
  contentKey,
  ariaLabel = 'Reading progress',
}: {
  articleRef: RefObject<HTMLElement | null>
  contentKey?: string
  ariaLabel?: string
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = articleRef.current
      if (!el) return

      const scrollY = window.scrollY
      const rect = el.getBoundingClientRect()
      const offsetTop = rect.top + scrollY
      const height = el.offsetHeight
      const vh = window.innerHeight
      const range = height - vh

      if (range <= 0) {
        const p = ((scrollY - offsetTop + vh) / height) * 100
        setProgress(Math.min(100, Math.max(0, p)))
        return
      }

      let p = ((scrollY - offsetTop) / range) * 100
      p = Math.min(100, Math.max(0, p))
      setProgress(p)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [articleRef, contentKey])

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-14 z-40"
      style={{ height: PROGRESS_H }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div className="h-full bg-muted/50">
        <div
          className="h-full bg-primary transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
