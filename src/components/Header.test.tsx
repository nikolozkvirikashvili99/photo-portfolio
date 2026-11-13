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
    expect(within(screen.getByRole('navigation')).queryAllByRole('link')).toHaveLength(0)
  })

  // Checks where the links go, not their wording: rename them freely in Header.tsx.
  it('opens the menu to show the work, about and contact links, in that order', () => {
    render(<Header />)
    fireEvent.click(menuButton())
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true')
    const nav = screen.getByRole('navigation')
    const links = within(nav).getAllByRole('link')
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#work', '#about', '#contact'])
    for (const link of links) expect(link.textContent?.trim()).not.toBe('') // every link has visible text
  })

  it('closes when a link is chosen', () => {
    render(<Header />)
    fireEvent.click(menuButton())
    fireEvent.click(within(screen.getByRole('navigation')).getAllByRole('link')[1])
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
