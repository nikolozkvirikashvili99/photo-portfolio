// The albums, in display order. Each album's files live in public/albums/<slug>/.
// The FIRST photo of each album is its cover in the gallery.
//
// To use your own photos:
//   1. Copy your photos over public/albums/weddings/01.jpg, 02.jpg, … (same names).
//      Long side about 2000px keeps the page fast.
//   2. Write a real `alt` for each: what someone who can't see the photo should know.
//   3. More photos? Add 09.jpg and a line. New album? Add a folder + a block below.
//      `slug` is the folder name and the link (#album/weddings): lowercase, no spaces.
//   4. Landscape photo? Add its size: ['03.jpg', 'alt', 1000, 800].
//      Portrait 800×1000 is the default.
/** [file, alt, width?, height?]: one line per photo in the list below. */
type PhotoEntry = [file: string, alt: string, width?: number, height?: number]

interface AlbumEntry {
  slug: string
  title: string
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
  photos: Photo[]
  cover: Photo
}

const data: AlbumEntry[] = [
  {
    slug: 'weddings',
    title: 'Weddings',
    photos: [
      ['01.jpg', 'Weddings placeholder 1'],
      ['02.jpg', 'Weddings placeholder 2'],
      ['03.jpg', 'Weddings placeholder 3'],
      ['04.jpg', 'Weddings placeholder 4'],
      ['05.jpg', 'Weddings placeholder 5'],
      ['06.jpg', 'Weddings placeholder 6'],
      ['07.jpg', 'Weddings placeholder 7'],
      ['08.jpg', 'Weddings placeholder 8'],
    ],
  },
  {
    slug: 'portraits',
    title: 'Portraits',
    photos: [
      ['01.jpg', 'Portraits placeholder 1'],
      ['02.jpg', 'Portraits placeholder 2'],
      ['03.jpg', 'Portraits placeholder 3'],
      ['04.jpg', 'Portraits placeholder 4'],
      ['05.jpg', 'Portraits placeholder 5'],
      ['06.jpg', 'Portraits placeholder 6'],
    ],
  },
  {
    slug: 'couples',
    title: 'Couples',
    photos: [
      ['01.jpg', 'Couples placeholder 1'],
      ['02.jpg', 'Couples placeholder 2'],
      ['03.jpg', 'Couples placeholder 3'],
      ['04.jpg', 'Couples placeholder 4'],
    ],
  },
  {
    slug: 'family',
    title: 'Family',
    photos: [
      ['01.jpg', 'Family placeholder 1'],
      ['02.jpg', 'Family placeholder 2'],
      ['03.jpg', 'Family placeholder 3'],
      ['04.jpg', 'Family placeholder 4'],
      ['05.jpg', 'Family placeholder 5'],
    ],
  },
  {
    slug: 'everyday',
    title: 'Everyday moments',
    photos: [
      ['01.jpg', 'Everyday moments placeholder 1'],
      ['02.jpg', 'Everyday moments placeholder 2'],
      ['03.jpg', 'Everyday moments placeholder 3'],
      ['04.jpg', 'Everyday moments placeholder 4'],
      ['05.jpg', 'Everyday moments placeholder 5'],
      ['06.jpg', 'Everyday moments placeholder 6'],
      ['07.jpg', 'Everyday moments placeholder 7'],
    ],
  },
  {
    slug: 'nature',
    title: 'Nature',
    photos: [
      ['01.jpg', 'Nature placeholder 1'],
      ['02.jpg', 'Nature placeholder 2'],
      ['03.jpg', 'Nature placeholder 3'],
    ],
  },
]

// An album with no photos has no cover, so it's left out until you add some.
export const albums: Album[] = data
  .filter((album) => album.photos.length > 0)
  .map(({ slug, title, photos }) => {
    const list = photos.map(([file, alt, width = 800, height = 1000]) => ({
      id: `${slug}/${file}`,
      src: `/albums/${slug}/${file}`,
      alt,
      width,
      height,
    }))
    return { slug, title, photos: list, cover: list[0] }
  })

/** Photos in the first row (4 across on desktop) load right away; the rest lazily. */
export const EAGER_PHOTOS = 4

const ALBUM_HASH = '#album/'

/** The link to an album: '#album/weddings'. */
export function albumHref(slug: string): string {
  return `${ALBUM_HASH}${slug}`
}

/** '#album/weddings' → the weddings album. Anything else → null (show the gallery). */
export function albumFromHash(hash: string): Album | null {
  if (!hash.startsWith(ALBUM_HASH)) return null
  let slug
  try {
    slug = decodeURIComponent(hash.slice(ALBUM_HASH.length))
  } catch {
    return null // a broken link like '#album/%': show the gallery instead of crashing
  }
  return albums.find((album) => album.slug === slug) ?? null
}

/** 1 → '1 photo', 8 → '8 photos'. */
export function photoCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'photo' : 'photos'}`
}
