import { site } from '../data/site.ts'

// About: the photo with the name and tagline, then the About text under it.
export default function Intro() {
  const { hero, about } = site
  return (
    <section id="about" aria-labelledby="intro-title">
      <div className="intro">
        {/* A real <img> (not a CSS background): it loads first, has alt text, and picks a size per screen. */}
        <img
          className="intro__photo"
          src={hero.src}
          srcSet={`${hero.src} 1200w, ${hero.srcLarge} 2400w`}
          sizes="(min-width: 48rem) 45vw, 100vw"
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
      </div>

      {/* The text under the photo: written in src/data/site.ts (about). */}
      <div className="container about">
        <div className="about__text">
          <h2 className="about__heading">{about.heading}</h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
