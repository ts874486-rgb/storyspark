'use client'

import Image from 'next/image'
import { BookOpen, ChevronLeft, Download, Lock, Printer } from 'lucide-react'
import type { Gender, StoryTheme } from './themes'

type StoryPreviewProps = {
  name: string
  gender: Gender
  theme: StoryTheme
  onBack: () => void
}

export function StoryPreview({ name, gender, theme, onBack }: StoryPreviewProps) {
  const paragraphs = theme.page(name, gender)
  const [firstParagraph, ...rest] = paragraphs
  const dropCap = firstParagraph.charAt(0)

  return (
    <section className="flex min-h-dvh flex-col pb-44 animate-in fade-in duration-500">
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
              {theme.name} · Free Preview
            </p>
            <h1 className="line-clamp-2 font-serif text-lg font-semibold leading-tight tracking-tight">
              {name}&apos;s Custom Adventure
            </h1>
          </div>
        </div>
      </header>

      <div className="px-5 pt-6">
        <article
          aria-label="Story page 1"
          className="relative rounded-[2rem] bg-card p-3 shadow-[0_30px_60px_-30px_rgba(43,37,64,0.45),0_10px_20px_-15px_rgba(123,104,238,0.35)] ring-1 ring-border"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
            <Image
              src={theme.image}
              alt={`Illustration for ${theme.name} starring ${name}`}
              fill
              priority
              sizes="(max-width: 448px) 100vw, 448px"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur">
              Page 1
            </span>
          </div>

          <div className="px-3 pb-4 pt-6">
            <h2 className="text-balance text-center font-serif text-2xl font-semibold italic leading-snug tracking-tight">
              {theme.title}
            </h2>
            <div className="mx-auto mt-3 flex items-center justify-center gap-2" aria-hidden="true">
              <span className="h-px w-8 bg-border" />
              <span className="size-1.5 rounded-full bg-peach" />
              <span className="h-px w-8 bg-border" />
            </div>

            <div className="mt-5 space-y-4 font-serif text-[1.075rem] leading-[1.75] text-foreground/90">
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

        <div className="mt-5 flex items-center justify-center gap-1.5" aria-label="Page 1 of 12">
          <span className="h-1.5 w-6 rounded-full bg-primary" />
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="size-1.5 rounded-full bg-border" />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-3xl bg-secondary/70 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card">
            <Lock className="size-4.5 text-primary" aria-hidden="true" />
          </span>
          <p className="text-sm leading-snug text-secondary-foreground">
            <strong className="font-bold">11 more pages</strong> of {name}&apos;s adventure are waiting to be unlocked.
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-foreground p-4 text-background shadow-[0_-10px_40px_-10px_rgba(43,37,64,0.5)]">
          <div aria-hidden="true" className="absolute -right-10 -top-12 size-36 rounded-full bg-spark-gradient opacity-40 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Printer className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">Unlock Full HD Printable PDF for $4.99</p>
              <p className="mt-0.5 text-xs text-background/60">12 illustrated pages · Instant download</p>
            </div>
          </div>
          <button
            type="button"
            className="relative mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-spark-gradient text-sm font-bold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <Download className="size-4.5" aria-hidden="true" />
            Unlock Full Story · $4.99
          </button>
        </div>
      </div>
    </section>
  )
}
