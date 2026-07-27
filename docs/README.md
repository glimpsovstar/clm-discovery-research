# CLM Discovery — HTML research briefing

Full-page presentation deck summarising the research: what was studied, what Vault is missing, and the Release 1 CLM-discovery plugin wedge.

## Open locally

```bash
open index.html
# or
python3 -m http.server 8080 --directory .
# then visit http://localhost:8080
```

## Controls

| Key | Action |
|-----|--------|
| `→` `↓` `D` `S` `Space` | Next slide |
| `←` `↑` `W` `A` | Previous slide |
| `Home` / `End` | First / last slide |
| `1`–`9` | Jump to slide |
| `F` | Full page / browser fullscreen |
| `?` | Help overlay |
| `Esc` | Exit fullscreen / close help |

Swipe left/right on touch devices.

## Slides

1. Title
2. What's been researched
3. CLM lifecycle — 3 stages vs 9 detailed steps
4. SC-081 / the problem (equal timeline + impact panels)
5. Where Vault fits in the 9-step lifecycle
6. What's missing (the gap)
7. Blind-spot reveal (POV demo)
8. Wedge positioning
9. Release 1 commitment
10. Discovery scope boundaries
11. Cost of doing nothing (operational risk)
12. Proposed next steps
13. Summary / research conclusion

## Design

- Instrument Sans + IBM Plex Mono
- Dark full-viewport slides; content scales to window size (resize-aware)
- Progress bar + dot navigation

## Source material

- [`certificate-lifecycle-management-research-report.md`](./certificate-lifecycle-management-research-report.md)
- [`03-vault-gap-and-plugin.md`](./03-vault-gap-and-plugin.md)
- [`04-business-case.md`](./04-business-case.md)

## Everything in this folder

This directory is the GitHub Pages publish root (`main` branch, `/docs` path), so
the deck and the written research live side by side.

| File | What it is |
|------|------------|
| `index.html` | The briefing deck (this document's subject) |
| `01-executive-brief.md` | Executive summary |
| `02-clm-reference.md` | CLM lifecycle reference |
| `03-vault-gap-and-plugin.md` | Vault gap analysis + plugin spec |
| `04-business-case.md` | Business case |
| `certificate-lifecycle-management-research-report.md` | Full research report |
| `certs-management-for-dummies.md` | PKI primer |
| `sources.md` | Citations |
| `CHANGELOG.md` | Research changelog |
| `assets/` | Deck CSS, JS, images |
| `.nojekyll` | Disables Jekyll so files are served verbatim |
