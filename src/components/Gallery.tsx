import { albums, EAGER_PHOTOS } from '../data/albums.ts'
import AlbumCard from './AlbumCard.tsx'

export default function Gallery() {
  return (
    <section id="work" className="gallery container" aria-labelledby="work-title">
      <h2 id="work-title" className="visually-hidden">
        Albums
      </h2>
      <ul className="gallery__grid">
        {albums.map((album, i) => (
          <li key={album.slug}>
            <AlbumCard album={album} eager={i < EAGER_PHOTOS} />
          </li>
        ))}
      </ul>
    </section>
  )
}
