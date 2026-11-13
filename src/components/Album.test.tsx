import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Album from './Album.tsx'
import { albums, EAGER_PHOTOS, photoCountLabel } from '../data/albums.ts'

const album = albums[0]

describe('Album', () => {
  it('shows the album title as the page heading, focused', () => {
    render(<Album album={album} />)
    const heading = screen.getByRole('heading', { level: 1, name: album.title })
    expect(heading).toHaveFocus()
  })

  it('shows how many photos it has', () => {
    render(<Album album={album} />)
    // "1 photo" / "8 photos": the same wording the page uses.
    expect(screen.getByText(photoCountLabel(album.photos.length))).toBeInTheDocument()
  })

  it('shows every photo with its alt text, first row eager', () => {
    render(<Album album={album} />)
    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(album.photos.length)
    album.photos.forEach((photo, i) => {
      expect(screen.getByAltText(photo.alt)).toHaveAttribute('loading', i < EAGER_PHOTOS ? 'eager' : 'lazy')
    })
  })

  it('links back to all albums', () => {
    render(<Album album={album} />)
    expect(screen.getByRole('link', { name: /all albums/i })).toHaveAttribute('href', '#work')
  })

  it('sets the browser tab title', () => {
    render(<Album album={album} />)
    expect(document.title).toContain(album.title)
  })
})
