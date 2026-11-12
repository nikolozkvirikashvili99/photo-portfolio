import { useEffect, useRef } from 'react'
import Header from './components/Header.tsx'
import Intro from './components/Intro.tsx'
import Gallery from './components/Gallery.tsx'
import Album from './components/Album.tsx'
import Footer from './components/Footer.tsx'
import { albumFromHash, albumHref } from './data/albums.ts'
import { useHash } from './hooks/useHash.ts'

export default function App() {
  const hash = useHash()
  const album = albumFromHash(hash)
  const slug = album?.slug

  const lastAlbum = useRef<string | null>(null)

  // Switching between the gallery and an album swaps the page content, so the
  // browser's own jump-to-#anchor can't work: do it after React has rendered.
  useEffect(() => {
    if (slug) {
      lastAlbum.current = slug
      window.scrollTo(0, 0)
      return
    }
    // Back from an album: focus its card, so keyboard users continue where they were
    // (focus() also scrolls the card into view).
    const from = lastAlbum.current
    lastAlbum.current = null
    const card = from && document.querySelector<HTMLAnchorElement>(`a[href="${albumHref(from)}"]`)
    if (card) {
      card.focus()
      return
    }
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [slug])

  return (
    <>
      <Header />
      <main>
        {album ? (
          <Album album={album} />
        ) : (
          <>
            <Intro />
            <Gallery />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
