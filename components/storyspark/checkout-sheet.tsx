'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Check, ChevronLeft, CreditCard, Loader2, Lock, Mail, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SheetDialog } from './sheet-dialog'
import { formatPrice, type Plan } from './plans'

type CheckoutSheetProps = {
  open: boolean
  plan: Plan
  childName: string
  onBack: () => void
  onClose: () => void
}

type Status = 'idle' | 'processing' | 'success'
type Field = 'email' | 'card' | 'expiry' | 'cvc'
type Errors = Partial<Record<Field, string>>

const PROCESSING_MS = 1800
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const digitsOnly = (value: string) => value.replace(/\D/g, '')

function formatCardNumber(value: string) {
  return digitsOnly(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter your email for the receipt'
  if (!EMAIL_PATTERN.test(email.trim())) return 'That email doesn’t look quite right'
}

function validateCard(card: string, expiry: string, cvc: string): Errors {
  const errors: Errors = {}
  if (digitsOnly(card).length !== 16) errors.card = 'Enter a 16-digit card number'

  const exp = digitsOnly(expiry)
  const month = Number(exp.slice(0, 2))
  const year = 2000 + Number(exp.slice(2, 4))
  const now = new Date()
  if (exp.length !== 4 || month < 1 || month > 12) {
    errors.expiry = 'Use MM / YY'
  } else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    errors.expiry = 'This card has expired'
  }

  const cvcLength = digitsOnly(cvc).length
  if (cvcLength < 3 || cvcLength > 4) errors.cvc = '3–4 digits'
  return errors
}

