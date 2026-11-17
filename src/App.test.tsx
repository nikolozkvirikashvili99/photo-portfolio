import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import App from './App.tsx'
import { albums, albumHref } from './data/albums.ts'
import { navigate, cleanUpUrl } from './hooks/usePath.ts'

function goTo(path: string) {
  act(() => navigate(path))
}

/** The browser's Back button landing on `path`. */
function browserBackTo(path: string) {
  act(() => {
    window.history.replaceState(null, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
}

/** A fresh page load at `path` (main.tsx runs cleanUpUrl, then React renders). */
function loadAt(path: string) {
  window.history.replaceState(null, '', path)
  cleanUpUrl()
  render(<App />)
}

function link(name: RegExp | string) {
  return screen.getByRole('link', { name })
}

/** A header link: open the ☰ menu first, like a phone user. */
function menuLink(name: string) {
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
  return link(name)
}

// The first link named after Maia is the header logo (the footer has one too).
const logo = () => screen.getAllByRole('link', { name: /maia gabunia/i })[0]
const noHash = () => expect(window.location.href).not.toContain('#')

afterEach(() => {
  window.history.replaceState(null, '', '/')
  vi.restoreAllMocks()
})

describe('App routing (clean URLs, never a #)', () => {
  it('shows the home page at /', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
  })

  it('no link on the page has a # in it', () => {
    render(<App />)
    for (const a of screen.getAllByRole('link', { hidden: true })) {
      expect(a.getAttribute('href')).not.toContain('#')
    }
  })

  it('opens an album from its card at /album/<slug>, without a page load', () => {
    const album = albums[1]
    render(<App />)
    fireEvent.click(link(album.title))
    expect(window.location.pathname).toBe(albumHref(album.slug))
    noHash()
    expect(screen.getByRole('heading', { level: 1, name: album.title })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Albums' })).not.toBeInTheDocument()
  })

  it('opens an album when the page is loaded at its URL (trailing slash dropped)', () => {
    loadAt(`${albumHref(albums[0].slug)}/`)
    expect(screen.getByRole('heading', { level: 1, name: albums[0].title })).toBeInTheDocument()
    expect(window.location.pathname).toBe(albumHref(albums[0].slug))
  })

  it('scrolls to the top when an album opens', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    render(<App />)
    goTo(albumHref(albums[0].slug))
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('"All albums" goes back to / and focuses the album you came from', () => {
    const album = albums[2]
    render(<App />)
    goTo(albumHref(album.slug))
    fireEvent.click(link(/all albums/i))
    expect(window.location.pathname).toBe('/')
    noHash()
    expect(link(album.title)).toHaveFocus()
  })

  it('the browser Back button from an album focuses its card again', () => {
    const album = albums[0]
    render(<App />)
    goTo(albumHref(album.slug))
    browserBackTo('/')
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
    expect(link(album.title)).toHaveFocus()
  })

  it('Back still focuses the card after an earlier section link (the section is used once)', () => {
    render(<App />)
    goTo(albumHref(albums[0].slug))
    fireEvent.click(menuLink('The Photographer')) // home, scrolled to About
    fireEvent.click(link(albums[1].title))
    browserBackTo('/')
    expect(link(albums[1].title)).toHaveFocus()
  })

  it('the logo on an album page goes to the top of the home page', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    render(<App />)
    goTo(albumHref(albums[0].slug))
    scrollTo.mockClear()
    fireEvent.click(logo())
    expect(window.location.pathname).toBe('/')
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    expect(link(albums[0].title)).not.toHaveFocus()
  })

  it('a header link on an album page goes home, scrolls to the section and moves focus there', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<App />)
    goTo(albumHref(albums[0].slug))
    fireEvent.click(menuLink('The Photographer'))
    const about = document.getElementById('about')
    expect(window.location.pathname).toBe('/')
    noHash()
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(about)
    expect(about).toHaveFocus()
  })

  it('a header link on the home page just scrolls; the URL stays /', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<App />)
    fireEvent.click(menuLink('Inquiries'))
    expect(window.location.href).toBe(`${window.location.origin}/`)
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('contact'))
  })

  it('leaves Ctrl-click (new tab) to the browser', () => {
    render(<App />)
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true })
    link(albums[0].title).dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(window.location.pathname).toBe('/')
  })

  it('leaves links to files (a photo, a PDF) to the browser', () => {
    render(<App />)
    const a = document.createElement('a')
    a.href = '/albums/fashion/01.jpg'
    document.body.append(a)
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    a.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    a.remove()
  })

  it('an album that does not exist shows the home page at /', () => {
    loadAt('/album/does-not-exist')
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })

  it('a broken album link shows the home page', () => {
    loadAt('/album/%')
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
  })
})

describe('direct and old links end on a clean URL', () => {
  it('/about loads the home page at /, scrolled to About', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    loadAt('/about')
    expect(window.location.pathname).toBe('/')
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('about'))
  })

  it('/#album/<slug> (old shared link) becomes /album/<slug>', () => {
    loadAt(`/#album/${albums[3].slug}`)
    expect(window.location.pathname).toBe(albumHref(albums[3].slug))
    noHash()
    expect(screen.getByRole('heading', { level: 1, name: albums[3].title })).toBeInTheDocument()
  })

  it('/#about becomes / and still scrolls to About', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    loadAt('/#about')
    noHash()
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('about'))
  })

  it('a bare /# loses its #', () => {
    loadAt('/#')
    noHash()
  })

  it('an old link pasted while already on the site is cleaned up too', () => {
    render(<App />)
    act(() => {
      window.history.replaceState(null, '', `/#album/${albums[0].slug}`)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(window.location.pathname).toBe(albumHref(albums[0].slug))
    noHash()
    expect(screen.getByRole('heading', { level: 1, name: albums[0].title })).toBeInTheDocument()
  })
})
