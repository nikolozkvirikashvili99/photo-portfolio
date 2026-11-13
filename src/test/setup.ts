import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Vitest doesn't enable globals here, so RTL can't auto-clean between tests.
afterEach(() => cleanup())

// jsdom has no layout, so it doesn't implement scrolling. App calls these when
// switching between the gallery and an album.
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

// jsdom has no <dialog> behaviour either (the photo viewer uses one): a minimal stand-in.
// Real browsers also close it on Esc and trap focus; those are checked in the browser, not here.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
