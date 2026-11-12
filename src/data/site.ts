import type { SocialIconName } from './socialIcons.ts'

export interface Social {
  name: string
  icon: SocialIconName
  url: string
}

export interface Site {
  name: string
  tagline: string
  email: string
  phone: string
  socials: Social[]
}

// The one place to swap in the real name and details.
export const site: Site = {
  name: 'Maia Gabunia Photography',
  tagline: 'Portraits, weddings and quiet everyday moments.',
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
