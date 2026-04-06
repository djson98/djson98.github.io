import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectTagChips } from '@/components/ProjectTagChips'
import { projects } from '@/data/projects'

function Thumbnail({ project }: { project: typeof projects[number] }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-72 object-cover"
      />
    )
  }
  return (
    <div className={`w-full h-72 bg-gradient-to-br ${project.gradient}`} />
  )
}

export default function Projects() {
  const navigate = useNavigate()
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
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12 sm:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground/95">
        Projects
      </h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors sm:text-xs ${
              active === tag
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'bg-zinc-200/90 text-zinc-600 hover:bg-zinc-300/90'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="group cursor-pointer bg-card hover:opacity-90 transition-opacity duration-200"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <Thumbnail project={project} />
            <div className="space-y-2.5 p-5">
              <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-[17px]">
                {project.title}
              </h3>
              <ProjectTagChips tags={project.tags} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
