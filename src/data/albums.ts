// The albums, in display order. Each album's files live in public/albums/<slug>/.
// The FIRST photo of each album is its cover in the gallery.
//
// To add a photo to an album:
//   1. Put it in the album's folder with the next number: public/albums/weddings/02.jpg, 03.jpg, …
//      Long side about 2000px keeps the page fast (phone originals are 4000-6000px: shrink them).
//   2. Add a line under that album's photos: ['02.jpg', 'what the photo shows', width, height].
//      The alt text is what someone who can't see the photo should know.
//   3. New album? Add a folder + a block below. `slug` is the folder name and the link
//      (/album/weddings): lowercase, no spaces.
//   width/height are the file's pixel size (they stop the page jumping while photos load);
//   left out, 800×1000 (portrait) is assumed.
/** [file, alt, width?, height?]: one line per photo in the list below. */
type PhotoEntry = [file: string, alt: string, width?: number, height?: number]

interface AlbumEntry {
  slug: string
  title: string
  /** The short text under the album's card in the gallery. Leave it out for no text. */
  description?: string
  photos: PhotoEntry[]
}

export interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

export interface Album {
  slug: string
  title: string
  description?: string
  photos: Photo[]
  cover: Photo
}

const data: AlbumEntry[] = [
  {
    slug: 'fashion',
    title: 'Fashion',
    description: 'For fashion events, I provide discreet backstage coverage that captures the energy of the show and the people behind it.',
    photos: [
      ['01.jpg', 'Model backstage in a black lace jumpsuit and laced leather corset, arms raised as dark fabric swirls around her', 1333, 2000],
    ],
  },
  {
    slug: 'brands',
    title: 'Brands',
    description: 'For brands, I create campaign, commercial and editorial imagery that presents every piece in its full beauty and character.',
    photos: [
      ['01.jpg', 'Model seen from behind in a white sequined open-back dress with a chain of crystal flowers down the spine', 1333, 2000],
    ],
  },
  {
    slug: 'weddings',
    title: 'Weddings',
    description: 'For couples, I photograph the wedding day the way it actually feels, so you can live it again years later.',
    photos: [
      ['01.jpg', 'Bride in a satin gown with a long train smiling up at the camera as the groom holds her hand, seen from above', 1500, 2000],
    ],
  },
  {
    slug: 'portraits',
    title: 'Portraits',
    description: 'For portraits, I create a calm, unhurried space where you can simply be yourself, and the camera finds the rest.',
    photos: [
      ['01.jpg', 'Black-and-white portrait of a woman leaning against a wall by a window', 1333, 2000],
    ],
  },
]

// An album with no photos has no cover, so it's left out until you add some.
export const albums: Album[] = data
  .filter((album) => album.photos.length > 0)
  .map(({ slug, title, description, photos }) => {
    const list = photos.map(([file, alt, width = 800, height = 1000]) => ({
      id: `${slug}/${file}`,
      src: `/albums/${slug}/${file}`,
      alt,
      width,
      height,
    }))
    return { slug, title, description, photos: list, cover: list[0] }
  })

/** Photos in the first row (4 across on desktop) load right away; the rest lazily. */
export const EAGER_PHOTOS = 4

const ALBUM_PATH = '/album/'

/** The link to an album: '/album/weddings'. */
export function albumHref(slug: string): string {
  return `${ALBUM_PATH}${slug}`
}

/** '/album/weddings' (or '/album/weddings/') → the weddings album. Anything else → null (show the home page). */
export function albumFromPath(path: string): Album | null {
  if (!path.startsWith(ALBUM_PATH)) return null
  let slug
  try {
    slug = decodeURIComponent(path.slice(ALBUM_PATH.length).replace(/\/$/, ''))
  } catch {
    return null // a broken link like '/album/%': show the home page instead of crashing
  }
  return albums.find((album) => album.slug === slug) ?? null
}

/** 1 → '1 photo', 8 → '8 photos'. */
export function photoCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'photo' : 'photos'}`
}
