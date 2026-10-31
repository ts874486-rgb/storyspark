import { Suspense } from 'react'
import { OnboardingFlow } from '@/components/storyspark/onboarding-flow'

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-background" />}>
      <OnboardingFlow />
    </Suspense>
  )
}
