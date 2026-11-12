/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // One worker: on this 8 GB machine, several jsdom workers ran out of memory and
    // crashed on startup (exit code 134). The suite is small, so one is just as fast.
    maxWorkers: 1,
    // Each test file runs in its own clean VM context inside one long-lived worker,
    // instead of restarting the worker per file: 60s → 13s on this machine.
    // If a test ever fails only here (e.g. `instanceof Error` on a Node error), try 'threads'.
    pool: 'vmThreads',
  },
})
