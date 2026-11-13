import { site } from '../data/site.ts'

// "Selected Work": the jobs list (Fashion Week…), between the album grid and the footer.
// Text lives in src/data/site.ts (about.workHeading, about.work). Same look as the About text.
export default function Credits() {
  const { workHeading, work } = site.about
  return (
    <section className="container about credits" aria-labelledby="credits-title">
      <h2 id="credits-title" className="about__heading">
        {workHeading}
      </h2>
      <ul className="about__list">
        {work.map((job) => (
          <li key={job}>{job}</li>
        ))}
      </ul>
    </section>
  )
}
