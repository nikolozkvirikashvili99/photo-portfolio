import { useEffect, useRef, useState } from 'react'
import PhotoViewer from './PhotoViewer.tsx'
import { site } from '../data/site.ts'
import { EAGER_PHOTOS, photoCountLabel, type Album as AlbumData } from '../data/albums.ts'

interface AlbumProps {
  album: AlbumData
}

export default function Album({ album }: AlbumProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Which photo is open full screen: its number in album.photos, or null = viewer closed.
  // It starts closed. Changing it re-renders the page, and PhotoViewer opens / closes to match.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // A new "page" appeared without a page load: move focus to its heading so
  // keyboard and screen-reader users start here, not at the old link.
  useEffect(() => {
    headingRef.current?.focus()
  }, [album.slug])

  return (
    <section className="album container" aria-labelledby="album-title">
      {/* React 19 moves this into <head>; the tab shows the album name. */}
      <title>{`${album.title} · ${site.name}`}</title>
      <a className="album__back" href="#work">
        <span aria-hidden="true">←</span> All albums
      </a>
      <header className="album__header">
        <h1 id="album-title" className="album__title" ref={headingRef} tabIndex={-1}>
          {album.title}
        </h1>
        <p className="album__count">{photoCountLabel(album.photos.length)}</p>
      </header>
      <ul className="gallery__grid">
        {album.photos.map((photo, i) => (
          <li key={photo.id}>
            <figure className="gallery__item">
              {/* A real button, so the photo also opens with the keyboard (Tab, then Enter). */}
              <button
                type="button"
                className="album__open"
                onClick={() => setOpenIndex(i)} // open this photo full screen
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading={i < EAGER_PHOTOS ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span className="visually-hidden">(open full screen)</span>
              </button>
            </figure>
          </li>
        ))}
      </ul>
      {/* The full-screen viewer: always on the page, open only while openIndex is a number. */}
      <PhotoViewer
        photos={album.photos}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </section>
  )
}
