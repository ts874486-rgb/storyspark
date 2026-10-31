'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SheetDialogProps = {
  open: boolean
  onDismiss: () => void
  labelledBy: string
  dismissible?: boolean
  className?: string
  children: ReactNode
}

export function SheetDialog({ open, onDismiss, labelledBy, dismissible = true, className, children }: SheetDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openRef = useRef(open)
  openRef.current = open

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        if (!dismissible) e.preventDefault()
      }}
      onClose={() => {
        // Only report user-initiated closes (Esc / back gesture); programmatic closes come from `open` changing.
        if (openRef.current) onDismiss()
      }}
      onClick={(e) => {
        if (dismissible && e.target === dialogRef.current) onDismiss()
      }}
      className="m-0 mt-auto h-auto max-h-[94dvh] w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 backdrop:bg-[#2B2540]/40 backdrop:backdrop-blur-sm open:animate-in open:slide-in-from-bottom-12 open:fade-in open:duration-300 sm:m-auto sm:max-w-md"
    >
      <div
        className={cn(
          'mx-auto w-full max-w-md rounded-t-[2rem] bg-card px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:rounded-[2rem]',
          className,
        )}
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-muted" aria-hidden="true" />
        {children}
      </div>
    </dialog>
  )
}
