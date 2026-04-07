import { lazy, Suspense, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HeroSkeleton } from '@/components/HeroSkeleton'
import { ReadingProgressBar } from '@/components/ReadingProgressBar'
import { ProjectTagChips } from '@/components/ProjectTagChips'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { projects } from '@/data/projects'

const GrassCapybaraThree = lazy(() => import('@/components/GrassCapybaraThree'))
import haiLogo from '../../asset/hai.png'
import kcmedLogo from '../../asset/logo.png'
import nshcLogo from '../../asset/nshc.png'

type BulletItem = { text: string; projectId?: string }

type ExperienceItem = {
  org: string
  /** 기관명 전체를 외부 링크로 (예: SAFE SQUARE 공식 사이트) */
  orgUrl?: string
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
    orgUrl: 'https://ssq.ai/',
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
    orgUrl: 'http://kcmed.godohosting.com/',
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

type AwardItem = {
  title: string
  year: string
  tags: string[]
  /** Projects 페이지 상세로 연결 */
  projectId?: string
  link?: string
  linkLabel?: string
  linkSource?: string
  /** 외부 기사 등 비영어 라벨 표시용 */
  linkLocale?: 'ko'
}

const awards: AwardItem[] = [
  {
    title: 'Honorable Mention, Capstone Project Competition',
    year: '2025',
    tags: ['Capstone'],
    projectId: 'campus-notice-aggregator',
  },
  {
    title: 'Excellence Award, Regional Intelligence Center Creative & Autonomous Project',
    year: '2024',
    tags: ['NLP'],
    projectId: 'ai-civil-complaint',
    link: 'https://www.veritas-a.com/news/articleView.html?idxno=531813',
    linkLabel: "강원대 컴퓨터공학과 손동주 학생, 'AI 민원 분류 시스템' 개발",
    linkSource: 'Veritas-α',
    linkLocale: 'ko',
  },
  {
    title: 'Outstanding Essay Award, Kangwon National University',
    year: '2023',
    tags: ['Essay'],
  },
]

function projectTitle(id: string) {
  return projects.find((p) => p.id === id)?.title ?? id
}

/** Experience 본문 (데스크톱 표 / 모바일 카드 공통) */
function ExperienceEntryContent({ exp }: { exp: ExperienceItem }) {
  return (
    <>
      <p className="text-[17px] font-medium leading-snug tracking-tight text-foreground">
        {exp.orgUrl ? (
          <a
            href={exp.orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-foreground underline-offset-2 transition-colors hover:underline decoration-muted-foreground/35 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {exp.org}
          </a>
        ) : (
          exp.org
        )}
      </p>
      <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
        {[exp.role, exp.location].filter(Boolean).join(' · ')}
      </p>
      <ul className="space-y-1 pl-1 sm:space-y-1.5">
        {exp.items.map((item) => (
          <li key={item.text} className="text-sm leading-[1.7] text-foreground/75 sm:text-[15px]">
            {item.projectId ? (
              <Link
                to={`/projects/${item.projectId}`}
                className="inline-flex items-baseline gap-0.5 rounded-sm text-foreground/70 underline-offset-2 transition-colors hover:underline hover:text-foreground group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {item.text}
                <ArrowUpRight className="inline h-3.5 w-3.5 shrink-0 self-center text-muted-foreground/60 group-hover:text-foreground transition-colors" />
              </Link>
            ) : (
              item.text
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

function AwardEntryContent({ a }: { a: AwardItem }) {
  return (
    <>
      <span className="block">{a.title}</span>
      {a.projectId && (
        <Link
          to={`/projects/${a.projectId}`}
          className="mt-1.5 inline-flex items-center gap-0.5 rounded-sm text-sm text-foreground/70 underline-offset-2 transition-colors hover:text-foreground hover:underline group/awardproj focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {projectTitle(a.projectId)}
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover/awardproj:text-foreground" />
        </Link>
      )}
      {a.link && (
        <a
          href={a.link}
          target="_blank"
          rel="noopener noreferrer"
          lang={a.linkLocale === 'ko' ? 'ko' : undefined}
          className="mt-1.5 inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-1 rounded-sm text-[12px] text-muted-foreground/80 underline underline-offset-2 decoration-muted-foreground/30 transition-colors hover:text-foreground hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {a.linkLocale === 'ko' && (
            <span
              className="shrink-0 rounded border border-border/70 bg-muted/60 px-1 py-px text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              title="Korean"
            >
              KR
            </span>
          )}
          <span>{a.linkLabel ?? 'link'}</span>
          {a.linkSource && <span className="text-muted-foreground/40">· {a.linkSource}</span>}
          <ArrowUpRight className="h-3 w-3 shrink-0" />
        </a>
      )}
    </>
  )
}

const cvColDate =
  'text-xs sm:text-[13px] text-muted-foreground/60 tabular-nums whitespace-nowrap font-medium transition-colors group-hover:text-muted-foreground'
/** Experience 상세: 로고 열 | 본문 열 (테두리 없음) */
const expDetailGrid =
  'grid grid-cols-[minmax(2.75rem,auto)_1fr] gap-x-3 items-start min-w-0'

/** `public/profile-singapore.jpeg` — 싱가포르 최남단, 고화질 크롭본 */
const PROFILE_PHOTO_PUBLIC = '/profile-singapore.jpeg'

function ProfilePhoto() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="mx-auto w-48 max-w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/50 sm:w-52 lg:mx-0 lg:w-full">
      {!failed ? (
        <img
          src={PROFILE_PHOTO_PUBLIC}
          alt="Dongju Son at the southernmost point of continental Asia, Singapore"
          className="block aspect-square w-full object-cover object-center align-middle lg:aspect-auto lg:h-auto lg:max-w-full"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-primary/15 via-secondary to-muted/80 select-none"
          aria-hidden="true"
        >
          <span className="font-display text-4xl font-medium tracking-tight text-primary/25 sm:text-5xl">DS</span>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={pageRef}>
      <ReadingProgressBar
        articleRef={pageRef}
        contentKey="home"
        ariaLabel="Home page scroll progress"
      />
      {/* Hero: 3D */}
      <section className="relative -mt-14 min-h-[min(72vh,560px)] w-full overflow-hidden pt-14">
        <Suspense fallback={<HeroSkeleton />}>
          <GrassCapybaraThree />
        </Suspense>
      </section>

      {/* Content: 2-column layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-5 sm:gap-10 lg:flex-row lg:gap-16">

          {/* ── 왼쪽: Experience / Awards (모바일에선 소개 아래로) ── */}
          <div className="order-2 min-w-0 flex-1 space-y-5 sm:space-y-10 lg:order-1 lg:space-y-14">

            {/* Experience */}
            <section className="space-y-3 sm:space-y-5">
              <h2 className="font-display text-[1.7rem] font-medium tracking-tight text-foreground sm:text-[2rem]">
                Experience
              </h2>
              <Separator className="opacity-60" />

              {/* 모바일: 세로 카드 (표 3열 겹침 방지) */}
              <div className="space-y-0 md:hidden">
                {experience.map((exp, i) => (
                  <article
                    key={exp.org}
                    className={cn(
                      'border-b border-dotted border-border/70 pb-4 md:pb-8',
                      i === 0 ? 'pt-1' : 'pt-4 md:pt-8',
                      i === experience.length - 1 && 'border-b-0 pb-0',
                    )}
                  >
                    <p className="mb-2.5 text-xs text-muted-foreground/60 tabular-nums sm:mb-4">{exp.period}</p>
                    {exp.logo ? (
                      <div className="flex gap-2.5 md:gap-3">
                        <img
                          src={exp.logo}
                          alt=""
                          className="h-10 w-10 shrink-0 object-contain"
                          width={40}
                          height={40}
                        />
                        <div className="min-w-0 flex-1 space-y-2 md:space-y-2.5">
                          <ExperienceEntryContent exp={exp} />
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-0 space-y-2 md:space-y-2.5">
                        <ExperienceEntryContent exp={exp} />
                      </div>
                    )}
                    <div className="mt-3 md:mt-5">
                      <ProjectTagChips tags={exp.tags} className="justify-start" />
                    </div>
                  </article>
                ))}
              </div>

              {/* 데스크톱: 표 */}
              <div className="hidden min-w-0 overflow-x-auto md:block">
                <table className="w-full border-collapse text-base sm:text-[17px] leading-[1.7]">
                  <thead className="hidden sm:table-header-group">
                    <tr className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                      <th className="pb-2.5 text-left font-medium pr-6 whitespace-nowrap">Date</th>
                      <th className="pb-2.5 text-left font-medium px-6">Details</th>
                      <th className="pb-2.5 text-right font-medium">Tags</th>
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
                              <img
                                src={exp.logo}
                                alt=""
                                className="max-h-8 max-w-[4rem] w-auto h-auto shrink-0"
                                width={40}
                                height={40}
                              />
                            )}
                            <div className="min-w-0 space-y-2.5">
                              <ExperienceEntryContent exp={exp} />
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
              </div>
            </section>

            {/* Awards */}
            <section className="space-y-3 sm:space-y-5">
              <h2 className="font-display text-[1.7rem] font-medium tracking-tight text-foreground sm:text-[2rem]">
                Honors & Awards
              </h2>
              <Separator className="opacity-60" />

              <div className="space-y-0 md:hidden">
                {awards.map((a, i) => (
                  <article
                    key={a.title}
                    className={cn(
                      'border-b border-dotted border-border/70 pb-4 md:pb-8',
                      i === 0 ? 'pt-1' : 'pt-4 md:pt-8',
                      i === awards.length - 1 && 'border-b-0 pb-0',
                    )}
                  >
                    <p className="mb-2.5 text-xs text-muted-foreground/60 tabular-nums sm:mb-4">{a.year}</p>
                    <div className="space-y-1 leading-relaxed text-foreground/85">
                      <AwardEntryContent a={a} />
                    </div>
                    <div className="mt-3 md:mt-5">
                      <ProjectTagChips tags={a.tags} className="justify-start" />
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden min-w-0 overflow-x-auto md:block">
                <table className="w-full border-collapse text-base sm:text-[17px] leading-[1.7]">
                  <thead className="hidden sm:table-header-group">
                    <tr className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                      <th className="pb-2.5 text-left font-medium pr-6 whitespace-nowrap">Date</th>
                      <th className="pb-2.5 text-left font-medium px-6">Title</th>
                      <th className="pb-2.5 text-right font-medium">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awards.map((a) => (
                      <tr key={a.title} className="group align-top transition-colors hover:bg-muted/50">
                        <td className={cn(cvColDate, 'pr-6 py-2 whitespace-nowrap')}>{a.year}</td>
                        <td className="px-6 py-2 min-w-0 leading-relaxed text-foreground/85">
                          <AwardEntryContent a={a} />
                        </td>
                        <td className="py-2 text-right align-top">
                          <ProjectTagChips tags={a.tags} className="justify-end" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Additional */}
            <section className="space-y-3 sm:space-y-5">
              <h2 className="font-display text-[1.7rem] font-medium tracking-tight text-foreground sm:text-[2rem]">
                Additional
              </h2>
              <Separator className="opacity-60" />

              <div className="space-y-0 md:hidden">
                {additional.map((a, i) => (
                  <article
                    key={a.title}
                    className={cn(
                      'border-b border-dotted border-border/70 pb-4 md:pb-8',
                      i === 0 ? 'pt-1' : 'pt-4 md:pt-8',
                      i === additional.length - 1 && 'border-b-0 pb-0',
                    )}
                  >
                    <p className="mb-2 text-xs text-muted-foreground/60 tabular-nums sm:mb-3">{a.year}</p>
                    <p className="leading-relaxed text-foreground/85">{a.title}</p>
                    <div className="mt-3 md:mt-5">
                      <ProjectTagChips tags={a.tags} className="justify-start" />
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden min-w-0 overflow-x-auto md:block">
                <table className="w-full border-collapse text-base sm:text-[17px] leading-[1.7]">
                  <thead className="hidden sm:table-header-group">
                    <tr className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                      <th className="pb-2.5 text-left font-medium pr-6 whitespace-nowrap">Date</th>
                      <th className="pb-2.5 text-left font-medium px-6">Title</th>
                      <th className="pb-2.5 text-right font-medium">Tags</th>
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
              </div>
            </section>

          </div>

          {/* ── 오른쪽: 사진 + 소개 (모바일: 히어로 바로 아래 / 데스크톱: sticky 사이드) ── */}
          <aside className="order-1 space-y-3 sm:space-y-5 lg:order-2 lg:sticky lg:top-20 lg:w-72 lg:shrink-0 lg:self-start">
            <ProfilePhoto />
            <div className="space-y-2">
              <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
                Dongju Son
              </h2>
              <div className="space-y-3 text-sm leading-[1.75] text-foreground/70 sm:space-y-4 sm:leading-[1.8]">
                <p>
                  Senior CS student at{' '}
                  <a
                    href="https://cse.kangwon.ac.kr/cse/index.do"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-bio-primary"
                  >
                    Kangwon National University
                  </a>
                  , currently working in the{' '}
                  <a
                    href="https://hai.kangwon.ac.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-bio-primary"
                  >
                    Human–AI Interaction Lab
                  </a>
                  {' '}
                  under{' '}
                  <a
                    href="https://kimauk.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-bio-secondary"
                  >
                    Auk Kim
                  </a>
                  . Incoming Data Science Master&apos;s student (Sep 2026).
                </p>
                <p>
                  Previously worked at the{' '}
                  <a
                    href="http://kcmed.godohosting.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-bio-secondary"
                  >
                    Korea Clinical Medicine Center (KCMED)
                  </a>
                  {' '}
                  at KNU Hospital and{' '}
                  <a
                    href="https://ssq.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-bio-secondary"
                  >
                    NSHC Safe Square
                  </a>
                  {' '}
                  in Singapore.
                </p>
              </div>

              {/* 소셜 링크 */}
              <div className="flex items-center gap-2 pt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="mailto:dongjuson@hai.kangwon.ac.kr"
                      aria-label="Email Dongju Son"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top">Email</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/djson98"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub profile (djson98)"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top">GitHub</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://www.linkedin.com/in/dongju-son-954b57338/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn profile"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top">LinkedIn</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
