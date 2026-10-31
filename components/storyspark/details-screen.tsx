'use client'

import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Palette, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AGES, NAME_PATTERN, formatChildName, type Gender, type StoryTheme } from './themes'

type DetailsScreenProps = {
  name: string
  age: string
  gender: Gender
  theme: StoryTheme | null
  canSubmit: boolean
  onNameChange: (value: string) => void
  onAgeChange: (value: string) => void
  onGenderChange: (value: Gender) => void
  onOpenThemes: () => void
  onBack: () => void
  onSubmit: () => void
}

function FieldCard({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-[0_6px_24px_-12px_rgba(43,37,64,0.18)] ring-1 ring-border">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      ) : (
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      )}
      {children}
    </div>
  )
}

export function DetailsScreen({
  name,
  age,
  gender,
  theme: selectedTheme,
  canSubmit,
  onNameChange,
  onAgeChange,
  onGenderChange,
  onOpenThemes,
  onBack,
  onSubmit,
}: DetailsScreenProps) {
  const formattedName = formatChildName(name)
  const nameInvalid = formattedName.length > 0 && !NAME_PATTERN.test(formattedName)
  const missing = [
    formattedName.length === 0 && 'a name',
    age === '' && 'an age',
    !selectedTheme && 'a theme',
  ].filter(Boolean) as string[]

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    onSubmit()
  }

  function handleNameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.keyCode === 229) return
    e.preventDefault()
    e.currentTarget.blur()
    document.getElementById('child-age')?.focus()
  }

  return (
    <section className="flex min-h-dvh flex-col px-5 pb-8 pt-6 animate-in fade-in slide-in-from-right-4 duration-400">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition active:scale-95"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Onboarding progress"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={2}
          >
            <div className="h-full w-2/3 rounded-full bg-spark-gradient" />
          </div>
        </div>
        <span className="text-xs font-bold text-muted-foreground">2 / 3</span>
      </header>

      <div className="mt-8">
        <h1 className="text-balance font-serif text-[1.75rem] font-semibold leading-tight tracking-tight">
          Who&apos;s our little hero?
        </h1>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Tell us a few details and we&apos;ll weave them into every page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-3.5">
        <FieldCard label="Child's Name" htmlFor="child-name">
          <input
            id="child-name"
            type="text"
            autoComplete="off"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            maxLength={24}
            placeholder="e.g. Maya"
            value={name}
            aria-invalid={nameInvalid}
            aria-describedby={nameInvalid ? 'child-name-error' : undefined}
            onChange={(e) => onNameChange(e.target.value.replace(/^\s+/, ''))}
            onKeyDown={handleNameKeyDown}
            className="w-full bg-transparent font-serif text-xl font-medium placeholder:text-muted-foreground/50 focus:outline-none"
          />
          {nameInvalid && (
            <p id="child-name-error" className="mt-1.5 text-xs font-medium text-destructive">
              Please use letters only (spaces, hyphens and apostrophes are fine).
            </p>
          )}
        </FieldCard>

        <FieldCard label="Child's Age" htmlFor="child-age">
          <div className="relative">
            <select
              id="child-age"
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              className={cn(
                'w-full appearance-none bg-transparent pr-8 font-serif text-xl font-medium focus:outline-none',
                age === '' && 'text-muted-foreground/50',
              )}
            >
              <option value="" disabled>
                Select age
              </option>
              {AGES.map((a) => (
                <option key={a} value={a} className="text-foreground">
                  {a} years old
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </FieldCard>

        <FieldCard label="Gender">
          <div role="radiogroup" aria-label="Gender" className="grid grid-cols-2 gap-1.5 rounded-2xl bg-muted p-1.5">
            {(['boy', 'girl'] as const).map((g) => {
              const active = gender === g
              return (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onGenderChange(g)}
                  className={cn(
                    'h-11 rounded-xl text-sm font-bold capitalize transition-all',
                    active
                      ? 'bg-card text-foreground shadow-[0_4px_12px_-4px_rgba(43,37,64,0.25)]'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </FieldCard>

        <FieldCard label="Story Theme">
          <button
            type="button"
            onClick={onOpenThemes}
            aria-haspopup="dialog"
            className="flex w-full items-center gap-3 rounded-2xl bg-secondary p-3 text-left transition active:scale-[0.99]"
          >
            {selectedTheme ? (
              <span className={cn('flex size-11 items-center justify-center rounded-xl', selectedTheme.tint)}>
                <selectedTheme.icon className={cn('size-5', selectedTheme.iconTint)} aria-hidden="true" />
              </span>
            ) : (
              <span className="flex size-11 items-center justify-center rounded-xl bg-spark-gradient">
                <Palette className="size-5 text-white" aria-hidden="true" />
              </span>
            )}
            <span className="flex-1">
              <span className="block font-bold text-secondary-foreground">
                {selectedTheme ? selectedTheme.name : 'Choose a Theme'}
              </span>
              <span className="block text-xs text-muted-foreground">
                {selectedTheme ? 'Tap to change' : 'Pick their dream world'}
              </span>
            </span>
            <ChevronRight className="size-5 text-secondary-foreground" aria-hidden="true" />
          </button>
        </FieldCard>

        <div className="mt-auto pt-6">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-spark-gradient text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(231,154,196,0.9)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
          >
            <Sparkles className="size-5" aria-hidden="true" />
            Generate Magic Story
          </button>
          {!canSubmit && (
            <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
              {missing.length > 0
                ? `Add ${missing.join(missing.length > 2 ? ', ' : ' and ').replace(/, (?=[^,]*$)/, ' and ')} to continue`
                : 'Check the name above to continue'}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
