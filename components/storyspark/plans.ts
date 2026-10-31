import { Crown, Sparkles, Wand2, type LucideIcon } from 'lucide-react'

export type PlanId = 'single' | 'monthly' | 'yearly'

export type Plan = {
  id: PlanId
  name: string
  subtitle: string
  priceCents: number
  cadence: string
  billingNote: string
  badge?: { label: string; className: string }
  icon: LucideIcon
  iconTint: string
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'single',
    name: 'Single Spark',
    subtitle: 'Perfect to try',
    priceCents: 499,
    cadence: 'one-time',
    billingNote: 'One-time payment',
    icon: Sparkles,
    iconTint: 'bg-[#FFF1E8] text-[#E07A52]',
    features: ['1 Custom Story PDF', 'Standard Quality Art', 'Instant Digital Download'],
  },
  {
    id: 'monthly',
    name: 'Monthly Magic',
    subtitle: 'For bedtime readers',
    priceCents: 2499,
    cadence: '/ month',
    billingNote: 'Billed monthly',
    badge: { label: 'Best Value', className: 'bg-spark-gradient text-white' },
    icon: Wand2,
    iconTint: 'bg-[#F0ECFF] text-primary',
    features: ['Unlimited Storybooks', 'High-Definition Art Generation', 'Early Access to New Themes (Dino, Safari)'],
  },
  {
    id: 'yearly',
    name: 'Yearly Fairytale',
    subtitle: 'Ultimate story vault',
    priceCents: 4499,
    cadence: '/ year',
    billingNote: 'Billed yearly',
    badge: { label: 'Save 85%', className: 'bg-[#DDF3EA] text-[#2F7D62]' },
    icon: Crown,
    iconTint: 'bg-[#E6F6EF] text-[#2F7D62]',
    features: ['Everything in Monthly', 'Priority AI Processing', 'Print-Ready Book Formats', 'Cancel Anytime'],
  },
]

export const DEFAULT_PLAN_ID: PlanId = 'monthly'

export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0]
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
