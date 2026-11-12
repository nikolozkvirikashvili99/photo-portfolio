import { socialIcons, type SocialIconName } from '../data/socialIcons.ts'

interface SocialIconProps {
  icon: SocialIconName
  size?: number
}

// Draws one social logo. Used by the footer (SocialLinks) and the header.
// aria-hidden: the logo is decoration; the link around it carries the name.
export default function SocialIcon({ icon, size = 20 }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path d={socialIcons[icon]} fill="currentColor" />
    </svg>
  )
}
