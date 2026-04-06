import { lazy, Suspense } from 'react'
import { cn } from '@/lib/utils'
import { ProjectTagChips } from '@/components/ProjectTagChips'
import { Separator } from '@/components/ui/separator'

const GrassCapybaraThree = lazy(() => import('@/components/GrassCapybaraThree'))
import haiLogo from '../../asset/hai.png'
import kcmedLogo from '../../asset/logo.png'
import nshcLogo from '../../asset/nshc.png'

type ExperienceItem = {
  org: string
  role: string
  period: string
  /** 비우면 역할만 표시 (제목에 지역이 이미 있을 때 등) */
  location?: string
  items: string[]
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
      'AI Civil Complaint Classification — Built and deployed an NLP/ML system to classify civil complaints for the university cloud portal and mobile app (50,000+ requests). Excellence Award, Regional Intelligence Center.',
      'Developed and maintained the lab website.',
    ],
    tags: ['NLP', 'ML', 'Web', 'HCI'],
  },
  {
    org: 'NSHC Singapore, Safe Square',
    role: 'Intern',
    period: 'Jan 2026 – Feb 2026',
    logo: nshcLogo,
    items: [
      'AI Phishing Training Automation — Automated creation and delivery of phishing-awareness training content using AI-driven pipelines.',
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
      'Developed ML models and data visualization pipelines for clinical research.',
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
  'grid grid-cols-1 sm:grid-cols-[minmax(7.5rem,auto)_1fr_auto] gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-1 items-start text-[15px] sm:text-base leading-[1.65]'
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

      {/* Content */}
      <div className="mx-auto max-w-6xl space-y-14 px-6 py-14 sm:py-16">
        <Separator className="opacity-60" />

        {/* Experience */}
        <section className="space-y-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground/95 sm:text-3xl">
            Experience
          </h2>
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
                        <li key={item} className="text-[14px] leading-[1.7] text-foreground/88 sm:text-[15px]">
                          · {item}
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
                          <img
                            src={exp.logo}
                            alt=""
                            className="h-11 w-11 shrink-0 object-contain sm:mt-0.5"
                            width={44}
                            height={44}
                          />
                          {detailBody}
                        </div>
                      ) : (
                        detailBody
                      )}
                    </div>
                    <ProjectTagChips
                      tags={exp.tags}
                      className="justify-start sm:justify-end sm:pt-0.5"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <Separator />

        {/* Awards */}
        <section className="space-y-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground/95 sm:text-3xl">
            Honors & Awards
          </h2>
          <div className="space-y-3">
            <CvColumnHead3 left="Date" center="Title" right="Tags" />
            <ul className="space-y-3">
              {awards.map((a) => (
                <li key={a.title} className={cvGrid3}>
                  <div className={cvColDate}>{a.year}</div>
                  <span className="min-w-0 leading-relaxed text-foreground/90">{a.title}</span>
                  <ProjectTagChips
                    tags={a.tags}
                    className="justify-start sm:justify-end sm:pt-0.5"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
