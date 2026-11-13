import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Intro from './Intro.tsx'
import { site } from '../data/site.ts'

describe('Intro', () => {
  it('is the About section, titled with the site name', () => {
    render(<Intro />)
    const section = screen.getByRole('region', { name: site.name })
    expect(section).toHaveAttribute('id', 'about')
    expect(within(section).getByRole('heading', { level: 1, name: site.name })).toBeInTheDocument()
    expect(within(section).getByText(site.tagline)).toBeInTheDocument()
  })

  it('shows the background photo with alt text, loaded first', () => {
    render(<Intro />)
    const photo = screen.getByRole('img', { name: site.hero.alt })
    expect(photo).toHaveAttribute('src', site.hero.src)
    expect(photo).toHaveAttribute('loading', 'eager')
    expect(photo).toHaveAttribute('width', String(site.hero.width))
  })
})
