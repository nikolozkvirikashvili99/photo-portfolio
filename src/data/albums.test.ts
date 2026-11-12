import { describe, it, expect } from 'vitest'
import { albums, albumFromHash, albumHref, photoCountLabel } from './albums.ts'

describe('albums data', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = albums.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('gives every album at least one photo, and the first one is the cover', () => {
    for (const album of albums) {
      expect(album.photos.length).toBeGreaterThan(0)
      expect(album.cover).toBe(album.photos[0])
    }
  })

  it('gives every photo a file in its album folder, alt text and a size', () => {
    for (const album of albums) {
      for (const photo of album.photos) {
        expect(photo.src.startsWith(`/albums/${album.slug}/`)).toBe(true)
        expect(photo.src).toMatch(/\.(jpe?g|png|webp|avif)$/)
        expect(photo.alt.trim()).not.toBe('')
        expect(photo.width).toBeGreaterThan(0)
        expect(photo.height).toBeGreaterThan(0)
      }
    }
  })
})

describe('albumFromHash', () => {
  it('finds the album for #album/<slug>', () => {
    const first = albums[0]
    expect(albumFromHash(albumHref(first.slug))).toBe(first)
  })

  it('returns null for section links, unknown albums and no hash', () => {
    expect(albumFromHash('#work')).toBeNull()
    expect(albumFromHash('#album/does-not-exist')).toBeNull()
    expect(albumFromHash('')).toBeNull()
  })

  it('returns null (no crash) for a broken link like #album/%', () => {
    expect(albumFromHash('#album/%')).toBeNull()
    expect(albumFromHash('#album/%E0%A4%A')).toBeNull()
  })
})

describe('photoCountLabel', () => {
  it('uses singular for one photo', () => {
    expect(photoCountLabel(1)).toBe('1 photo')
    expect(photoCountLabel(8)).toBe('8 photos')
  })
})
