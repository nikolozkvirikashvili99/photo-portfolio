import { site } from '../data/site.ts'
import SocialLinks from './SocialLinks.tsx'

// Computed once at load, not on every render (keeps render pure).
const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      {/* Everything centred: social logos, a thin line, contact links, then the © line. */}
      <div className="container site-footer__inner">
        <SocialLinks />
        <ul className="site-footer__links">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            {/* tel: opens the phone's dialer with the number filled in. */}
            <a href={`tel:${site.phone}`}>{site.phone}</a>
          </li>
        </ul>
        <p className="site-footer__copy">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  )
}
