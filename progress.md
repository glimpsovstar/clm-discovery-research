# progress.md — CLM Discovery Research

## Goal / scope

Research artefacts for the Vault certificate-lifecycle-management (CLM) gap: what
CLM is, where Vault stops short, the "blind spot" POV, and the Release 1
discovery-plugin wedge. Published as a browsable HTML briefing deck plus the
written reports behind it.

This repo is **documents only** — no application code. The plugin itself lives in
the separate `CLM-discovery` repo.

## Done

- Research written up across eight markdown documents (`docs/*.md`).
- HTML briefing deck (13 slides, keyboard/swipe navigation) in `docs/index.html`.
- **Restructured for GitHub Pages** (commit `17fcd7d`): `doc/` and
  `html-doc/clm-discovery-research-report/` collapsed into a single `docs/`.
- **Published to two remotes**, both live on Pages.

## In progress

Nothing active.

## Next

- Optional: render the markdown on Pages. Today the deck's footer links to
  `*.md` files that Pages serves as raw `text/markdown`, so a browser shows
  plain text. Fixing it means either dropping `.nojekyll` and adding YAML front
  matter to each doc, or converting the docs to HTML.
- Optional: add a root `README.md`. There isn't one, so both repos' landing
  pages show only the file tree.
- `docs/assets/img/vault-mark.svg` is an orphan — nothing references it. Either
  use it (e.g. as a favicon) or delete it.

## Key context

### Two remotes, pushed independently

| Remote | Host | Repo | Visibility |
|--------|------|------|------------|
| `origin` | github.com | `glimpsovstar/clm-discovery-research` | public |
| `ibm` | github.ibm.com | `david-joo/clm-discovery-research` | private |

`main` tracks `origin/main`, so a bare `git push` goes to personal GitHub only.
**The IBM remote must be pushed explicitly:**

```bash
git push origin main && git push ibm main
```

Both remotes use SSH with separate keys, already wired in `~/.ssh/config`
(`github.ibm.com` → `~/.ssh/github-ibm-ed25519`). IBM's GHE runs a
`detect-secrets-stream` pre-receive hook that scans every push.

### GitHub Pages — why the folder is named `docs`

Pages' "deploy from a branch" mode accepts **only** `/` or `/docs` as its source
path. It is a fixed enum, not a free-form path, which is why `doc/` and
`html-doc/` could never work and the folder must keep the `s`.

Both sites are configured as branch `main`, path `/docs`:

- Personal (public): <https://glimpsovstar.github.io/clm-discovery-research/>
- IBM (behind w3id SSO): <https://pages.github.ibm.com/david-joo/clm-discovery-research/>

The IBM URL redirects to `login.w3.ibm.com` unless you are on an authenticated
IBM session — that is expected for a private GHE repo, not a broken deploy.

### Gotchas when moving files in `docs/`

- `docs/.nojekyll` disables the Jekyll build so every file is served verbatim.
  Without it, Jekyll would process the tree — and a stray `{{` or `{%` in any
  markdown would fail the build.
- `index.html` links to its sibling `*.md` files and to `assets/` with **flat
  relative paths**. Changing any file's depth breaks them. After moving
  anything, re-check every local `href`/`src` resolves.
- Pages must rebuild after a push; check with
  `gh api repos/<owner>/<repo>/pages/builds/latest --jq .status` (prefix
  `GH_HOST=github.ibm.com` for the IBM side).

### Editing the deck

`docs/index.html` is hand-written HTML with `docs/assets/css/style.css` and
`docs/assets/js/briefing.js`. No build step. Preview locally with:

```bash
python3 -m http.server 8080 --directory docs
# then http://localhost:8080
```
