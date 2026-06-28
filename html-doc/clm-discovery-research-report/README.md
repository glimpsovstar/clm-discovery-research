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
2. What I researched
3. CLM lifecycle — 3 stages vs 9 detailed steps
4. SC-081 / the problem (equal timeline + impact panels)
5. Where Vault fits in the 9-step lifecycle
6. What's missing (the gap)
7. Blind-spot reveal (POV demo)
8. Wedge positioning
9. Release 1 commitment
10. Discovery scope boundaries
11. Cost of doing nothing (operational risk)
12. What I want to do
13. Summary / research conclusion

## Design

- Instrument Sans + IBM Plex Mono
- Dark full-viewport slides; content scales to window size (resize-aware)
- Progress bar + dot navigation

## Source material

- `../../doc/certificate-lifecycle-management-research-report.md`
- `../../doc/03-vault-gap-and-plugin.md`
- `../../doc/04-business-case.md`
