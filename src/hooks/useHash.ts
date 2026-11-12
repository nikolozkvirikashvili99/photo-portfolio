import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

/**
 * The current URL hash ('#album/weddings'), re-rendering when it changes.
 * useSyncExternalStore (not useState + useEffect) because the hash lives outside
 * React: React reads it during render, so the first render is never stale.
 */
export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash, () => '')
}
