import { useEffect, useRef } from 'react'
import Header from './components/Header.tsx'
import Intro from './components/Intro.tsx'
import Gallery from './components/Gallery.tsx'
import Credits from './components/Credits.tsx'
import Album from './components/Album.tsx'
import Footer from './components/Footer.tsx'
import { albumFromPath, albumHref } from './data/albums.ts'
import { scrollToSection, takePendingScroll, useLinkClicks, usePath } from './hooks/usePath.ts'

export default function App() {
  useLinkClicks()
  const path = usePath()
  const album = albumFromPath(path)
  const slug = album?.slug

  const lastAlbum = useRef<string | null>(null)

  // A path we don't have ('/album/does-not-exist', '/whatever': vercel.json sends every
  // path here) shows the home page, so make the address bar say so too.
  // An album with a trailing slash ('/album/weddings/') loses the slash.
  useEffect(() => {
    const clean = slug ? albumHref(slug) : '/'
    if (path !== clean) window.history.replaceState(null, '', clean)
  }, [slug, path])

  // Switching between the home page and an album swaps the page content, so any
  // scrolling has to happen after React has rendered.
  useEffect(() => {
    // Read on EVERY page change (albums too), so it can't be left over for a later Back.
    const target = takePendingScroll() // undefined = browser Back / Forward or a reload
    if (slug) {
      lastAlbum.current = slug
      window.scrollTo(0, 0)
      return
    }
    // Back from an album ("All albums" or the browser's Back button): focus its card, so
    // keyboard users continue where they were (focus() also scrolls the card into view).
    // The logo goes to the top; another section link (The Photographer…) to that section.
    const from = lastAlbum.current
    lastAlbum.current = null
    const card =
      from &&
      (target === undefined || target === 'work') &&
      document.querySelector<HTMLAnchorElement>(`a[href="${albumHref(from)}"]`)
    if (card) {
      card.focus()
      return
    }
    if (target === 'top') window.scrollTo(0, 0)
    else if (target) scrollToSection(target)
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
            <Credits />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
