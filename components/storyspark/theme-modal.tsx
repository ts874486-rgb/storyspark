'use client'

import { useEffect, useRef } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THEMES, type ThemeId } from './themes'

type ThemeModalProps = {
  open: boolean
  selected: ThemeId | null
  onClose: () => void
  onSelect: (id: ThemeId) => void
}

export function ThemeModal({ open, selected, onClose, onSelect }: ThemeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
    if (!open) document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      aria-labelledby="theme-modal-title"
      className="m-0 mt-auto h-auto max-h-[88dvh] w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 backdrop:bg-[#2B2540]/40 backdrop:backdrop-blur-sm open:animate-in open:slide-in-from-bottom-8 open:fade-in open:duration-300 sm:m-auto sm:max-w-md"
    >
      <div className="mx-auto w-full max-w-md rounded-t-[2rem] bg-card px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:rounded-[2rem]">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-muted" aria-hidden="true" />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="theme-modal-title" className="font-serif text-2xl font-semibold tracking-tight">
              Choose a Theme
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Where should tonight&apos;s adventure begin?</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close theme picker"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted transition active:scale-95"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        <div role="radiogroup" aria-label="Story themes" className="mt-5 flex flex-col gap-3">
          {THEMES.map((theme) => {
            const active = selected === theme.id
            return (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelect(theme.id)}
                className={cn(
                  'flex min-h-20 items-center gap-4 rounded-3xl p-3.5 text-left ring-2 transition-all active:scale-[0.98]',
                  theme.tint,
                  active ? 'ring-primary shadow-[0_8px_24px_-12px_rgba(123,104,238,0.6)]' : 'ring-transparent',
                )}
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                  <theme.icon className={cn('size-6', theme.iconTint)} aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block font-serif text-lg font-semibold">{theme.name}</span>
                  <span className="block text-sm text-muted-foreground">{theme.tagline}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full transition-all',
                    active ? 'bg-primary text-primary-foreground scale-100' : 'bg-white/80 ring-1 ring-border scale-90',
                  )}
                >
                  {active && <Check className="size-4" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">Tap a world to select it</p>
      </div>
    </dialog>
  )
}
