'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DetailsScreen } from './details-screen'
import { LoadingScreen } from './loading-screen'
import { StoryPreview } from './story-preview'
import { ThemeModal } from './theme-modal'
import { NAME_PATTERN, THEMES, formatChildName, type Gender, type ThemeId } from './themes'
import { WelcomeScreen } from './welcome-screen'

type Step = 'welcome' | 'details' | 'loading' | 'preview'

const LOADING_DURATION_MS = 2500

function isStep(value: unknown): value is Step {
  return value === 'welcome' || value === 'details' || value === 'loading' || value === 'preview'
}

export function OnboardingFlow() {
  const searchParams = useSearchParams()
  const stepParam = searchParams.get('step')
  const step: Step = isStep(stepParam) ? stepParam : 'welcome'
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('girl')
  const [themeId, setThemeId] = useState<ThemeId | null>(null)
  const [themeModalOpen, setThemeModalOpen] = useState(false)

  const selectedTheme = THEMES.find((t) => t.id === themeId) ?? null
  const childName = formatChildName(name)
  const childAge = Number.parseInt(age, 10)
  const isComplete =
    childName.length > 0 && NAME_PATTERN.test(childName) && Number.isFinite(childAge) && selectedTheme !== null

  // Steps live in the URL so the Android back gesture/button walks back through the flow.
  useEffect(() => {
    setThemeModalOpen(false)
    window.scrollTo({ top: 0 })
  }, [step])

  const goTo = useCallback((next: Step, mode: 'push' | 'replace' = 'push') => {
    const url = next === 'welcome' ? window.location.pathname : `?step=${next}`
    if (mode === 'push') window.history.pushState(null, '', url)
    else window.history.replaceState(null, '', url)
  }, [])

  const goBack = useCallback(() => window.history.back(), [])

  const handleLoadingComplete = useCallback(() => goTo('preview', 'replace'), [goTo])

  // A forward/back navigation can land on a step whose data is no longer valid; fall back to the form.
  const visibleStep: Step = (step === 'preview' || step === 'loading') && !isComplete ? 'details' : step

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-background">
      {visibleStep === 'welcome' && <WelcomeScreen onStart={() => goTo('details')} />}

      {visibleStep === 'details' && (
        <DetailsScreen
          name={name}
          age={age}
          gender={gender}
          theme={selectedTheme}
          canSubmit={isComplete}
          onNameChange={setName}
          onAgeChange={setAge}
          onGenderChange={setGender}
          onOpenThemes={() => setThemeModalOpen(true)}
          onBack={goBack}
          onSubmit={() => {
            if (isComplete) goTo('loading')
          }}
        />
      )}

      {visibleStep === 'loading' && (
        <LoadingScreen name={childName} durationMs={LOADING_DURATION_MS} onComplete={handleLoadingComplete} />
      )}

      {visibleStep === 'preview' && selectedTheme && (
        <StoryPreview
          context={{ name: childName, age: childAge, gender }}
          theme={selectedTheme}
          onBack={goBack}
        />
      )}

      <ThemeModal
        open={themeModalOpen}
        selected={themeId}
        onClose={() => setThemeModalOpen(false)}
        onSelect={(id) => {
          setThemeId(id)
          setThemeModalOpen(false)
        }}
      />
    </main>
  )
}
