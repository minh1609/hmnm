---
name: hmnm-project
description: Domain knowledge and conventions for the hmnm dating progress app — a Ferrari F1 themed React/MUI app that tracks a couple's relationship milestones. Use when working on this project, adding new timeline events, creating components, updating the theme, or editing any file under src/.
---

# hmnm — Ferrari F1 Dating Progress App

A personal React app that tracks and displays a couple's relationship milestones with a dark Ferrari F1 aesthetic.

## Project structure

```
src/
├── App.tsx              # Router: wraps Routes with page transition animation class
├── main.tsx             # Entry: BrowserRouter + ThemeProvider + CssBaseline
├── data.ts              # All timeline + trips data (source of truth)
├── theme.ts             # ferrariTokens + MUI theme
├── utils.tsx            # getSeason() → SeasonInfo (icon + colors)
├── App.css              # Slide/enter/fade animations (CSS classes)
├── index.css            # Global reset + CSS custom properties + fallingDrift keyframe
├── pages/
│   ├── HomePage.tsx     # Main timeline page: year selector, MUI Timeline, swipe nav
│   └── TripsPage.tsx    # Trips page: trip cards with destinations + highlights
└── components/
    ├── FallingObjects.tsx   # Ambient particle system — falling images + emoji icons
    ├── JourneyCounter.tsx   # Live stat cards (days, hours today, minutes past, trips)
    ├── FerrariTooltip.tsx   # Styled MUI Tooltip (Ferrari dark theme)
    ├── IconBurst.tsx        # Emoji particle burst effect (portal into document.body)
    └── HeartDivider.tsx     # Decorative ♥ divider (currently unused)

public/
└── particles/           # Transparent PNGs used by FallingObjects (pen.png, fer.png)
```

## Stack

- **React 19** + **TypeScript 5.9** (strict)
- **Vite 8** with `@rolldown/plugin-babel` + `babel-plugin-react-compiler`
- **MUI v7** (`@mui/material`, `@mui/lab`, `@mui/icons-material`) + Emotion
- **React Router v7** (`react-router-dom`) — routes: `/` (HomePage), `/trips` (TripsPage)
- Path alias: `@/` → `src/`

## Routing (`src/App.tsx`)

`App.tsx` applies a page transition CSS class based on navigation direction, then renders `<Routes>`. Route ordering:

```ts
const routeOrder: Record<string, number> = { '/': 0, '/trips': 1 };
```

Animation classes applied to the wrapping `<div key={location.key}>`:

| Class                  | Trigger                                      |
| ---------------------- | -------------------------------------------- |
| `page-enter-fade`      | Default / initial load (currently always)    |
| `page-enter-forward`   | Navigating to higher-order route (commented) |
| `page-enter-backward`  | Navigating to lower-order route (commented)  |

## Design tokens — `ferrariTokens` (`src/theme.ts`)

Single source of truth. Always import from `@/theme`, never hardcode hex values.

```ts
// Brand reds
ferrariTokens.colors.red; // #DC0000  — primary brand
ferrariTokens.colors.redBright; // #FF2800
ferrariTokens.colors.redDeep; // #8B0000
ferrariTokens.colors.redDark; // #5A0000
ferrariTokens.colors.redGlow; // rgba(220,0,0,0.35)
ferrariTokens.colors.redGlowFaint; // rgba(220,0,0,0.12)

// Accent / trim
ferrariTokens.colors.gold; // #C8A84B
ferrariTokens.colors.goldLight; // #E8D070
ferrariTokens.colors.goldGlow; // rgba(200,168,75,0.3)

// Backgrounds
ferrariTokens.colors.black; // #0D0D0D  — page background
ferrariTokens.colors.carbon; // #141414
ferrariTokens.colors.surface; // #1A1A1A  — card/paper bg
ferrariTokens.colors.panel; // #242424

// Borders / dividers
ferrariTokens.colors.border; // #2E2E2E
ferrariTokens.colors.borderSubtle; // #1E1E1E

// Text
ferrariTokens.colors.white; // #FFFFFF
ferrariTokens.colors.muted; // #999999
ferrariTokens.colors.subtle; // #555555
```

