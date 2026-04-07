import { useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ReadingProgressBar } from '@/components/ReadingProgressBar'
import { ProjectDetailToc } from '@/components/ProjectDetailToc'
import { ProjectTagChips } from '@/components/ProjectTagChips'
import { Separator } from '@/components/ui/separator'
import { projects } from '@/data/projects'

const scrollAnchor = 'scroll-mt-24'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === id)
  const articleRef = useRef<HTMLElement>(null)

  const tocItems = useMemo(() => {
    if (!project) return []
    return [
      { id: `${project.id}-summary`, label: 'Summary' },
      ...project.sections.map((s, i) => ({
        id: `${project.id}-section-${i}`,
        label: s.title,
      })),
    ]
  }, [project])

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-12 sm:px-6 sm:py-14">
        <p className="text-muted-foreground">Project not found.</p>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="rounded-lg px-3 py-2 text-sm font-medium text-primary underline-offset-4 transition-colors hover:bg-muted hover:underline"
        >
          ← Back to Projects
        </button>
      </div>
    )
  }

  return (
    <>
      <ReadingProgressBar
        articleRef={articleRef}
        contentKey={project.id}
        ariaLabel="Article reading progress"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <aside className="hidden lg:block lg:min-h-0">
            <div className="sticky top-[calc(3.5rem+3px)] max-h-[calc(100vh-3.5rem-3px-1rem)] overflow-y-auto overscroll-contain pb-8">
              <ProjectDetailToc items={tocItems} />
            </div>
          </aside>

          <article
            ref={articleRef}
            className="min-w-0 max-w-2xl lg:max-w-none lg:justify-self-center lg:w-full lg:max-w-2xl"
          >
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground -ml-2"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Back to Projects
          </button>

          {/* Thumbnail */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm ring-1 ring-black/[0.03] lg:mt-10">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} — project image`}
                className="h-56 w-full object-cover sm:h-64"
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center bg-muted sm:h-64">
                <span className="font-sans text-7xl font-bold text-muted-foreground/30 select-none">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Header */}
          <header className="mt-8 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h1 className="font-sans text-2xl font-medium tracking-tight text-foreground sm:text-[1.75rem]">
                {project.title}
              </h1>
              <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground sm:mt-1 sm:text-sm">
                {project.period}
              </span>
            </div>
            <ProjectTagChips tags={project.tags} />
          </header>

          {/* 모바일·태블릿 목차 (제목 아래) */}
          <div className="mt-6 lg:hidden">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <ProjectDetailToc items={tocItems} />
            </div>
          </div>

          <Separator className="mt-8 opacity-60" />

          <div id={`${project.id}-summary`} className={scrollAnchor}>
            <p className="pt-8 text-[15px] leading-relaxed text-muted-foreground sm:text-base">{project.summary}</p>
          </div>

          <div className="mt-10 space-y-10">
            {project.sections.map((section, i) => (
              <section
                key={section.title}
                id={`${project.id}-section-${i}`}
                className={`space-y-2 ${scrollAnchor}`}
              >
                <h2 className="font-sans text-lg font-medium tracking-tight text-foreground sm:text-[1.125rem]">
                  {section.title}
                </h2>
                <p className="text-[15px] leading-[1.75] text-foreground/90 sm:text-base sm:leading-[1.8]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
          </article>
        </div>
      </div>
    </>
  )
}
