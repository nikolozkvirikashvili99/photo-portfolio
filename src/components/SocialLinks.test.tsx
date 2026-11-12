import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SocialLinks from './SocialLinks.tsx'
import { site } from '../data/site.ts'

describe('SocialLinks', () => {
  it('has one link per social profile, named for screen readers', () => {
    render(<SocialLinks />)
    for (const social of site.socials) {
      // Icon-only links still need a name, e.g. "Maia Gabunia Photography on Instagram".
      const link = screen.getByRole('link', { name: new RegExp(social.name, 'i') })
      expect(link).toHaveAttribute('href', social.url)
    }
  })

  it('opens profiles in a new tab, safely', () => {
    render(<SocialLinks />)
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('shows a logo inside each link', () => {
    render(<SocialLinks />)
    for (const link of screen.getAllByRole('link')) {
      expect(link.querySelector('svg')).not.toBeNull()
    }
  })
})
