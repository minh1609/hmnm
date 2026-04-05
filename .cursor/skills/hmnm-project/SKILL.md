---
name: hmnm-project
description: Domain knowledge and conventions for the hmnm dating progress app — a Ferrari F1 themed React/MUI app that tracks a couple's relationship milestones. Use when working on this project, adding new timeline events, creating components, updating the theme, or editing any file under src/.
---

# hmnm — Ferrari F1 Dating Progress App

A personal React app that tracks and displays a couple's relationship milestones with a dark Ferrari F1 aesthetic.

## Project structure

```
src/
├── App.tsx              # Root UI: year selector + MUI Timeline
├── main.tsx             # Entry: ThemeProvider + CssBaseline wrapper
├── data.ts              # All timeline data (source of truth)
├── theme.ts             # ferrariTokens + MUI theme
├── utils.tsx            # getSeason() → SeasonInfo (icon + colors)
├── App.css              # Slide/enter animations (CSS classes)
├── index.css            # Global reset + CSS custom properties
└── components/
    ├── JourneyCounter.tsx   # Live stat cards (days, hours, minutes, trips)
    └── HeartDivider.tsx     # Decorative ♥ divider between red lines
```

## Stack

- **React 19** + **TypeScript 5.9** (strict)
- **Vite 8** with `@rolldown/plugin-babel` + `babel-plugin-react-compiler`
- **MUI v7** (`@mui/material`, `@mui/lab`, `@mui/icons-material`) + Emotion
- Path alias: `@/` → `src/`

## Design tokens — `ferrariTokens` (`src/theme.ts`)

Single source of truth. Always import from `@/theme`, never hardcode hex values.

```ts
ferrariTokens.colors.red; // #DC0000  — primary brand
ferrariTokens.colors.redBright; // #FF2800
ferrariTokens.colors.redDeep; // #8B0000
ferrariTokens.colors.redGlow; // rgba(220,0,0,0.35)
ferrariTokens.colors.gold; // #C8A84B  — accent/trim
ferrariTokens.colors.goldLight; // #E8D070
ferrariTokens.colors.goldGlow; // rgba(200,168,75,0.3)
ferrariTokens.colors.black; // #0D0D0D  — page background
ferrariTokens.colors.surface; // #1A1A1A  — card/paper bg
ferrariTokens.colors.panel; // #242424
ferrariTokens.colors.border; // #2E2E2E
```

**Fonts** (all loaded via Google Fonts in `index.html`):

| Token           | Font             | Use                                 |
| --------------- | ---------------- | ----------------------------------- |
| `fonts.sans`    | Titillium Web    | Body / UI text                      |
| `fonts.display` | Barlow Condensed | Racing display / numbers / headings |
| `fonts.script`  | Great Vibes      | Romantic captions / section titles  |
| `fonts.mono`    | system mono      | Code                                |

## Adding timeline events (`src/data.ts`)

```ts
export interface TimelineEvent {
    date: Date; // Use new Date('YYYY-MM-DDTHH:mm:ss')
    name: string; // Event title — shown in UPPERCASE via CSS
    des?: string; // Optional subtitle / description
}

export interface TimelineYear {
    description: string; // Shown in Great Vibes script above the timeline
    events: TimelineEvent[];
}
```

Events are keyed by year in `datingTimeline: Record<number, TimelineYear>`.  
Years are derived dynamically — just add a new key to include a new year tab.

## JourneyCounter (`src/components/JourneyCounter.tsx`)

- `FIRST_DATE` constant: `new Date('2025-08-26T00:00:00')` — update if start date changes.
- `TRIPS_TAKEN` constant: manually incremented integer.
- Refreshes every **30 seconds** via `setInterval`.
- `StatCard` props: `value`, `label`, `live` (shows pulsing red dot), `sx`.

## Animations (`src/App.css`)

| CSS class              | Effect                                    |
| ---------------------- | ----------------------------------------- |
| `timeline-slide-left`  | Slide in from right when advancing year   |
| `timeline-slide-right` | Slide in from left when going back        |
| `year-desc-enter`      | Fade + slide up for year description text |

Retrigger without remount: remove class → force reflow (`offsetHeight`) → re-add class.

## Season chips (`src/utils.tsx`)

`getSeason(date)` returns `{ icon, color, bgColor }` based on month:

| Months | Season | Color            |
| ------ | ------ | ---------------- |
| 3–5    | Spring | Purple `#a855f7` |
| 6–8    | Summer | Amber `#f59e0b`  |
| 9–11   | Autumn | Orange `#ea580c` |
| 12–2   | Winter | Blue `#3b82f6`   |

## Conventions

- Use `ferrariTokens` directly in `sx` props for one-off colors not available via `theme.palette.*`.
- MUI theme is dark mode; `primary` = red, `secondary` = gold.
- Typography variants `h1`/`h2`/`h3` use `fonts.display` (Barlow Condensed), auto-uppercase.
- Use `variant="caption"` for small label text — it uses `fonts.display` with wide letter-spacing.
- `StatCard` border pattern: `borderTop: 3px solid red`, bottom gold gradient line via `::after`.
- Keep `@/` alias (not relative imports) for all `src/` imports.

## Dev commands

```bash
npm run dev      # Start Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```
