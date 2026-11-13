interface LogoProps {
  size?: number
}

// The six blade edges of the aperture, each running out to the rim.
const blades = [
  [85, 27, 136.4, 23.7],
  [135.2, 56, 163.8, 98.9],
  [135.2, 114, 112.4, 160.2],
  [85, 143, 33.6, 146.3],
  [34.8, 114, 6.2, 71.1],
  [34.8, 56, 57.6, 9.8],
]

// "A3" badge: a filled disc with a camera aperture and the MG monogram.
// Colours come from CSS (.logo__*), so it follows the header's tokens.
// aria-hidden: it sits next to the site name, which already labels the link.
export default function Logo({ size = 40 }: LogoProps) {
  return (
    <svg
      className="logo"
      viewBox="0 0 170 170"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <circle className="logo__disc" cx="85" cy="85" r="82" />
      <g className="logo__aperture">
        <polygon points="85,27 135.2,56 135.2,114 85,143 34.8,114 34.8,56" />
        {blades.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <text className="logo__monogram" x="85" y="101" textAnchor="middle">
        <tspan fontWeight="600">M</tspan>
        <tspan fontStyle="italic" fontWeight="500" dx="-4">
          G
        </tspan>
      </text>
    </svg>
  )
}
