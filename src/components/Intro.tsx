import { site } from '../data/site.ts'

export default function Intro() {
  return (
    <section id="about" className="intro container" aria-labelledby="intro-title">
      <h1 id="intro-title" className="intro__title">
        {site.name}
      </h1>
      <p>{site.tagline}</p>
    </section>
  )
}
