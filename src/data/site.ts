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

export interface Site {
  name: string
  tagline: string
  hero: HeroPhoto
  email: string
  phone: string
  socials: Social[]
}

// The one place to swap in the real name and details.
export const site: Site = {
  name: 'Maia Gabunia Photography',
  // The line under the name on the About photo: change it here.
  tagline: 'Portraits, weddings and quiet everyday moments.',
  // Background photo of the About section (public/about/). Swap a photo: same file names, or change these.
  hero: {
    src: '/about/hero-1200.jpg',
    srcLarge: '/about/hero-2400.jpg',
    alt: 'Models in white bridal gowns backstage',
    width: 2400,
    height: 1600,
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
