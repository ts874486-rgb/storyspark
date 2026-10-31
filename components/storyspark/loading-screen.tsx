'use client'

import { useEffect, useEffectEvent, useState, type CSSProperties } from 'react'
import { Rocket, Sparkle, Star } from 'lucide-react'

const MESSAGES = ['Twinkling the stars...', 'Writing your custom fairy tale...', 'Painting the pictures...']

const STARS = [
  { top: '8%', left: '12%', size: 'size-4', delay: '0s' },
  { top: '18%', left: '82%', size: 'size-3', delay: '0.4s' },
  { top: '70%', left: '6%', size: 'size-3', delay: '0.8s' },
  { top: '78%', left: '88%', size: 'size-4', delay: '0.2s' },
  { top: '42%', left: '94%', size: 'size-2.5', delay: '1s' },
  { top: '48%', left: '-2%', size: 'size-2.5', delay: '0.6s' },
]

type LoadingScreenProps = {
  name: string
  durationMs: number
  onComplete: () => void
}

export function LoadingScreen({ name, durationMs, onComplete }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const handleComplete = useEffectEvent(onComplete)

  useEffect(() => {
    const step = durationMs / MESSAGES.length
    const interval = window.setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1))
    }, step)
    const timeout = window.setTimeout(() => handleComplete(), durationMs)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [durationMs])

  return (
    <section
      className="flex min-h-dvh flex-col items-center justify-center px-8 text-center animate-in fade-in duration-500"
      aria-busy="true"
    >
      <div className="relative flex size-56 items-center justify-center">
        <div aria-hidden="true" className="absolute inset-4 rounded-full bg-spark-gradient opacity-25 blur-2xl motion-safe:animate-pulse" />
        <div aria-hidden="true" className="absolute inset-10 rounded-full bg-card shadow-[0_20px_50px_-20px_rgba(123,104,238,0.55)] ring-1 ring-border" />
        {STARS.map((star, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={`absolute ${star.size} fill-[#F7C873] text-[#F7C873] motion-safe:animate-twinkle`}
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}
        <div className="relative motion-safe:animate-float-soft">
          <span className="flex size-24 items-center justify-center rounded-[2rem] bg-spark-gradient shadow-[0_16px_40px_-12px_rgba(231,154,196,0.95)]">
            <Rocket className="size-11 -rotate-12 text-white" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <Sparkle
            aria-hidden="true"
            className="absolute -right-3 -top-3 size-6 fill-white text-white drop-shadow motion-safe:animate-twinkle"
          />
        </div>
      </div>

      <h1 className="mt-8 text-balance font-serif text-2xl font-semibold tracking-tight">
        Crafting {name ? `${name}'s` : 'your'} adventure
      </h1>

      <p
        key={messageIndex}
        role="status"
        aria-live="polite"
        className="mt-3 h-6 font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {MESSAGES[messageIndex]}
      </p>

      <div className="mt-8 h-2 w-full max-w-60 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div
          className="h-full w-full rounded-full bg-spark-gradient animate-progress-fill"
          style={{ '--progress-duration': `${durationMs}ms` } as CSSProperties}
        />
      </div>

      <ul className="mt-6 flex gap-2" aria-hidden="true">
        {MESSAGES.map((m, i) => (
          <li
            key={m}
            className={`h-1.5 rounded-full transition-all duration-300 ${i <= messageIndex ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`}
          />
        ))}
      </ul>
    </section>
  )
}
