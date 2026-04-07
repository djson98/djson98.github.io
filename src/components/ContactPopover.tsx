import { useState } from 'react'
import { Check, Copy, ExternalLink, Mail } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { CONTACT_EMAIL, CONTACT_LINKS } from '@/lib/contact'
import { cn } from '@/lib/utils'

const triggerBase =
  'rounded-md px-3 py-2.5 text-[15px] font-medium text-muted-foreground transition-colors duration-150 md:py-1.5 md:text-sm ' +
  'hover:text-foreground data-[state=open]:text-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/** 네비 Contact — 클릭 시 패널(이메일·복사·메일 열기·소셜) */
export function ContactPopover({
  triggerClassName,
  align = 'end',
  side = 'bottom',
}: {
  triggerClassName?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={cn(triggerBase, triggerClassName)}>
          Contact
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} side={side} className="w-[min(100vw-2rem,20rem)]">
        <p className="text-sm font-medium text-foreground">Get in touch</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Copy the address or open your mail app.</p>

        <p className="mt-3 break-all rounded-md border border-border/80 bg-muted/30 px-3 py-2 font-mono text-[12px] leading-snug text-foreground">
          {CONTACT_EMAIL}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Open email app
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                Copy
              </>
            )}
          </button>
        </div>

        <Separator className="my-3 opacity-60" />

        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Elsewhere</p>
          <a
            href={CONTACT_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
            <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />
          </a>
          <a
            href={CONTACT_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            LinkedIn
            <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}
