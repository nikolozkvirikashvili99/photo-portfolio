import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import Header from './Header.tsx'
import { site } from '../data/site.ts'

const menuButton = () => screen.getByRole('button', { name: /menu/i })

describe('Header', () => {
  it('is the page banner and shows the site name', () => {
    render(<Header />)
    const banner = screen.getByRole('banner')
    expect(within(banner).getByText(site.name)).toBeInTheDocument()
  })

  it('has a navigation landmark inside the banner', () => {
    render(<Header />)
    const banner = screen.getByRole('banner')
    expect(within(banner).getByRole('navigation')).toBeInTheDocument()
  })

  it('shows an Instagram logo link, outside the menu, opening in a new tab', () => {
    render(<Header />)
    const instagram = site.socials.find((s) => s.icon === 'instagram')!
    const banner = screen.getByRole('banner')
    const link = within(banner).getByRole('link', { name: /instagram/i })
    expect(link).toHaveAttribute('href', instagram.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link.querySelector('svg')).not.toBeNull()
    // Visible without opening the menu, and not one of the menu's page links.
    expect(screen.getByRole('navigation')).not.toContainElement(link)
  })

  it('starts with the menu closed: links hidden, button says collapsed', () => {
    render(<Header />)
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: /gallery/i })).toBeNull()
  })

  it('opens the menu to show Gallery, About and Contact, in that order', () => {
    render(<Header />)
    fireEvent.click(menuButton())
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true')
    const nav = screen.getByRole('navigation')
    const links = within(nav).getAllByRole('link')
    // Lower-cased, so changing a label's capitals doesn't break the test.
    expect(links.map((a) => [a.textContent?.toLowerCase(), a.getAttribute('href')])).toEqual([
      ['gallery', '#work'],
      ['about', '#about'],
      ['contact', '#contact'],
    ])
  })

  it('closes when a link is chosen', () => {
    render(<Header />)
    fireEvent.click(menuButton())
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on Escape and gives focus back to the button', () => {
    render(<Header />)
    fireEvent.click(menuButton())
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton()).toHaveFocus()
  })

  it('closes when you click outside it', () => {
    render(<Header />)
    fireEvent.click(menuButton())
    fireEvent.pointerDown(document.body)
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
  })
})
