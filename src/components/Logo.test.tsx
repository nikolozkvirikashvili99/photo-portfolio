import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Logo from './Logo.tsx'

describe('Logo', () => {
  it('is hidden from screen readers (the site name next to it is the label)', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the MG monogram and the six aperture blades', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('text')).toHaveTextContent('MG')
    expect(container.querySelectorAll('.logo__aperture line')).toHaveLength(6)
  })

  it('takes a size', () => {
    const { container } = render(<Logo size={32} />)
    expect(container.querySelector('svg')).toHaveAttribute('width', '32')
  })
})
