// Publish on save: watches src/, public/ and index.html. A moment after you save (Ctrl+S),
// it runs scripts/ship.mjs: lint + tests + build, and only if all pass, commit + push.
// Live on maiagabunia.com about 35-40 s after the save (checks ~15 s, then Vercel ~20 s).
// Starts by itself when the folder opens in VS Code (.vscode/tasks.json). Stop it: trash-can icon on its terminal.
// `--dry-run`: run the checks on save but never commit or push.
import { watch } from 'node:fs'
import { spawn } from 'node:child_process'

const dryRun = process.argv.includes('--dry-run')
const WAIT_MS = 2000 // several quick saves in a row = one publish

const changed = new Set()
let timer = null
let running = false
let again = false

function onChange(path) {
  if (!path) return
  changed.add(path.replaceAll('\\', '/'))
  clearTimeout(timer)
  timer = setTimeout(publish, WAIT_MS)
}

function publish() {
  // A publish is already running: do one more right after it, with everything saved meanwhile.
  if (running) {
    again = true
    return
  }
  running = true
  const files = [...changed]
  changed.clear()
  const message = `Update ${files.slice(0, 3).join(', ')}${files.length > 3 ? ` and ${files.length - 3} more` : ''}`
  console.log(`\n=== Saved: ${files.join(', ')} (${new Date().toLocaleTimeString()}) ===`)
  const args = ['scripts/ship.mjs', message]
  if (dryRun) args.push('--dry-run')
  spawn(process.execPath, args, { stdio: 'inherit' }).on('exit', () => {
    running = false
    console.log('\nWatching for your next save…')
    if (again) {
      again = false
      publish()
    }
  })
}

for (const dir of ['src', 'public']) {
  watch(dir, { recursive: true }, (_event, file) => onChange(file && `${dir}/${file}`))
}
watch('index.html', () => onChange('index.html'))

console.log(`Publish on save is ON${dryRun ? ' (dry run: checks only, nothing is pushed)' : ''}.`)
console.log('Save a file (Ctrl+S): checks run, and if they pass the change goes live in ~35-40 s.')
console.log('Watching src/, public/ and index.html…')
