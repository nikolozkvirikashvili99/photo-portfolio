import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { cleanUpUrl } from './hooks/usePath.ts'

cleanUpUrl() // '/about', old '/#album/…' and '/#about' links → clean URLs, before the first render

// index.html always has #root, so '!' tells TypeScript it can't be null.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
