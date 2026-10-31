'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { BookOpen, ChevronLeft, Download, Lock, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TOTAL_BOOK_PAGES, possessive, type StoryContext, type StoryPage, type StoryTheme } from './themes'
import { DEFAULT_PLAN_ID, PLANS, formatPrice, getPlan, type PlanId } from './plans'
import { PricingSheet } from './pricing-sheet'
import { CheckoutSheet } from './checkout-sheet'

type PaywallStage = 'closed' | 'pricing' | 'checkout'

const STARTING_PRICE = formatPrice(Math.min(...PLANS.map((p) => p.priceCents)))

type StoryPreviewProps = {
  context: StoryContext
  theme: StoryTheme
  onBack: () => void
}

function PageCard({ page, index, title, priority }: { page: StoryPage; index: number; title?: string; priority: boolean }) {
  const [firstParagraph, ...rest] = page.paragraphs
  const dropCap = firstParagraph.charAt(0)

  return (
    <article
      aria-label={`Story page ${index + 1}`}
      className="relative rounded-[2rem] bg-card p-3 shadow-[0_30px_60px_-30px_rgba(43,37,64,0.45),0_10px_20px_-15px_rgba(123,104,238,0.35)] ring-1 ring-border"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
        <Image
          src={page.image}
          alt={page.alt}
          fill
          priority={priority}
          draggable={false}
          sizes="(max-width: 448px) 90vw, 400px"
          className="select-none object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur">
          Page {index + 1}
        </span>
      </div>

      <div className="px-3 pb-4 pt-6">
        {title && (
          <>
            <h2 className="text-balance text-center font-serif text-2xl font-semibold italic leading-snug tracking-tight">
              {title}
            </h2>
            <div className="mx-auto mb-5 mt-3 flex items-center justify-center gap-2" aria-hidden="true">
              <span className="h-px w-8 bg-border" />
              <span className="size-1.5 rounded-full bg-peach" />
              <span className="h-px w-8 bg-border" />
            </div>
          </>
        )}

        <div className="space-y-4 font-serif text-[1.075rem] leading-[1.75] text-foreground/90">
          <p className="text-pretty">
            <span
              aria-hidden="true"
              className="float-left mr-2 mt-1 bg-spark-gradient bg-clip-text font-serif text-[3.4rem] font-bold leading-[0.85] text-transparent"
            >
              {dropCap}
            </span>
            <span className="sr-only">{dropCap}</span>
            {firstParagraph.slice(1)}
          </p>
          {rest.map((p) => (
            <p key={p} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}

function LockedCard({
  name,
  image,
  remaining,
  onUnlock,
}: {
  name: string
  image: string
  remaining: number
  onUnlock: () => void
}) {
  return (
    <article
      aria-label="Locked pages"
      className="relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[2rem] bg-card p-3 ring-1 ring-border"
    >
      <div className="relative flex-1 overflow-hidden rounded-[1.5rem]">
        <Image src={image} alt="" fill sizes="400px" className="scale-110 object-cover blur-xl" />
        <div className="absolute inset-0 bg-[#FAF7F2]/60" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-card shadow-md">
            <Lock className="size-6 text-primary" aria-hidden="true" />
          </span>
          <p className="mt-4 font-serif text-xl font-semibold">{remaining} more pages</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Find out how {possessive(name)} adventure ends in the full illustrated book.
          </p>
          <button
            type="button"
            onClick={onUnlock}
            className="mt-5 flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md transition active:scale-95"
          >
            <Lock className="size-4" aria-hidden="true" />
            Unlock pages
          </button>
        </div>
      </div>
    </article>
  )
}

export function StoryPreview({ context, theme, onBack }: StoryPreviewProps) {
  const pages = useMemo(() => theme.pages(context), [theme, context])
  const title = theme.title(context)
  const slideCount = pages.length + 1
  const remaining = TOTAL_BOOK_PAGES - pages.length

  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paywall, setPaywall] = useState<PaywallStage>('closed')
  const [planId, setPlanId] = useState<PlanId>(DEFAULT_PLAN_ID)
  const selectedPlan = getPlan(planId)

  useEffect(() => {
    if (paywall === 'closed') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [paywall])

  const openPricing = () => setPaywall('pricing')
  const closePaywall = () => setPaywall('closed')

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    const slideWidth = track.scrollWidth / slideCount
    const index = Math.round(track.scrollLeft / slideWidth)
    setActiveIndex(Math.min(Math.max(index, 0), slideCount - 1))
  }

  function scrollToSlide(index: number) {
    const slide = trackRef.current?.children[index] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <section className="flex min-h-dvh flex-col pb-48 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 px-5 pb-3 pt-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Edit story details"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition active:scale-95"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary">
              <BookOpen className="size-3.5" aria-hidden="true" />
              {theme.name} · Age {context.age}
            </p>
            <h1 className="line-clamp-2 font-serif text-lg font-semibold leading-tight tracking-tight">
              {possessive(context.name)} Custom Adventure
            </h1>
          </div>
        </div>
      </header>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label="Story pages, swipe to turn"
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-5 pb-4 [-webkit-overflow-scrolling:touch]"
      >
        {pages.map((page, i) => (
          <div key={page.image} className="w-[88%] shrink-0 snap-center">
            <PageCard page={page} index={i} title={i === 0 ? title : undefined} priority={i === 0} />
          </div>
        ))}
        <div className="w-[88%] shrink-0 snap-center">
          <LockedCard
            name={context.name}
            image={pages[pages.length - 1].image}
            remaining={remaining}
            onUnlock={openPricing}
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1" role="tablist" aria-label="Choose page">
        {Array.from({ length: slideCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={i < pages.length ? `Page ${i + 1}` : 'Locked pages'}
            onClick={() => scrollToSlide(i)}
            className="flex h-8 items-center px-1"
          >
            <span
              className={cn(
                'block h-1.5 rounded-full transition-all duration-300',
                activeIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-border',
              )}
            />
          </button>
        ))}
      </div>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        {activeIndex < pages.length ? 'Swipe to turn the page' : `Page ${pages.length + 1} of ${TOTAL_BOOK_PAGES} is locked`}
      </p>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-foreground p-4 text-background shadow-[0_-10px_40px_-10px_rgba(43,37,64,0.5)]">
          <div aria-hidden="true" className="absolute -right-10 -top-12 size-36 rounded-full bg-spark-gradient opacity-40 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Printer className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">Unlock Full HD Printable PDF from {STARTING_PRICE}</p>
              <p className="mt-0.5 text-xs text-background/60">
                {TOTAL_BOOK_PAGES} illustrated pages · Plans for every reader
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openPricing}
            aria-haspopup="dialog"
            className="relative mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-spark-gradient text-sm font-bold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <Download className="size-4.5" aria-hidden="true" />
            Unlock Full Story
          </button>
        </div>
      </div>

      <PricingSheet
        open={paywall === 'pricing'}
        childName={context.name}
        selectedPlanId={planId}
        onSelectPlan={setPlanId}
        onContinue={() => setPaywall('checkout')}
        onClose={closePaywall}
      />
      <CheckoutSheet
        open={paywall === 'checkout'}
        plan={selectedPlan}
        childName={context.name}
        onBack={openPricing}
        onClose={closePaywall}
      />
    </section>
  )
}
