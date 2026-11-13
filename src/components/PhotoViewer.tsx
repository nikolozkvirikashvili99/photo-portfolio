import { useEffect, useRef } from 'react'
import type { Photo } from '../data/albums.ts'

// The props this component receives from Album.tsx.
interface PhotoViewerProps {
  /** The album's photos. */
  photos: Photo[]
  /** Which photo is open (its number in `photos`), or null when the viewer is closed. */
  index: number | null
  /** Album gives us this; we call it to close the viewer (Close button, Esc, dark area). */
  onClose: () => void
  /** We call this with the number of the photo to show instead (next / previous). */
  onChange: (index: number) => void
}

// Full-screen view of one photo, on top of the album page.
// Built on the browser's own <dialog>: showModal() dims and locks the page behind it,
// keeps Tab inside, closes on Esc, and puts focus back where it was when it closes.
export default function PhotoViewer({ photos, index, onClose, onChange }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const photo = index === null ? null : photos[index]
  const many = photos.length > 1

  // Keep the real <dialog> in step with `index`: a number opens it, null closes it.
  useEffect(() => {
    const dialog = dialogRef.current!
    if (index !== null && !dialog.open) dialog.showModal()
    if (index === null && dialog.open) dialog.close()
  }, [index])

  // Next (+1) or previous (-1), wrapping around at the ends.
  function go(step: number) {
    if (index === null) return
    onChange((index + step + photos.length) % photos.length)
  }

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-label="Full-screen photo"
      // Esc (or anything else that closes the dialog) ends up here.
      onClose={onClose}
      // A click on the dark area around the photo (the dialog itself, not the photo) closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (!many) return
        if (event.key === 'ArrowRight') go(1)
        if (event.key === 'ArrowLeft') go(-1)
      }}
    >
      {photo && (
        <>
          <img
            className="viewer__photo"
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
          />
          <button type="button" className="viewer__button viewer__close" onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="visually-hidden">Close</span>
          </button>
          {many && (
            <>
              <button type="button" className="viewer__button viewer__prev" onClick={() => go(-1)}>
                <span aria-hidden="true">‹</span>
                <span className="visually-hidden">Previous photo</span>
              </button>
              <button type="button" className="viewer__button viewer__next" onClick={() => go(1)}>
                <span aria-hidden="true">›</span>
                <span className="visually-hidden">Next photo</span>
              </button>
              <p className="viewer__count">
                {index! + 1} / {photos.length}
              </p>
            </>
          )}
        </>
      )}
    </dialog>
  )
}
