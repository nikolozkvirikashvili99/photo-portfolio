import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Gallery from './Gallery.tsx'
import { albums, EAGER_PHOTOS } from '../data/albums.ts'

describe('Gallery', () => {
  it('is a labelled section', () => {
    render(<Gallery />)
    expect(screen.getByRole('region', { name: 'Albums' })).toBeInTheDocument()
  })

  it('renders one list item per album', () => {
    render(<Gallery />)
    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(albums.length)
  })

  // Needs AlbumCard (Nika's piece) to pass.
  it('links each cover to its album, first row eager', () => {
    render(<Gallery />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(albums.length)
    albums.forEach((album, i) => {
      expect(links[i]).toHaveAttribute('href', `#album/${album.slug}`)
      expect(links[i].querySelector('img')).toHaveAttribute('loading', i < EAGER_PHOTOS ? 'eager' : 'lazy')
    })
  })
})
