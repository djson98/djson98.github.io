import { cn } from '@/lib/utils'

type TocItem = { id: string; label: string }

/** 프로젝트 상세 — 왼쪽(sticky) + 모바일 상단 목차 */
export function ProjectDetailToc({ items, className }: { items: TocItem[]; className?: string }) {
  return (
    <nav aria-label="On this page" className={cn(className)}>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-0.5 border-l border-border/70">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="group -ml-px block border-l-2 border-transparent py-1.5 pl-3 text-left text-[13px] leading-snug text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-r-md"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
