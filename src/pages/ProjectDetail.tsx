import { useParams, useNavigate } from 'react-router-dom'
import { ProjectTagChips } from '@/components/ProjectTagChips'
import { Separator } from '@/components/ui/separator'
import { projects } from '@/data/projects'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Project not found.</p>
        <button onClick={() => navigate('/projects')} className="text-sm underline">
          ← Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-7 px-6 py-12 sm:py-14">
      <button
        onClick={() => navigate('/projects')}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to Projects
      </button>

      {/* Thumbnail */}
      <div className="rounded-xl overflow-hidden">
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-56 object-cover" />
        ) : (
          <div className={`w-full h-56 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
            <span className="text-white text-6xl font-bold opacity-20 select-none">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground/95 sm:text-[1.65rem]">
            {project.title}
          </h1>
          <span className="mt-1 whitespace-nowrap text-[13px] text-muted-foreground sm:text-sm">
            {project.period}
          </span>
        </div>
        <ProjectTagChips tags={project.tags} />
      </div>

      <Separator />

      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{project.summary}</p>

      <div className="whitespace-pre-line text-[15px] leading-[1.75] text-foreground/90 sm:text-base sm:leading-[1.8]">
        {project.description}
      </div>
    </div>
  )
}
