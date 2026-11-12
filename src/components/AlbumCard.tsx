import { albumHref, photoCountLabel, type Album } from '../data/albums.ts'

interface AlbumCardProps {
  album: Album
  /** Load the cover right away (first row) instead of lazily. */
  eager?: boolean
}

// One album in the gallery: its cover photo, title and photo count.
// The whole card is ONE link, so the photo and the text are all clickable.
export default function AlbumCard({ album, eager }: AlbumCardProps) {
  const { cover } = album

  return (
    <a className="album-card" href={albumHref(album.slug)}>
      <img
        className="album-card__image"
        src={cover.src}
        alt="" // the title below already names the link; the real alt is used on the album page
        width={cover.width}
        height={cover.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <h3 className="album-card__title">{album.title}</h3>
      <p className="album-card__count">{photoCountLabel(album.photos.length)}</p>
    </a>
  )
}
