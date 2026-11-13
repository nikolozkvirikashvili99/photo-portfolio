import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import Album from './Album.tsx'
import { albums, EAGER_PHOTOS, photoCountLabel, type Album as AlbumData } from '../data/albums.ts'

const album = albums[0]

// A made-up album with 3 photos, so next / previous can be tested.
const photos = [1, 2, 3].map((n) => ({ id: `t/${n}`, src: `/t/${n}.jpg`, alt: `Photo ${n}`, width: 800, height: 1000 }))
const threePhotos: AlbumData = { slug: 'test', title: 'Test', photos, cover: photos[0] }

/** The full-screen viewer (a <dialog>). */
const viewer = () => document.querySelector('dialog')

describe('Album: full-screen viewer', () => {
  it('opens the photo you click, full screen', () => {
    render(<Album album={threePhotos} />)
    expect(viewer()).not.toBeNull() // the viewer is on the page
    expect(viewer()).not.toHaveAttribute('open') // starts closed
    fireEvent.click(screen.getByRole('button', { name: /Photo 2/ }))
    expect(viewer()).toHaveAttribute('open')
    expect(within(viewer()!).getByRole('img', { name: 'Photo 2' })).toBeInTheDocument()
  })

  it('closes again with the Close button', () => {
    render(<Album album={threePhotos} />)
    fireEvent.click(screen.getByRole('button', { name: /Photo 1/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(viewer()).not.toHaveAttribute('open')
  })

  it('shows the next photo with the arrow key, and wraps from the last to the first', () => {
    render(<Album album={threePhotos} />)
    fireEvent.click(screen.getByRole('button', { name: /Photo 3/ }))
    fireEvent.keyDown(viewer()!, { key: 'ArrowRight' })
    expect(within(viewer()!).getByRole('img', { name: 'Photo 1' })).toBeInTheDocument()
    expect(within(viewer()!).getByText('1 / 3')).toBeInTheDocument()
  })
})

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
