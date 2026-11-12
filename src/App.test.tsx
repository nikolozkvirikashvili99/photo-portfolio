import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import App from './App.tsx'
import { albums, albumHref } from './data/albums.ts'

function goTo(hash: string) {
  act(() => {
    window.location.hash = hash
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
}

afterEach(() => {
  window.location.hash = ''
  vi.restoreAllMocks()
})

describe('App routing', () => {
  it('shows the gallery when there is no album in the URL', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
  })

  it('opens an album from #album/<slug>, and goes back to the gallery', () => {
    const album = albums[1]
    render(<App />)

    goTo(albumHref(album.slug))
    expect(screen.getByRole('heading', { level: 1, name: album.title })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Albums' })).not.toBeInTheDocument()

    goTo('#work')
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
  })

  it('scrolls to the top when an album opens', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    render(<App />)
    goTo(albumHref(albums[0].slug))
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('back to the gallery: keyboard focus lands on the album you came from', () => {
    const album = albums[2]
    render(<App />)
    goTo(albumHref(album.slug))
    goTo('#work')
    const card = screen.getAllByRole('link').find((a) => a.getAttribute('href') === albumHref(album.slug))
    expect(card).toHaveFocus()
  })

  it('a section link with no album before it scrolls to that section', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    window.location.hash = '#work'
    render(<App />)
    expect(scrollIntoView).toHaveBeenCalled()
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('work'))
  })

  it('shows the gallery for a broken album link', () => {
    window.location.hash = '#album/%'
    render(<App />)
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
  })

  it('shows the gallery for an album that does not exist', () => {
    window.location.hash = '#album/does-not-exist'
    render(<App />)
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
  })
})
