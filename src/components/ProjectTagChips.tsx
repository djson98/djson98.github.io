import { cn } from '@/lib/utils'

/** 프로젝트 카드(`Projects.tsx`)와 동일한 태그 칩 */
export function ProjectTagChip({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-zinc-200/90 px-2 py-0.5 text-[11px] font-medium text-zinc-600 sm:text-xs">
      #{tag}
    </span>
  )
}

export function ProjectTagChips({
  tags,
  className,
}: {
  tags: string[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {tags.map((t) => (
        <ProjectTagChip key={t} tag={t} />
      ))}
    </div>
  )
}
