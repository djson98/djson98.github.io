import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectTagChips } from '@/components/ProjectTagChips'
import { Separator } from '@/components/ui/separator'

const GrassCapybaraThree = lazy(() => import('@/components/GrassCapybaraThree'))
import haiLogo from '../../asset/hai.png'
import kcmedLogo from '../../asset/logo.png'
import nshcLogo from '../../asset/nshc.png'

type BulletItem = { text: string; projectId?: string }

type ExperienceItem = {
  org: string
  role: string
  period: string
  location?: string
  items: BulletItem[]
  logo?: string
  tags: string[]
}

const experience: ExperienceItem[] = [
  {
    org: 'Human–AI Interaction Lab, Kangwon National University',
    role: 'Research Intern',
    period: 'Dec. 2023 – Present',
    location: 'Chuncheon, South Korea',
    logo: haiLogo,
    items: [
      { text: 'AI Civil Complaint Classification', projectId: 'ai-civil-complaint' },
      { text: 'Lab Website', projectId: 'hai-lab-website' },
    ],
    tags: ['NLP', 'ML', 'LLM', 'Web', 'HCI'],
  },
  {
    org: 'NSHC Singapore, Safe Square',
    role: 'Intern',
    period: 'Jan. 2026 – Feb. 2026',
    location: 'Singapore',
    logo: nshcLogo,
    items: [
      { text: 'AI Phishing Training Automation', projectId: 'ai-phishing-training' },
    ],
    tags: ['LLM', 'Security', 'Automation'],
  },
  {
    org: 'The Korea Clinical Medicine Center (KCMED)',
    role: 'Intern',
    period: 'Aug. 2024 – Dec. 2024',
    location: 'Chuncheon, South Korea',
    logo: kcmedLogo,
    items: [
      { text: 'Clinical ML & Visualization', projectId: 'clinical-ml' },
    ],
    tags: ['ML', 'Visualization', 'Clinical'],
  },
]

const additional = [
  { title: 'Teaching Assistant, Python Programming', year: '2024 – 2026', tags: ['Teaching'] },
  { title: 'Teaching Assistant, Web Programming', year: '2024 – 2026', tags: ['Teaching'] },
  { title: 'Founder, CapybaraLab', year: 'Sep. 2025', tags: ['Entrepreneurship'] },
]

const awards = [
  {
    title: 'Honorable Mention, Capstone Project Competition',
    year: '2025',
    tags: ['Capstone'],
  },
  {
    title: 'Excellence Award, Regional Intelligence Center Creative & Autonomous Project',
    year: '2024',
    tags: ['NLP'],
    link: 'https://www.veritas-a.com/news/articleView.html?idxno=531813',
    linkLabel: 'press',
  },
  {
    title: 'Outstanding Essay Award, Kangwon National University',
    year: '2023',
    tags: ['Essay'],
  },
]

/** 날짜 | 본문 | 태그, 테두리 없음 */
const cvGrid3 =
  'group grid grid-cols-1 sm:grid-cols-[10rem_1fr_minmax(0,5.5rem)] gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-1 items-start text-base sm:text-[17px] leading-[1.7] rounded-lg -mx-3 px-3 py-2 transition-colors hover:bg-muted/50'
const cvColDate =
  'text-xs sm:text-[13px] text-muted-foreground/60 tabular-nums whitespace-nowrap font-medium transition-colors group-hover:text-muted-foreground'
const cvHeader3 =
  'hidden sm:grid sm:grid-cols-[10rem_1fr_auto] gap-x-6 sm:gap-x-8 pb-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80'

/** Experience 상세: 로고 열 | 본문 열 (테두리 없음) */
const expDetailGrid =
  'grid grid-cols-[minmax(2.75rem,auto)_1fr] gap-x-3 items-start min-w-0'

