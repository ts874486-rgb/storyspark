'use client'

import { useState } from 'react'
import { DetailsScreen } from './details-screen'
import { StoryPreview } from './story-preview'
import { ThemeModal } from './theme-modal'
import { THEMES, type Gender, type ThemeId } from './themes'
import { WelcomeScreen } from './welcome-screen'

type Step = 'welcome' | 'details' | 'preview'

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('girl')
  const [themeId, setThemeId] = useState<ThemeId | null>(null)
  const [themeModalOpen, setThemeModalOpen] = useState(false)

  const selectedTheme = THEMES.find((t) => t.id === themeId)

  function goTo(next: Step) {
    setStep(next)
    window.scrollTo({ top: 0 })
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-background">
      {step === 'welcome' && <WelcomeScreen onStart={() => goTo('details')} />}

      {step === 'details' && (
        <DetailsScreen
          name={name}
          age={age}
          gender={gender}
          themeId={themeId}
          onNameChange={setName}
          onAgeChange={setAge}
          onGenderChange={setGender}
          onOpenThemes={() => setThemeModalOpen(true)}
          onBack={() => goTo('welcome')}
          onSubmit={() => goTo('preview')}
        />
      )}

      {step === 'preview' && selectedTheme && (
        <StoryPreview
          name={name.trim()}
          gender={gender}
          theme={selectedTheme}
          onBack={() => goTo('details')}
        />
      )}

      <ThemeModal
        open={themeModalOpen}
        selected={themeId}
        onClose={() => setThemeModalOpen(false)}
        onConfirm={(id) => {
          setThemeId(id)
          setThemeModalOpen(false)
        }}
      />
    </main>
  )
}
