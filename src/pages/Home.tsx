import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
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
    period: 'Dec 2023 – Present',
    location: 'Chuncheon, South Korea',
    logo: haiLogo,
    items: [
      { text: 'AI Civil Complaint Classification', projectId: 'ai-civil-complaint' },
      { text: 'Lab Website', projectId: 'hai-lab-website' },
    ],
    tags: ['NLP', 'ML', 'Web', 'HCI'],
  },
  {
    org: 'NSHC Singapore, Safe Square',
    role: 'Intern',
    period: 'Jan 2026 – Feb 2026',
    location: 'Singapore',
    logo: nshcLogo,
    items: [
      { text: 'AI Phishing Training Automation', projectId: 'ai-phishing-training' },
    ],
    tags: ['AI', 'Security', 'Automation'],
  },
  {
    org: 'The Korea Clinical Medicine Center (KCMED)',
    role: 'Intern',
    period: 'Aug 2024 – Dec 2024',
    location: 'Chuncheon, South Korea',
    logo: kcmedLogo,
    items: [
      { text: 'Clinical ML & Visualization', projectId: 'clinical-ml' },
    ],
    tags: ['ML', 'Visualization', 'Clinical'],
  },
]

const awards = [
  {
    title: 'Encouragement Award, Capstone Project Competition',
    year: '2025',
    tags: ['Capstone', 'Competition'],
  },
  {
    title: 'Excellence Award, Regional Intelligence Center Creative & Autonomous Project',
    year: '2024',
    tags: ['AI', 'Research'],
  },
  {
    title: 'Outstanding Essay Award, Kangwon National University',
    year: '2023',
    tags: ['Writing', 'Essay'],
  },
]

/** 날짜 | 본문 | 태그, 테두리 없음 */
const cvGrid3 =
  'grid grid-cols-1 sm:grid-cols-[minmax(7.5rem,auto)_1fr_minmax(0,5.5rem)] gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-1 items-start text-[15px] sm:text-base leading-[1.65]'
const cvColDate =
  'text-[11px] sm:text-xs text-muted-foreground/90 tabular-nums whitespace-nowrap sm:pt-0.5 font-medium'
const cvHeader3 =
  'hidden sm:grid sm:grid-cols-[minmax(7.5rem,auto)_1fr_auto] gap-x-6 sm:gap-x-8 pb-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80'

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
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="flex flex-col gap-14 lg:flex-row lg:gap-16">

          {/* ── 왼쪽: Experience / Awards ── */}
          <div className="min-w-0 flex-1 space-y-14">

            {/* Experience */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground/95">
                Experience
              </h2>
              <Separator className="opacity-50" />
              <div className="space-y-3">
                <CvColumnHead3 left="Date" center="Details" right="Tags" />
                <div className="space-y-6">
                  {experience.map((exp) => {
                    const detailBody = (
                      <div className="min-w-0 space-y-2.5">
                        <p className="text-base font-semibold leading-snug tracking-tight text-foreground">
                          {exp.org}
                        </p>
                        <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                          {[exp.role, exp.location].filter(Boolean).join(' · ')}
                        </p>
                        <ul className="space-y-1.5 pl-1">
                          {exp.items.map((item) => (
                            <li key={item.text} className="text-[14px] leading-[1.7] text-foreground/80 sm:text-[15px]">
                              {item.projectId ? (
                                <Link
                                  to={`/projects/${item.projectId}`}
                                  className="inline-flex items-baseline gap-0.5 underline-offset-2 hover:underline hover:text-foreground transition-colors group"
                                >
                                  {item.text}
                                  <ArrowUpRight className="inline h-3.5 w-3.5 shrink-0 self-center text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                                </Link>
                              ) : item.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                    return (
                      <div key={exp.org} className={cvGrid3}>
                        <div className={cvColDate}>{exp.period}</div>
                        <div className="min-w-0">
                          {exp.logo ? (
                            <div className={expDetailGrid}>
                              <img src={exp.logo} alt="" className="h-11 w-11 shrink-0 object-contain sm:mt-0.5" width={44} height={44} />
                              {detailBody}
                            </div>
                          ) : detailBody}
                        </div>
                        <ProjectTagChips tags={exp.tags} className="justify-start sm:justify-end sm:pt-0.5" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Awards */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground/95">
                Honors & Awards
              </h2>
              <Separator className="opacity-50" />
              <div className="space-y-3">
                <CvColumnHead3 left="Date" center="Title" right="Tags" />
                <ul className="space-y-3">
                  {awards.map((a) => (
                    <li key={a.title} className={cvGrid3}>
                      <div className={cvColDate}>{a.year}</div>
                      <span className="min-w-0 leading-relaxed text-foreground/85">{a.title}</span>
                      <ProjectTagChips tags={a.tags} className="justify-start sm:justify-end sm:pt-0.5" />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>

          {/* ── 오른쪽: 사진 + 소개 (sticky) ── */}
          <aside className="lg:sticky lg:top-20 lg:w-56 lg:shrink-0 lg:self-start space-y-5">
            <div className="aspect-square w-40 overflow-hidden rounded-2xl bg-muted/60 ring-1 ring-border/40 lg:w-full">
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
                Senior CS student at Kangwon National University, currently working in the Human–AI Interaction Lab under Auk Kim. Incoming Data Science Master's student (Sep 2026). Previously worked at the Korea Clinical Medicine Center at KNU Hospital and NSHC SafeSquare in Singapore.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
