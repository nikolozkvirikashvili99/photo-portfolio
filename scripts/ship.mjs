// One-key publish (VS Code: Ctrl+Shift+B, or `npm run ship -- "what changed"`).
// Runs lint, tests and build; only if all pass does it commit and push.
// Vercel sees the push and puts it live on maiagabunia.com about 20 seconds later.
// `--dry-run`: run every check and show what would be published, without committing or pushing.
import { execFileSync, spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const message = args.filter((a) => a !== '--dry-run').join(' ').trim() || 'Update site'

// trimEnd, not trim: `git status --porcelain` lines start with a space that matters (" M file").
const git = (...gitArgs) => execFileSync('git', gitArgs, { encoding: 'utf8' }).trimEnd()

function stop(reason) {
  console.error(`\n✗ ${reason}\n  Nothing was published.`)
  process.exit(1)
}

function check(label, command) {
  console.log(`\n▶ ${label}…`)
  // shell: true so `npm`/`npx` resolve on Windows too.
  const result = spawnSync(command, { stdio: 'inherit', shell: true })
  if (result.status !== 0) stop(`${label} failed: fix the error above, save, and press the shortcut again.`)
  console.log(`✓ ${label}`)
}

// 1. Only from master: that's the branch Vercel publishes.
const branch = git('branch', '--show-current')
if (branch !== 'master') stop(`You're on branch "${branch}"; the live site publishes from "master".`)

// 2. Anything to publish? (saved changes, or commits not pushed yet)
const changed = git('status', '--porcelain')
const unpushed = Number(git('rev-list', '--count', '@{u}..HEAD'))
if (!changed && unpushed === 0) {
  console.log('Nothing to publish: the live site already has everything you saved.')
  process.exit(0)
}

// 3. Never publish secrets (.env files hold passwords and keys).
const files = changed ? changed.split('\n').map((line) => line.slice(3)) : []
const secret = files.find((f) => /(^|\/)\.env/.test(f))
if (secret) stop(`"${secret}" looks like a secrets file. Add it to .gitignore first.`)

// 4. The same checks as "Done means" in CLAUDE.md.
check('Lint', 'npm run lint')
check('Tests', 'npx vitest run')
check('Build', 'npm run build')

if (files.length) console.log(`\nFiles to publish:\n${files.map((f) => `  ${f}`).join('\n')}`)

if (dryRun) {
  console.log(`\n✓ Dry run: all checks pass. Would commit "${message}" and push. Nothing was published.`)
  process.exit(0)
}

// 5. Commit (if there are saved changes) and push.
if (changed) {
  git('add', '-A')
  git('commit', '-m', message)
  console.log(`\n✓ Committed: ${message}`)
}
const push = spawnSync('git', ['push'], { stdio: 'inherit' })
if (push.status !== 0) stop('git push failed (see above). Your commit is saved locally; press the shortcut again to retry.')

console.log('\n✓ Pushed. Live on https://www.maiagabunia.com in about 20 seconds (Ctrl+F5 to refresh).')