export function CheckoutSheet({ open, plan, childName, onBack, onClose }: CheckoutSheetProps) {
  const [email, setEmail] = useState('')
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [paidWith, setPaidWith] = useState<'card' | 'apple'>('card')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open && status === 'success') {
      setStatus('idle')
      setCard('')
      setExpiry('')
      setCvc('')
      setErrors({})
    }
  }, [open, status])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const processing = status === 'processing'
  const total = formatPrice(plan.priceCents)

  function startPayment(method: 'card' | 'apple') {
    setPaidWith(method)
    setStatus('processing')
    timerRef.current = setTimeout(() => setStatus('success'), PROCESSING_MS)
  }

  function handleCardSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (processing) return
    const nextErrors: Errors = { email: validateEmail(email), ...validateCard(card, expiry, cvc) }
    const firstInvalid = (Object.keys(nextErrors) as Field[]).find((key) => nextErrors[key])
    setErrors(nextErrors)
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid}`)?.focus()
      return
    }
    startPayment('card')
  }

  function handleApplePay() {
    if (processing) return
    const emailError = validateEmail(email)
    setErrors({ email: emailError })
    if (emailError) {
      document.getElementById('checkout-email')?.focus()
      return
    }
    startPayment('apple')
  }

  function clearError(field: Field) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <SheetDialog open={open} onDismiss={onClose} labelledBy="checkout-title" dismissible={!processing}>
      {status === 'success' ? (
        <SuccessView plan={plan} email={email.trim()} childName={childName} paidWith={paidWith} onDone={onClose} />
      ) : (
        <>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={processing}
              aria-label="Back to plans"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted transition active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 id="checkout-title" className="font-serif text-2xl font-semibold leading-tight tracking-tight">
                Checkout
              </h2>
              <p className="text-sm text-muted-foreground">Secure payment · Simulated</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-3xl bg-[#F6F3FF] p-4 ring-1 ring-lavender/40">
            <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-2xl', plan.iconTint)}>
              <plan.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg font-semibold leading-tight">{plan.name}</p>
              <p className="text-xs text-muted-foreground">{plan.billingNote}</p>
            </div>
            <p className="text-right">
              <span className="block text-xl font-extrabold tracking-tight">{total}</span>
              <span className="block text-xs text-muted-foreground">{plan.cadence}</span>
            </p>
          </div>

          <form noValidate onSubmit={handleCardSubmit} className="mt-5 flex flex-col gap-4">
            <FormField id="checkout-email" label="Email for receipt" error={errors.email}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="checkout-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="parent@example.com"
                  value={email}
                  disabled={processing}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearError('email')
                  }}
                  className={inputClass(errors.email, 'pl-11')}
                />
              </div>
            </FormField>

            <button
              type="button"
              onClick={handleApplePay}
              disabled={processing}
              className="flex h-13 w-full items-center justify-center gap-1.5 rounded-2xl bg-[#0B0B0F] text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
            >
              <span className="sr-only">Pay with</span>
              <AppleMark />
              <span>Pay</span>
            </button>

            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              or pay with card
              <span className="h-px flex-1 bg-border" />
            </div>

            <FormField id="checkout-card" label="Card number" error={errors.card}>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="checkout-card"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  value={card}
                  disabled={processing}
                  aria-invalid={Boolean(errors.card)}
                  aria-describedby={errors.card ? 'checkout-card-error' : undefined}
                  onChange={(e) => {
                    setCard(formatCardNumber(e.target.value))
                    clearError('card')
                  }}
                  className={inputClass(errors.card, 'pl-11 tabular-nums tracking-wide')}
                />
              </div>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField id="checkout-expiry" label="Expiry" error={errors.expiry}>
                <input
                  id="checkout-expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  value={expiry}
                  disabled={processing}
                  aria-invalid={Boolean(errors.expiry)}
                  aria-describedby={errors.expiry ? 'checkout-expiry-error' : undefined}
                  onChange={(e) => {
                    const next = e.target.value
                    const deleting = next.length < expiry.length
                    setExpiry(deleting ? next.replace(/\s\/\s?$/, '') : formatExpiry(next))
                    clearError('expiry')
                  }}
                  className={inputClass(errors.expiry, 'tabular-nums')}
                />
              </FormField>
              <FormField id="checkout-cvc" label="CVC" error={errors.cvc}>
                <input
                  id="checkout-cvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={cvc}
                  disabled={processing}
                  aria-invalid={Boolean(errors.cvc)}
                  aria-describedby={errors.cvc ? 'checkout-cvc-error' : undefined}
                  onChange={(e) => {
                    setCvc(digitsOnly(e.target.value).slice(0, 4))
                    clearError('cvc')
                  }}
                  className={inputClass(errors.cvc, 'tabular-nums')}
                />
              </FormField>
            </div>

            <div className="mt-1 flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Total due today</span>
              <span className="text-base font-extrabold tabular-nums">{total}</span>
            </div>

            <button
              type="submit"
              disabled={processing}
              aria-live="polite"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-spark-gradient text-[0.95rem] font-bold text-white shadow-[0_12px_28px_-12px_rgba(123,104,238,0.8)] transition active:scale-[0.98] disabled:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            >
              {processing ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
                  Processing {total}…
                </>
              ) : (
                <>
                  <Lock className="size-4" aria-hidden="true" />
                  Pay {total} &amp; Create Magic
                </>
              )}
            </button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Demo checkout — no real charge is made. Use any test card like 4242 4242 4242 4242.
            </p>
          </form>
        </>
      )}
    </SheetDialog>
  )
}

function inputClass(error: string | undefined, extra?: string) {
  return cn(
    'h-13 w-full rounded-2xl bg-background px-4 text-base font-medium outline-none ring-1 transition placeholder:text-muted-foreground/60 focus:bg-card focus:ring-2 disabled:opacity-60',
    error ? 'ring-destructive focus:ring-destructive' : 'ring-border focus:ring-lavender',
    extra,
  )
}

function FormField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessView({
  plan,
  email,
  childName,
  paidWith,
  onDone,
}: {
  plan: Plan
  email: string
  childName: string
  paidWith: 'card' | 'apple'
  onDone: () => void
}) {
  return (
    <div className="flex flex-col items-center px-2 pb-2 pt-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <span className="relative flex size-20 items-center justify-center rounded-full bg-[#E6F6EF]">
        <span className="absolute inset-0 animate-ping rounded-full bg-mint/40 [animation-iteration-count:2]" aria-hidden="true" />
        <Check className="relative size-9 text-[#2F7D62]" strokeWidth={3} aria-hidden="true" />
      </span>
      <h2 id="checkout-title" className="mt-5 text-balance font-serif text-2xl font-semibold tracking-tight">
        The magic is unlocked!
      </h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        Welcome to <span className="font-semibold text-foreground">{plan.name}</span>. {childName}&apos;s full storybook is
        being painted now. A receipt for {formatPrice(plan.priceCents)} was sent to{' '}
        <span className="break-all font-semibold text-foreground">{email}</span>.
      </p>
      <p className="mt-3 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        Paid with {paidWith === 'apple' ? 'Apple Pay' : 'card'} · Simulated
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-spark-gradient text-[0.95rem] font-bold text-white transition active:scale-[0.98]"
      >
        <PartyPopper className="size-4.5" aria-hidden="true" />
        Back to the Story
      </button>
    </div>
  )
}

function AppleMark() {
  return (
    <svg viewBox="0 0 384 512" className="size-4.5 -mt-0.5 fill-current" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}
