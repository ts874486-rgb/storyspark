import { Rocket, Sprout, Trees, type LucideIcon } from 'lucide-react'

export type Gender = 'boy' | 'girl'

export type ThemeId = 'space' | 'dino' | 'forest'

export type StoryTheme = {
  id: ThemeId
  name: string
  tagline: string
  icon: LucideIcon
  tint: string
  iconTint: string
  image: string
  title: string
  page: (name: string, gender: Gender) => string[]
}

const pronouns = (gender: Gender) =>
  gender === 'girl'
    ? { they: 'she', their: 'her', them: 'her' }
    : { they: 'he', their: 'his', them: 'him' }

export const THEMES: StoryTheme[] = [
  {
    id: 'space',
    name: 'Space Adventure',
    tagline: 'Rockets, planets & shooting stars',
    icon: Rocket,
    tint: 'bg-[#EEEBFE]',
    iconTint: 'text-[#6B5BE0]',
    image: '/images/story-space.png',
    title: 'The Night the Stars Said Hello',
    page: (name, gender) => {
      const p = pronouns(gender)
      return [
        `Long after the moon had tucked the town into bed, ${name} heard a tiny tap-tap-tap on the bedroom window.`,
        `Outside, a little silver rocket hovered, glowing like a nightlight. "We need a captain," it whispered. So ${name} pulled on ${p.their} softest slippers, climbed aboard, and the stars leaned in to say hello.`,
      ]
    },
  },
  {
    id: 'dino',
    name: 'Dino World',
    tagline: 'Friendly giants & hidden valleys',
    icon: Sprout,
    tint: 'bg-[#E6F5EE]',
    iconTint: 'text-[#2F8F6B]',
    image: '/images/story-dino.png',
    title: 'The Littlest Long-Neck',
    page: (name, gender) => {
      const p = pronouns(gender)
      return [
        `Behind the tallest fern in the valley, ${name} found a set of footprints — each one big enough to sit in.`,
        `They led to a baby long-neck named Pip, who had wandered too far from home. "Don't worry," said ${name}, giving Pip's warm nose a pat with ${p.their} hand. "We'll find your family together."`,
      ]
    },
  },
  {
    id: 'forest',
    name: 'Magic Forest',
    tagline: 'Glowing mushrooms & woodland friends',
    icon: Trees,
    tint: 'bg-[#FDEDEA]',
    iconTint: 'text-[#C2573A]',
    image: '/images/story-forest.png',
    title: 'The Lantern of Whispering Woods',
    page: (name, gender) => {
      const p = pronouns(gender)
      return [
        `When the fireflies began to hum, ${name} knew the Whispering Woods were waking up.`,
        `A small red fox trotted over, holding a lantern no bigger than an acorn. "Only the bravest heart can carry this light," the fox said — and gently placed it in ${p.their} hands.`,
      ]
    },
  },
]

export const AGES = Array.from({ length: 9 }, (_, i) => i + 2)
