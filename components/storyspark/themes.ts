import { PawPrint, Rocket, Sprout, Trees, type LucideIcon } from 'lucide-react'

export type Gender = 'boy' | 'girl'

export type ThemeId = 'space' | 'dino' | 'forest' | 'jungle'

export type StoryContext = {
  name: string
  age: number
  gender: Gender
}

export type StoryPage = {
  image: string
  alt: string
  paragraphs: string[]
}

export type StoryTheme = {
  id: ThemeId
  name: string
  tagline: string
  icon: LucideIcon
  tint: string
  iconTint: string
  title: (ctx: StoryContext) => string
  pages: (ctx: StoryContext) => StoryPage[]
}

export const TOTAL_BOOK_PAGES = 12

const pronouns = (gender: Gender) =>
  gender === 'girl'
    ? { they: 'she', They: 'She', their: 'her', them: 'her', kid: 'girl' }
    : { they: 'he', They: 'He', their: 'his', them: 'him', kid: 'boy' }

export function possessive(name: string) {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`
}

export function formatChildName(raw: string) {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .join(' ')
}

export const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u

export const THEMES: StoryTheme[] = [
  {
    id: 'space',
    name: 'Space Adventure',
    tagline: 'Rockets, planets & shooting stars',
    icon: Rocket,
    tint: 'bg-[#EEEBFE]',
    iconTint: 'text-[#6B5BE0]',
    title: ({ name }) => `Captain ${name} and the Sleepy Stars`,
    pages: ({ name, age, gender }) => {
      const p = pronouns(gender)
      return [
        {
          image: '/images/story-space.png',
          alt: `${name} flying a little silver rocket past glowing planets`,
          paragraphs: [
            `Long after the moon had tucked the town into bed, ${name} heard a tiny tap-tap-tap on the bedroom window.`,
            `Outside, a little silver rocket hovered, glowing like a nightlight. "We need a captain who is exactly ${age} years brave," it whispered. So ${name} pulled on ${p.their} softest slippers, climbed aboard, and the stars leaned in to say hello.`,
          ],
        },
        {
          image: '/images/story-space-2.png',
          alt: `${name} meeting a friendly alien on the moon`,
          paragraphs: [
            `The rocket landed with a soft bounce on a moon made of silvery dust. Behind a crater peeked a round, blinking face. "I'm Zib," said the alien shyly. "The sleepy stars won't shine tonight, and I can't find my way home."`,
            `${name} thought for a moment, then smiled. "Every star just needs someone to believe in it." And with a gentle wave of ${p.their} hand, ${p.they} began to count them, one by one.`,
          ],
        },
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
    title: ({ name }) => `${name} and the Littlest Long-Neck`,
    pages: ({ name, age, gender }) => {
      const p = pronouns(gender)
      return [
        {
          image: '/images/story-dino.png',
          alt: `${name} meeting a gentle baby dinosaur in a fern valley`,
          paragraphs: [
            `Behind the tallest fern in the valley, ${name} found a set of footprints, each one big enough to sit in.`,
            `They led to a baby long-neck named Pip, who had wandered too far from home. "Don't worry," said ${name}, patting Pip's warm nose. "I'm ${age}, and that's old enough to be a very good guide. We'll find your family together."`,
          ],
        },
        {
          image: '/images/story-dino-2.png',
          alt: `${name} and Pip crossing a river toward a dinosaur family`,
          paragraphs: [
            `They hopped across the river stones, one, two, three, while the sky turned the color of peaches. Pip was nervous, but ${name} held ${p.their} tail steady and hummed a little song.`,
            `On the far bank, a great rumbly voice called out. Pip's mama! She lowered her long neck all the way down and gave ${name} the biggest, gentlest dinosaur hug in the whole valley.`,
          ],
        },
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
    title: ({ name }) => `${name} and the Lantern of Whispering Woods`,
    pages: ({ name, age, gender }) => {
      const p = pronouns(gender)
      return [
        {
          image: '/images/story-forest.png',
          alt: `${name} walking through a glowing magic forest with a fox`,
          paragraphs: [
            `When the fireflies began to hum, ${name} knew the Whispering Woods were waking up.`,
            `A small red fox trotted over, holding a lantern no bigger than an acorn. "Only a heart that is ${age} years kind can carry this light," the fox said, and gently placed it in ${p.their} hands.`,
          ],
        },
        {
          image: '/images/story-forest-2.png',
          alt: `${name} holding a lantern up to a wise old oak tree`,
          paragraphs: [
            `Deep in the woods stood Old Oak, the wisest tree of all. His leaves had gone quiet, and the forest animals gathered close, worried.`,
            `${name} lifted the tiny lantern high. Its glow danced across the bark, and Old Oak slowly opened his eyes. "Thank you, little ${p.kid}," he rumbled. "You've brought the magic back."`,
          ],
        },
      ]
    },
  },
  {
    id: 'jungle',
    name: 'Jungle Safari',
    tagline: 'Baby elephants & rainbow parrots',
    icon: PawPrint,
    tint: 'bg-[#FEF4DC]',
    iconTint: 'text-[#B7791F]',
    title: ({ name }) => `${possessive(name)} Great Jungle Safari`,
    pages: ({ name, age, gender }) => {
      const p = pronouns(gender)
      return [
        {
          image: '/images/story-jungle.png',
          alt: `${name} driving a safari jeep with a baby elephant`,
          paragraphs: [
            `The little green jeep rumbled down the jungle path, and ${name} held on to ${p.their} explorer hat with both hands.`,
            `Suddenly, a baby elephant stepped out of the leaves and gave a tiny trumpet. "Toot!" A parrot squawked from above, "The Safari Ranger is here, and ${p.they}'s only ${age}!" Every animal in the jungle peeked out to see.`,
          ],
        },
        {
          image: '/images/story-jungle-2.png',
          alt: `${name} resting on a branch with a monkey and a lion cub at sunset`,
          paragraphs: [
            `By golden hour, ${name} had made three new friends: Momo the monkey, Leo the lion cub, and Ellie the elephant.`,
            `They climbed to the top of the tallest tree to watch the waterfall sparkle. "Will you come back tomorrow?" asked Leo with a sleepy yawn. ${name} grinned. "Every night, in my dreams."`,
          ],
        },
      ]
    },
  },
]

export const AGES = Array.from({ length: 9 }, (_, i) => i + 2)
