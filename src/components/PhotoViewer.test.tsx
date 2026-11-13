import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PhotoViewer from './PhotoViewer.tsx'
import type { Photo } from '../data/albums.ts'

const photos: Photo[] = [1, 2, 3].map((n) => ({
  id: `test/${n}`,
  src: `/test/${n}.jpg`,
  alt: `Test photo ${n}`,
  width: 800,
  height: 1000,
}))

function setup(index: number | null, list = photos) {
  const onClose = vi.fn()
  const onChange = vi.fn()
  const { container } = render(
    <PhotoViewer photos={list} index={index} onClose={onClose} onChange={onChange} />,
  )
  const dialog = container.querySelector('dialog')!
  return { dialog, onClose, onChange }
}

describe('PhotoViewer', () => {
  it('is closed when no photo is chosen', () => {
    const { dialog } = setup(null)
    expect(dialog).not.toHaveAttribute('open')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('opens full screen with the chosen photo', () => {
    const { dialog } = setup(1)
    expect(dialog).toHaveAttribute('open')
    expect(screen.getByRole('img', { name: 'Test photo 2' })).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('asks to close from the Close button and from a click on the dark area, not from the photo', () => {
    const { dialog, onClose } = setup(0)
    fireEvent.click(screen.getByRole('img'))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(dialog)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('asks for the next / previous photo with buttons and arrow keys, wrapping around', () => {
    const { dialog, onChange } = setup(2)
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(onChange).toHaveBeenLastCalledWith(0) // last → first
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('has no next / previous with only one photo', () => {
    setup(0, photos.slice(0, 1))
    expect(screen.queryByRole('button', { name: /next|previous/i })).toBeNull()
    expect(screen.queryByText('1 / 1')).toBeNull()
  })
})