**MUI palette** (theme.ts):

| Palette key          | Maps to          |
| -------------------- | ---------------- |
| `primary`            | gold (`#C8A84B`) |
| `secondary`          | red (`#DC0000`)  |
| `background.default` | `c.red`          |
| `background.paper`   | `c.redDeep`      |

> Note: `primary` is **gold**, not red. `secondary` is red. This is intentional.

**Fonts** (all loaded via Google Fonts in `index.html`):

| Token           | Font             | Use                                 |
| --------------- | ---------------- | ----------------------------------- |
| `fonts.sans`    | Titillium Web    | Body / UI text                      |
| `fonts.display` | Barlow Condensed | Racing display / numbers / headings |
| `fonts.script`  | Great Vibes      | Romantic captions / section titles  |
| `fonts.mono`    | system mono      | Code                                |

## Data model (`src/data.ts`)

### Timeline events

```ts
export interface TimelineEvent {
    date: Date;        // Use new Date('YYYY-MM-DDTHH:mm:ss')
    name: string;      // Event title — shown in UPPERCASE via CSS
    des?: string | string[];  // Optional detail(s) shown in FerrariTooltip via LightbulbIcon
    burstIcon?: string;       // Optional emoji — clicking the date Chip triggers IconBurst
}

export interface TimelineYear {
    description: string;  // Shown above the timeline (Barlow Condensed, uppercase)
    events: TimelineEvent[];
}
```

Events are keyed by year in `datingTimeline: Record<number, TimelineYear>`.  
Years are derived dynamically — just add a new key to include a new year tab.

### Trips

```ts
export interface TripDestination {
    name: string;
    googleMapLink?: string;  // If present, destination renders as clickable link
}

export interface Trip {
    name: string;
    flag: string;         // Country flag emoji
    startDate: Date;
    endDate: Date;
    highlights: string[]; // Bullet points shown in card body
    destinations: TripDestination[];
}

export const trips: Trip[];
```

To add a new trip: append an object to the `trips` array in `data.ts`.  
`TRIPS_TAKEN` in `JourneyCounter.tsx` must also be manually incremented to match `trips.length`.

## Pages

### `HomePage` (`src/pages/HomePage.tsx`)

- Year selector tabs at top with gold underline on active year.
- Swipe gesture (touch) support: swipe right → previous year, swipe left → next year.  
  At boundaries, a MUI Snackbar shows a custom message.
- MUI `<Timeline position="alternate">` with season-colored date `Chip`s.
- Clicking a `Chip` with `burstIcon` triggers `IconBurst` at click coordinates.
- Event name shows a `LightbulbIcon` if `event.des` is set; hover/tap opens `FerrariTooltip`.
- `FallingObjects` rendered as ambient background.

### `TripsPage` (`src/pages/TripsPage.tsx`)

- Sticky header with back button (navigates to `/`), title, and trip count.
- Trip cards styled with gold border-top and gradient pattern (same `StatCard` card pattern).
- Each card shows: flag + name, destinations (linked if `googleMapLink` set), date range, duration badge, highlights list.
- Empty state: shows "More adventures to come ✈️" in Great Vibes script font.

## Components

### `FallingObjects` (`src/components/FallingObjects.tsx`)

Ambient particle effect rendered via `createPortal` into `document.body` (fixed, z-index 0, pointer-events none).

- **Images**: transparent PNGs from `public/particles/`. Add a filename to `IMAGE_FILES` to include it.
- **Icons**: emoji/symbols defined in the `ICONS` array as `{ symbol, color }`. Emojis ignore `color`.
- Pool: `IMAGE_COUNT = 12` images + `ICON_COUNT = 13` icons, computed once at module load.
- Each particle has randomized `left`, `size`, `duration`, `delay`, `opacity`, and `drift`.
- Animation: `fallingDrift` keyframe defined in `index.css` using `--drift` CSS variable.

