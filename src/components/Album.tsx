import { useEffect, useRef } from 'react'
import { site } from '../data/site.ts'
import { EAGER_PHOTOS, photoCountLabel, type Album as AlbumData } from '../data/albums.ts'

interface AlbumProps {
  album: AlbumData
}

export default function Album({ album }: AlbumProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

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
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading={i < EAGER_PHOTOS ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
