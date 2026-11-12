import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Vitest doesn't enable globals here, so RTL can't auto-clean between tests.
afterEach(() => cleanup())

// jsdom has no layout, so it doesn't implement scrolling. App calls these when
// switching between the gallery and an album.
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