To add new falling images: drop a PNG into `public/particles/` and add its filename to `IMAGE_FILES`.  
To add new falling icons/emoji: append to the `ICONS` array in `FallingObjects.tsx`.

### `JourneyCounter` (`src/components/JourneyCounter.tsx`)

- `FIRST_DATE` constant: `new Date('2025-08-26T00:00:00')` — update if start date changes.
- `TRIPS_TAKEN` constant: manually incremented integer — keep in sync with `trips.length` in `data.ts`.
- `getCounterValues()` returns `{ days, hoursToday, minutesPast }`.
- Refreshes every **30 seconds** via `setInterval`.
- `StatCard` props: `value`, `label`, `live` (pulsing gold dot), `onClick`, `sx`.
- "Trips Taken" card is clickable and navigates to `/trips`.
- Card pattern: `borderTop: 3px solid gold`, `::before` top shimmer, `::after` bottom gold gradient line, hover lifts with gold glow.

### `FerrariTooltip` (`src/components/FerrariTooltip.tsx`)

A styled MUI `Tooltip` with Ferrari dark theme: `surface` background, white text, `border` outline, red glow shadow. Touch-friendly (`enterTouchDelay={0}`, `leaveTouchDelay={4000}`). Used in `HomePage` to show `event.des` details on the `LightbulbIcon`.

### `IconBurst` (`src/components/IconBurst.tsx`)

Renders 18 emoji particles via `createPortal` that burst outward from `(x, y)` coordinates. Uses CSS class `burst-particle` with `--bx`/`--by` CSS variables for direction. Auto-calls `onDone` after 1500ms. Triggered from `HomePage` when clicking a date Chip that has `burstIcon`.

## Animations (`src/App.css`)

| CSS class              | Effect                                        |
| ---------------------- | --------------------------------------------- |
| `timeline-slide-left`  | Slide in from right when advancing year       |
| `timeline-slide-right` | Slide in from left when going back            |
| `year-desc-enter`      | Fade + slide up for year description text     |
| `page-enter-fade`      | Fade in for page transitions (always active)  |
| `page-enter-forward`   | Slide in from right for forward navigation    |
| `page-enter-backward`  | Slide in from left for backward navigation    |
| `burst-particle`       | Outward burst animation using `--bx`/`--by`   |

Retrigger without remount: remove class → force reflow (`offsetHeight`) → re-add class.

## Season chips (`src/utils.tsx`)

`getSeason(date)` returns `{ icon, color, bgColor }` based on month:

| Months | Season | Color            |
| ------ | ------ | ---------------- |
| 3–5    | Spring | Purple `#a855f7` |
| 6–8    | Summer | Amber `#f59e0b`  |
| 9–10   | Autumn | Orange `#ea580c` |
| 11–2   | Winter | Blue `#3b82f6`   |

## Conventions

- Use `ferrariTokens` directly in `sx` props for one-off colors not available via `theme.palette.*`.
- MUI theme is dark mode; `primary` = gold, `secondary` = red.
- Typography variants `h1`/`h2`/`h3` use `fonts.display` (Barlow Condensed), auto-uppercase.
- Use `variant="caption"` for small label text — it uses `fonts.display` with wide letter-spacing.
- Card pattern: `borderTop: 3px solid gold`, `::before` top shimmer line, `::after` bottom gold gradient line, hover lifts with `goldGlow` shadow.
- Keep `@/` alias (not relative imports) for all `src/` imports.
- `des` field supports both `string` and `string[]` — always handle both cases.
- `burstIcon` on a `TimelineEvent` makes the date Chip interactive and fires `IconBurst` on click.

## Dev commands

```bash
npm run dev      # Start Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```