function CvColumnHead3({
  left,
  center,
  right,
  className,
}: {
  left: string
  center: string
  right: string
  className?: string
}) {
  return (
    <div className={cn(cvHeader3, className)}>
      <span>{left}</span>
      <span>{center}</span>
      <span className="text-right sm:min-w-[6.5rem]">{right}</span>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* Hero: 카피바라 GLB만 (텍스트·풀 없음) */}
      <section className="relative -mt-14 min-h-[min(72vh,560px)] w-full overflow-hidden pt-14">
        <Suspense fallback={null}>
          <GrassCapybaraThree />
        </Suspense>
      </section>

      {/* Content: 2-column layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex flex-col gap-14 lg:flex-row lg:gap-16">

          {/* ── 왼쪽: Experience / Awards ── */}
          <div className="min-w-0 flex-1 space-y-14">

            {/* Experience */}
            <section className="space-y-5">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground/95">
                Experience
              </h2>
              <Separator className="opacity-50" />
              <table className="w-full border-collapse text-base sm:text-[17px] leading-[1.7]">
                <thead className="hidden sm:table-header-group">
                  <tr className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                    <th className="pb-2.5 text-left font-semibold pr-6 whitespace-nowrap">Date</th>
                    <th className="pb-2.5 text-left font-semibold px-6">Details</th>
                    <th className="pb-2.5 text-right font-semibold">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {experience.map((exp) => (
                    <tr key={exp.org} className="group align-top transition-colors hover:bg-muted/50">
                      <td className={cn(cvColDate, 'pr-6 py-2 whitespace-nowrap', exp.logo && 'pt-4')}>
                        {exp.period}
                      </td>
                      <td className="px-6 py-2 min-w-0">
                        <div className={exp.logo ? expDetailGrid : ''}>
                          {exp.logo && (
                            <img src={exp.logo} alt="" className="max-h-8 max-w-[4rem] w-auto h-auto shrink-0" width={40} height={40} />
                          )}
                          <div className="min-w-0 space-y-2.5">
                            <p className="text-[17px] font-semibold leading-snug tracking-tight text-foreground">
                              {exp.org}
                            </p>
                            <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                              {[exp.role, exp.location].filter(Boolean).join(' · ')}
                            </p>
                            <ul className="space-y-1.5 pl-1">
                              {exp.items.map((item) => (
                                <li key={item.text} className="text-sm leading-[1.7] text-foreground/75 sm:text-[15px]">
                                  {item.projectId ? (
                                    <Link
                                      to={`/projects/${item.projectId}`}
                                      className="inline-flex items-baseline gap-0.5 text-foreground/70 underline-offset-2 hover:underline hover:text-foreground transition-colors group"
                                    >
                                      {item.text}
                                      <ArrowUpRight className="inline h-3.5 w-3.5 shrink-0 self-center text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                                    </Link>
                                  ) : item.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-right align-top">
                        <ProjectTagChips tags={exp.tags} className="justify-end" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Awards */}
            <section className="space-y-5">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground/95">
                Honors & Awards
              </h2>
              <Separator className="opacity-50" />
              <table className="w-full border-collapse text-base sm:text-[17px] leading-[1.7]">
                <thead className="hidden sm:table-header-group">
                  <tr className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                    <th className="pb-2.5 text-left font-semibold pr-6 whitespace-nowrap">Date</th>
                    <th className="pb-2.5 text-left font-semibold px-6">Title</th>
                    <th className="pb-2.5 text-right font-semibold">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((a) => (
                    <tr key={a.title} className="group align-top transition-colors hover:bg-muted/50">
                      <td className={cn(cvColDate, 'pr-6 py-2 whitespace-nowrap')}>{a.year}</td>
                      <td className="px-6 py-2 min-w-0 leading-relaxed text-foreground/85">
                        {a.title}
                        {'link' in a && a.link && (
                          <a
                            href={a.link as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground/50 hover:text-foreground transition-colors"
                          >
                            {('linkLabel' in a ? a.linkLabel as string : undefined) ?? 'link'}
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                      <td className="py-2 text-right align-top">
                        <ProjectTagChips tags={a.tags} className="justify-end" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Additional */}
            <section className="space-y-5">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground/95">
                Additional
              </h2>
              <Separator className="opacity-50" />
              <table className="w-full border-collapse text-base sm:text-[17px] leading-[1.7]">
                <thead className="hidden sm:table-header-group">
                  <tr className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                    <th className="pb-2.5 text-left font-semibold pr-6 whitespace-nowrap">Date</th>
                    <th className="pb-2.5 text-left font-semibold px-6">Title</th>
                    <th className="pb-2.5 text-right font-semibold">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {additional.map((a) => (
                    <tr key={a.title} className="group align-top transition-colors hover:bg-muted/50">
                      <td className={cn(cvColDate, 'pr-6 py-2 whitespace-nowrap')}>{a.year}</td>
                      <td className="px-6 py-2 min-w-0 leading-relaxed text-foreground/85">{a.title}</td>
                      <td className="py-2 text-right align-top">
                        <ProjectTagChips tags={a.tags} className="justify-end" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

          </div>

          {/* ── 오른쪽: 사진 + 소개 (sticky) ── */}
          <aside className="lg:sticky lg:top-20 lg:w-72 lg:shrink-0 lg:self-start space-y-5">
            <div className="aspect-square w-48 overflow-hidden rounded-2xl bg-muted/60 ring-1 ring-border/40 lg:w-full">
              {/* 사진 파일을 asset/ 에 넣고 아래 주석 해제하세요 */}
              {/* <img src={profilePhoto} alt="Dongjun Son" className="h-full w-full object-cover" /> */}
              <div className="flex h-full w-full items-center justify-center text-6xl text-muted-foreground/20 select-none">
                📷
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                Dongjun Son
              </h2>
              <p className="text-sm leading-[1.8] text-foreground/70">
                Senior CS student at{' '}
                <a
                  href="https://cse.kangwon.ac.kr/cse/index.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground/90 underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-foreground hover:text-foreground transition-colors"
                >
                  Kangwon National University
                </a>
                , currently working in the{' '}
                <a
                  href="https://hai.kangwon.ac.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground/90 underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-foreground hover:text-foreground transition-colors"
                >
                  Human–AI Interaction Lab
                </a>
                {' '}under{' '}
                <a
                  href="https://kimauk.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground/90 underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-foreground hover:text-foreground transition-colors"
                >
                  Auk Kim
                </a>. Incoming Data Science Master's student (Sep 2026).{' '}
                <br />
                Previously worked at the Korea Clinical Medicine Center at KNU Hospital and NSHC SafeSquare in Singapore.
              </p>

              {/* 소셜 링크 */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="mailto:dongjuson@hai.kangwon.ac.kr"
                  title="Email"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/djson98"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/dongju-son-954b57338/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
