import { site } from '../data/site.ts'
import SocialLinks from './SocialLinks.tsx'

// Computed once at load, not on every render (keeps render pure).
const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container site-footer__inner">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        {/* tel: opens the phone's dialer with the number filled in. */}
        <a href={`tel:${site.phone}`}>{site.phone}</a>
        <SocialLinks />
        <p>
          © {year} {site.name}
        </p>
      </div>
    </footer>
  )
}
