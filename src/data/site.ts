import type { SocialIconName } from './socialIcons.ts'

export interface Social {
  name: string
  icon: SocialIconName
  url: string
}

export interface HeroPhoto {
  src: string // the small copy; also the fallback
  srcLarge: string // the big copy, for wide or sharp screens
  alt: string
  width: number
  height: number
}

export interface AboutText {
  heading: string
  paragraphs: string[] // one string per paragraph
  workHeading: string
  work: string[] // one line per job; the dash in front is added by the page
}

export interface Site {
  name: string
  tagline: string
  hero: HeroPhoto
  about: AboutText
  email: string
  phone: string
  socials: Social[]
}

// The one place to swap in the real name and details.
export const site: Site = {
  name: 'Maia Gabunia Photography',
  // The line under the name on the About photo: change it here.
  tagline: 'Fashion, campaigns, portraits & editorial weddings.',
  // Background photo of the About section (public/about/). Swap a photo: same file names, or change these.
  hero: {
    src: '/about/hero-1200.jpg',
    srcLarge: '/about/hero-2400.jpg',
    alt: 'Models in white bridal gowns backstage',
    width: 2400,
    height: 1600,
  },
  // The text under the About photo. Each paragraph is its own string; each job its own line.
  about: {
    heading: 'About me',
    paragraphs: [
      'Hi, I’m Maia, a photographer based in Tbilisi working across fashion and weddings. I photograph backstage at fashion shows, bridal moments and personal portraits. My style is quiet and cinematic: natural light, real emotion, nothing over-posed.',
      'For brands and fashion events, I provide discreet backstage coverage that shows both the collection and the people behind it. For couples, I photograph the wedding day the way it actually feels, so you can live it again years later.',
    ],
    workHeading: 'Selected Work',
    work: [
      'Georgia Fashion Week, Season 7: backstage photographer (accredited)',
      'Georgia Fashion Week, Season 8: backstage photographer (accredited) and sole casting photographer',
    ],
  },
  email: 'maiagabunia01@gmail.com',
  phone: '+995595432442',
  socials: [
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com/maiagabuniaphoto/',
    },
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://www.facebook.com/share/1KRfsecxdH/',
    },
    {
      name: 'TikTok',
      icon: 'tiktok',
      url: 'https://www.tiktok.com/@maiagabuniaphoto/',
    },
  ],
}
