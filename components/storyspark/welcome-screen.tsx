import Image from 'next/image'
import { ArrowRight, Moon, ShieldCheck, Sparkles, Star } from 'lucide-react'

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex min-h-dvh flex-col px-5 pb-8 pt-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-spark-gradient shadow-sm">
            <Sparkles className="size-4.5 text-white" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">StorySpark AI</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm ring-1 ring-border">
          <Moon className="size-3.5 text-lavender" aria-hidden="true" />
          Bedtime ready
        </span>
      </header>

      <div className="relative mt-6">
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-[2.5rem] bg-spark-gradient opacity-25 blur-2xl"
        />
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-secondary shadow-[0_20px_50px_-20px_rgba(123,104,238,0.45)] ring-1 ring-white/70">
          <Image
            src="/images/welcome.png"
            alt="A child reading a glowing storybook while sitting on a crescent moon among pastel clouds"
            fill
            priority
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-cover"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-2xl bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
            <div className="flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-3.5 fill-[#F5B544] text-[#F5B544]" />
              ))}
            </div>
            <span className="text-xs font-bold">Loved by 40k+ parents</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Personalized bedtime stories
        </p>
        <h1 className="mt-3 text-balance font-serif text-[2rem] font-semibold leading-[1.12] tracking-tight">
          Turn Your Child Into the Hero of Their Own Story
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          A beautifully illustrated storybook starring your little one, crafted in seconds and ready for tonight.
        </p>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={onStart}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-spark-gradient text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(231,154,196,0.9)] transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
          >
            Create a Story Now (Preview Free)
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-mint" aria-hidden="true" />
            No sign-up needed. Takes under a minute.
          </p>
        </div>
      </div>
    </section>
  )
}
