import { site } from '../data/site.ts'

// About: a full-width photo with the name and the tagline on top of it.
export default function Intro() {
  const { hero } = site
  return (
    <section id="about" className="intro" aria-labelledby="intro-title">
      {/* A real <img> (not a CSS background): it loads first, has alt text, and picks a size per screen. */}
      <img
        className="intro__photo"
        src={hero.src}
        srcSet={`${hero.src} 1200w, ${hero.srcLarge} 2400w`}
        sizes="100vw"
        alt={hero.alt}
        width={hero.width}
        height={hero.height}
        loading="eager"
        fetchPriority="high" // the biggest thing on screen: start downloading it right away
      />
      <div className="container intro__content">
        <h1 id="intro-title" className="intro__title">
          {site.name}
        </h1>
        <p>{site.tagline}</p>
      </div>
    </section>
  )
}
