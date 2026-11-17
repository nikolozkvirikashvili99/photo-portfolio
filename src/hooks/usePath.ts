import { useEffect, useSyncExternalStore } from 'react'

// Clean URLs without a router library, and never a '#' in the address bar:
//   '/'                 the home page
//   '/album/weddings'   an album
//   '/work', '/about', '/contact'   section links: the home page, scrolled to that section
//                                   (the address bar then just says '/')
// Links stay ordinary <a href> (they work with JS off, open in a new tab, etc.);
// a left-click on one of these is caught and becomes a history.pushState, so the
// page never reloads. vercel.json sends every path to index.html, so a refresh works.

/** Section ids on the home page, each reachable at '/<id>': Gallery, Intro, Footer. */
const SECTIONS = ['work', 'about', 'contact']

/** Where to scroll once the next page has rendered: a section id, or 'top'. */
type ScrollTarget = string
let pendingScroll: ScrollTarget | undefined

const PATH_CHANGE = 'pathchange' // pushState fires no event, so we fire our own

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange) // browser Back / Forward
  window.addEventListener(PATH_CHANGE, onChange) // navigate() below
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(PATH_CHANGE, onChange)
  }
}

/**
 * The current path ('/album/weddings'), re-rendering when it changes.
 * useSyncExternalStore (not useState + useEffect) because the URL lives outside
 * React: React reads it during render, so the first render is never stale.
 */
export function usePath(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/')
}

/** Go to another path in the app, as a new history entry (Back returns here). */
export function navigate(path: string, scrollTo?: ScrollTarget) {
  pendingScroll = scrollTo
  window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(PATH_CHANGE))
}

/**
 * Where the page that just rendered should scroll, used once ('about', 'top').
 * undefined = no link asked for anything: browser Back / Forward, or a reload.
 */
export function takePendingScroll(): ScrollTarget | undefined {
  const target = pendingScroll
  pendingScroll = undefined
  return target
}

/** '/about' (or '/about/') → 'about'; any other path → undefined. */
function sectionOf(pathname: string): string | undefined {
  const id = pathname.replace(/^\/|\/$/g, '')
  return SECTIONS.includes(id) ? id : undefined
}

/**
 * Scroll a section into view and move keyboard focus there, so Tab continues
 * inside it (what a native '#about' jump used to do).
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1 // focusable by script only, not by Tab
  target.scrollIntoView()
  target.focus({ preventScroll: true })
}

function scrollTo(target: ScrollTarget) {
  if (target === 'top') window.scrollTo(0, 0)
  else scrollToSection(target)
}

/**
 * Makes the address bar clean before the first render, and when someone types an
 * old link while on the site:
 *   '/#album/weddings' (old shared link) → '/album/weddings'
 *   '/#about' or '/about'                → '/', scrolled to About
 *   '/#' (bare hash)                     → '/'
 */
export function cleanUpUrl() {
  const { hash, pathname, search, href } = window.location
  if (hash.startsWith('#album/')) {
    window.history.replaceState(null, '', `/album/${hash.slice('#album/'.length)}${search}`)
    return
  }
  const section = sectionOf(pathname) ?? (hash ? hash.slice(1) : undefined)
  if (section) {
    pendingScroll = section
    window.history.replaceState(null, '', (sectionOf(pathname) ? '/' : pathname) + search)
  } else if (href.endsWith('#')) {
    window.history.replaceState(null, '', pathname + search)
  }
}

/** Catches left-clicks on the site's own page links (see the top of this file). */
export function useLinkClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Ctrl/Cmd/Shift-click = new tab or window: leave it to the browser.
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest('a')
      if (!link || !link.hasAttribute('href') || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return // Instagram, mailto:, …

      // Only our pages; any other file (a photo, a PDF in public/) opens as normal.
      const section = sectionOf(url.pathname) ?? (url.hash.slice(1) || undefined)
      const path = sectionOf(url.pathname) ? '/' : url.pathname
      if (path !== '/' && !path.startsWith('/album/')) return

      event.preventDefault()
      const target = section ?? 'top'
      if (path !== window.location.pathname) navigate(path, target) // App scrolls after rendering
      else scrollTo(target) // same page: just scroll, the URL doesn't change
    }

    // An old '#' link typed or pasted while already on the site changes only the hash
    // (no page load, so main.tsx's cleanUpUrl doesn't run): clean it up here too.
    function onHashChange() {
      const before = window.location.pathname
      cleanUpUrl()
      if (window.location.pathname !== before) {
        window.dispatchEvent(new Event(PATH_CHANGE))
      } else {
        const target = takePendingScroll()
        if (target) scrollTo(target)
      }
    }

    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])
}
