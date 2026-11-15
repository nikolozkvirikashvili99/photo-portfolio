import { useId } from 'react'
import { albumHref, photoCountLabel, type Album } from '../data/albums.ts'

interface AlbumCardProps {
  album: Album
  /** Load the cover right away (first row) instead of lazily. */
  eager?: boolean
}

// One album in the gallery: its cover photo, title, photo count and (optional) short text.
// The whole card is ONE link, so the photo and the text are all clickable.
export default function AlbumCard({ album, eager }: AlbumCardProps) {
  const { cover, description } = album
  const titleId = useId()
  const countId = useId()
  const descriptionId = useId()

  return (
    // The link's name stays short (title + count); the longer text is read as its description.
    <a
      className="album-card"
      href={albumHref(album.slug)}
      aria-labelledby={`${titleId} ${countId}`}
      aria-describedby={description ? descriptionId : undefined}
    >
      <img
        className="album-card__image"
        src={cover.src}
        alt="" // the title below already names the link; the real alt is used on the album page
        width={cover.width}
        height={cover.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <h3 className="album-card__title" id={titleId}>{album.title}</h3>
      <p className="album-card__count" id={countId}>{photoCountLabel(album.photos.length)}</p>
      {description && (
        <p className="album-card__description" id={descriptionId}>{description}</p>
      )}
    </a>
  )
}
