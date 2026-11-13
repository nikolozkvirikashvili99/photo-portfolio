import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Credits from './Credits.tsx'
import { site } from '../data/site.ts'

describe('Credits', () => {
  it('is a section titled Selected Work, listing every job', () => {
    render(<Credits />)
    const section = screen.getByRole('region', { name: site.about.workHeading })
    const items = within(section).getAllByRole('listitem')
    expect(items.map((li) => li.textContent)).toEqual(site.about.work)
  })
})
