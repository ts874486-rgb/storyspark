'use client'

import { ArrowRight, Check, ShieldCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SheetDialog } from './sheet-dialog'
import { PLANS, formatPrice, getPlan, type PlanId } from './plans'

type PricingSheetProps = {
  open: boolean
  childName: string
  selectedPlanId: PlanId
  onSelectPlan: (id: PlanId) => void
  onContinue: () => void
  onClose: () => void
}

export function PricingSheet({ open, childName, selectedPlanId, onSelectPlan, onContinue, onClose }: PricingSheetProps) {
  const selectedPlan = getPlan(selectedPlanId)

  return (
    <SheetDialog open={open} onDismiss={onClose} labelledBy="pricing-title">
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary">StorySpark Premium</p>
          <h2 id="pricing-title" className="mt-1 text-balance font-serif text-2xl font-semibold leading-tight tracking-tight">
            Unlock {childName}&apos;s full adventure
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close pricing"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted transition active:scale-95"
        >
          <X className="size-4.5" aria-hidden="true" />
        </button>
      </div>

      <div role="radiogroup" aria-label="Choose a plan" className="mt-6 flex flex-col gap-4">
        {PLANS.map((plan) => {
          const active = plan.id === selectedPlanId
          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelectPlan(plan.id)}
              className={cn(
                'relative w-full rounded-3xl bg-card p-4 text-left ring-2 transition-all duration-200 [-webkit-tap-highlight-color:transparent] active:scale-[0.985] focus-visible:outline-none',
                active
                  ? 'bg-[#FBFAFF] ring-lavender shadow-[0_14px_30px_-18px_rgba(123,104,238,0.7)]'
                  : 'ring-border hover:ring-lavender/50',
              )}
            >
              {plan.badge && (
                <span
                  className={cn(
                    'absolute -top-2.5 right-4 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider shadow-sm',
                    plan.badge.className,
                  )}
                >
                  {plan.badge.label}
                </span>
              )}

              <div className="flex items-center gap-3">
                <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-2xl', plan.iconTint)}>
                  <plan.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg font-semibold leading-tight">{plan.name}</span>
                  <span className="block text-sm text-muted-foreground">{plan.subtitle}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full transition-all',
                    active ? 'bg-primary text-primary-foreground' : 'ring-2 ring-border',
                  )}
                >
                  {active && <Check className="size-3.5" strokeWidth={3.5} />}
                </span>
              </div>

              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight">{formatPrice(plan.priceCents)}</span>
                <span className="text-sm font-medium text-muted-foreground">{plan.cadence}</span>
              </p>

              <ul className="mt-3 flex flex-col gap-2 border-t border-border/70 pt-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm leading-snug">
                    <Check
                      className={cn('mt-0.5 size-4 shrink-0', active ? 'text-primary' : 'text-[#2F7D62]')}
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <div className="sticky bottom-0 -mx-5 mt-5 bg-card/95 px-5 pb-1 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={onContinue}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-spark-gradient px-4 text-[0.95rem] font-bold text-white shadow-[0_12px_28px_-12px_rgba(123,104,238,0.8)] transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <span className="truncate">Subscribe to {selectedPlan.name} Now</span>
          <ArrowRight className="size-4.5 shrink-0" aria-hidden="true" />
        </button>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          {formatPrice(selectedPlan.priceCents)} · {selectedPlan.billingNote} · Secure checkout
        </p>
      </div>
    </SheetDialog>
  )
}
