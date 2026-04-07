import { Skeleton } from '@/components/ui/skeleton'

/** GrassCapybaraThree 로딩 중 — 히어로 높이에 맞춘 플레이스홀더 */
export function HeroSkeleton() {
  return (
    <div
      className="flex min-h-[min(58vh,480px)] w-full min-w-0 flex-col items-center justify-center gap-4 px-4"
      role="status"
      aria-label="Loading hero"
    >
      <Skeleton className="h-9 w-56 max-w-[min(90vw,20rem)] rounded-xl" aria-hidden />
      <Skeleton
        className="h-[min(42vh,380px)] w-full max-w-5xl rounded-2xl sm:rounded-3xl"
        aria-hidden
      />
    </div>
  )
}
