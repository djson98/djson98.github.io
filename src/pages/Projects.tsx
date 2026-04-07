import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ReadingProgressBar } from '@/components/ReadingProgressBar'
import { ProjectTagChips } from '@/components/ProjectTagChips'
import { Card, CardContent } from '@/components/ui/card'
import { projects } from '@/data/projects'

function Thumbnail({ project }: { project: (typeof projects)[number] }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`${project.title} — project thumbnail`}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <span className="font-sans text-6xl font-bold text-muted-foreground/30 select-none sm:text-7xl">
        {project.title.charAt(0)}
      </span>
    </div>
  )
}

export default function Projects() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState('All')

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach((p) => p.tags.forEach((t) => tags.add(t)))
    return ['All', ...Array.from(tags).sort()]
  }, [])

  const filtered = active === 'All'
    ? projects
    : projects.filter((p) => p.tags.includes(active))

  return (
    <div ref={pageRef}>
      <ReadingProgressBar
        articleRef={pageRef}
        contentKey="projects-list"
        ariaLabel="Projects page scroll progress"
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-9 sm:space-y-10 sm:px-6 sm:py-14 lg:py-16">
      <div className="space-y-1">
        <h1 className="font-sans text-[1.85rem] font-medium tracking-tight text-foreground sm:text-[2.125rem]">
          Projects
        </h1>
        <p className="text-sm text-muted-foreground sm:text-[15px]">
          Selected work — research, web, and production systems.
        </p>
      </div>

      <div
        role="toolbar"
        aria-label="Filter projects by tag"
        className="flex flex-wrap gap-2"
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            aria-pressed={active === tag}
            aria-controls="projects-grid"
            className={cn(
              'inline-flex min-h-10 items-center rounded-full px-3 py-2 text-[11px] font-semibold transition-colors sm:min-h-9 sm:text-xs',
              active === tag
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          id="projects-grid"
          className="rounded-2xl border border-dashed border-border/90 bg-muted/25 px-6 py-14 text-center"
        >
          <p className="text-sm text-muted-foreground sm:text-base">
            No projects match this filter.
          </p>
          <button
            type="button"
            onClick={() => setActive('All')}
            className="mt-4 rounded-md px-2 py-1 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Show all projects
          </button>
        </div>
      ) : (
        <div
          id="projects-grid"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-2 lg:gap-10 2xl:grid-cols-3 2xl:gap-12"
        >
          {filtered.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className={cn(
                'group block h-full rounded-2xl outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <Card className="h-full overflow-hidden border border-border/50 bg-card shadow-none transition-[box-shadow,border-color] duration-300 hover:border-primary/20 hover:shadow-md">
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Thumbnail project={project} />
                </div>
                <CardContent className="space-y-3 p-5 sm:p-6">
                  <div className="space-y-1">
                    <h2 className="font-sans text-[17px] font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                      {project.title}
                    </h2>
                    <p className="text-xs tabular-nums text-muted-foreground sm:text-[13px]">
                      {project.period}
                    </p>
                  </div>
                  <ProjectTagChips tags={project.tags} className="gap-1.5" />
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
