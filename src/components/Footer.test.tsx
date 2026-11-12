import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer.tsx'
import { site } from '../data/site.ts'

describe('Footer', () => {
  it('links the email and the phone number', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    )
    expect(screen.getByRole('link', { name: site.phone })).toHaveAttribute(
      'href',
      `tel:${site.phone}`,
    )
  })
})
