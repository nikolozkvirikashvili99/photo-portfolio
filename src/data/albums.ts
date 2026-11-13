// The albums, in display order. Each album's files live in public/albums/<slug>/.
// The FIRST photo of each album is its cover in the gallery.
//
// To add a photo to an album:
//   1. Put it in the album's folder with the next number: public/albums/weddings/02.jpg, 03.jpg, …
//      Long side about 2000px keeps the page fast (phone originals are 4000-6000px: shrink them).
//   2. Add a line under that album's photos: ['02.jpg', 'what the photo shows', width, height].
//      The alt text is what someone who can't see the photo should know.
//   3. New album? Add a folder + a block below. `slug` is the folder name and the link
//      (#album/weddings): lowercase, no spaces.
//   width/height are the file's pixel size (they stop the page jumping while photos load);
//   left out, 800×1000 (portrait) is assumed.
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
    slug: 'fashion',
    title: 'Fashion',
    photos: [
      ['01.jpg', 'Model backstage in a black lace jumpsuit and laced leather corset, arms raised as dark fabric swirls around her', 1333, 2000],
    ],
  },
  {
    slug: 'brands',
    title: 'Brands',
    photos: [
      ['01.jpg', 'Model seen from behind in a white sequined open-back dress with a chain of crystal flowers down the spine', 1333, 2000],
    ],
  },
  {
    slug: 'weddings',
    title: 'Weddings',
    photos: [
      ['01.jpg', 'Bride in a satin gown with a long train smiling up at the camera as the groom holds her hand, seen from above', 1500, 2000],
    ],
  },
  {
    slug: 'portraits',
    title: 'Portraits',
    photos: [
      ['01.jpg', 'Black-and-white portrait of a woman leaning against a wall by a window', 1333, 2000],
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
