import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AlbumCard from './AlbumCard.tsx'

// A small made-up album, so this test stays the same when the real albums change.
const cover = { id: 'trip/01.jpg', src: '/albums/trip/01.jpg', alt: 'A boat at sunrise', width: 800, height: 1000 }
const album = {
  slug: 'trip',
  title: 'Summer trip',
  photos: [cover, { ...cover, id: 'trip/02.jpg', src: '/albums/trip/02.jpg' }],
  cover,
}

describe('AlbumCard (Nika)', () => {
  it('is ONE link to the album, named by its title only', () => {
    render(<AlbumCard album={album} />)
    const link = screen.getByRole('link', { name: 'Summer trip' })
    expect(link).toHaveAttribute('href', '/album/trip')
  })

  // Inside the link the title already says where it goes, so the cover is decorative (alt="").
  // The real alt text is still used on the album page.
  it('shows the cover photo (the first photo) with empty alt, width and height', () => {
    const { container } = render(<AlbumCard album={album} />)
    const img = container.querySelector('a img')
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('src', '/albums/trip/01.jpg')
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '1000')
  })

  it('shows the title as a heading and no photo count', () => {
    render(<AlbumCard album={album} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Summer trip' })).toBeInTheDocument()
    expect(screen.queryByText(/photos?$/)).not.toBeInTheDocument()
  })

  it('shows the short text under the card, as the link description (not its name)', () => {
    render(<AlbumCard album={{ ...album, description: 'Sunrise on the water.' }} />)
    const link = screen.getByRole('link', { name: 'Summer trip' })
    expect(link).toHaveAccessibleDescription('Sunrise on the water.')
    expect(screen.getByText('Sunrise on the water.')).toBeInTheDocument()
  })

  it('shows no text when the album has none', () => {
    render(<AlbumCard album={album} />)
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-describedby')
  })

  it('loads eagerly only when told to', () => {
    const { container, rerender } = render(<AlbumCard album={album} eager />)
    expect(container.querySelector('img')).toHaveAttribute('loading', 'eager')
    rerender(<AlbumCard album={album} eager={false} />)
    expect(container.querySelector('img')).toHaveAttribute('loading', 'lazy')
  })
})
