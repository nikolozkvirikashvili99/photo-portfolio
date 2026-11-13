import { site } from '../data/site.ts'
import SocialIcon from './SocialIcon.tsx'

export default function SocialLinks() {
  return (
    <ul className="social-links">
      {site.socials.map((social) => (
        <li key={social.icon}>
          <a
            href={social.url}
            // Opens in a new tab; "noopener noreferrer" stops the new tab from controlling this page.
            target="_blank"
            rel="noopener noreferrer"
            // The link shows only a logo, so this is the text a screen reader says.
            aria-label={`${site.name} on ${social.name}`}
          >
            <SocialIcon icon={social.icon} size={28} />
          </a>
        </li>
      ))}
    </ul>
  )
}
