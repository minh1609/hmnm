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
├── config.ts            # Central config: activeProfile, fallingObjects, iconBurst settings
├── firebase.ts          # Firebase init — exports app, analytics, db (Firestore)
├── types.ts             # Shared TypeScript interfaces (ImageFile, Icon, Trip, TimelineEvent, …)
├── theme.ts             # ferrariTokens + MUI theme
├── utils.tsx            # getSeason() → SeasonInfo (icon + colors)
├── App.css              # Slide/enter/fade animations (CSS classes)
├── index.css            # Global reset + CSS custom properties + fallingDrift keyframe
├── hooks/
│   ├── useTimeline.ts   # Firestore-backed timeline hook; falls back to static data
│   └── useTrips.ts      # Firestore-backed trips hook; falls back to static data
├── data/
│   ├── index.ts         # Re-exports from the active profile (driven by config.activeProfile)
│   └── mindy/           # Profile folder — currently the only / active profile
│       ├── index.ts     # Barrel: re-exports timelineEvents, yearDescriptions, trips, IMAGE_FILES, ICONS
│       ├── events.ts    # timelineEvents (TimelineEvent[]) + yearDescriptions (Record<number, string>)
│       ├── trips.ts     # trips array (Trip[])
│       └── objects.ts   # IMAGE_FILES (ImageFile[]) + ICONS (Icon[])
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
- **Firebase** (`firebase/app`, `firebase/firestore`, `firebase/analytics`) — Firestore as live data source
- Path alias: `@/` → `src/`

## Firebase (`src/firebase.ts`)

Initialises Firebase and exports three values used throughout the app:

```ts
export const app;       // FirebaseApp
export const analytics; // Analytics
export const db;        // Firestore instance — import wherever Firestore is needed
```

Project ID: `pet1609-cf0d7`. Import `db` from `@/firebase`.

## Hooks (`src/hooks/`)

Both hooks follow the same pattern: initialise state with static fallback data, fire a one-shot Firestore query on mount, and update state only if the collection returns documents. Errors are swallowed silently so the static data always shows.

### `useTimeline` (`src/hooks/useTimeline.ts`)

```ts
export function useTimeline(): Record<number, TimelineYear>
```

- Queries `timeline_events` collection: `where('owner', '==', 'mindy')`, `orderBy('date', 'asc')`.
- Converts Firestore `Timestamp` fields to `Date` via local `toDate()`.
- Groups the flat event list into `Record<number, TimelineYear>` using `groupByYear(events, staticYearDescriptions)`.
- Falls back to the static `timelineEvents` + `yearDescriptions` from `@/data` if collection is empty or unreachable.

### `useTrips` (`src/hooks/useTrips.ts`)

```ts
export function useTrips(): Trip[]
```

- Queries `trips` collection: `where('owner', '==', 'mindy')`, `orderBy('startDate', 'asc')`.
- Converts Firestore `Timestamp` fields (`startDate`, `endDate`) to `Date` via local `toDate()`.
- Falls back to the static `trips` array from `@/data` if collection is empty or unreachable.

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

## Config (`src/config.ts`)

Central runtime configuration. Three exports:

### `activeProfile`

```ts
export const activeProfile = 'mindy' as const;
export type DataProfile = typeof activeProfile;
```

Determines which folder under `src/data/` is the active data source. The profile folder must export `datingTimeline`, `trips`, `IMAGE_FILES`, and `ICONS`.

### `fallingObjects`

All tunable parameters for the `FallingObjects` ambient particle system:

```ts
fallingObjects.imageCount      // number of image particles
fallingObjects.iconCount       // number of emoji/icon particles
fallingObjects.particle.leftMin / leftMax     // horizontal spread (% of viewport)
fallingObjects.particle.sizeMin / sizeMax     // particle size in px
fallingObjects.particle.durationMin / durationMax  // fall duration in seconds
fallingObjects.particle.delayMin / delayMax   // stagger delay in seconds (≤ 0)
fallingObjects.particle.opacityMin / opacityMax    // idle translucency
fallingObjects.particle.driftMin / driftMax   // horizontal sway in px
```

### `iconBurst`

All tunable parameters for the `IconBurst` click effect:

```ts
iconBurst.count          // number of emoji particles per burst
iconBurst.durationMs     // how long the burst stays on screen (ms); matches CSS animation
iconBurst.angleJitter    // random angle spread per particle (radians)
iconBurst.distanceMin    // minimum travel distance from origin (px)
iconBurst.distanceExtra  // extra random distance on top of min (px)
iconBurst.maxDelay       // max per-particle stagger delay (seconds)
iconBurst.sizeBase       // base emoji font-size (rem)
iconBurst.sizeExtra      // max extra font-size added randomly (rem)
```

## Types (`src/types.ts`)

All shared interfaces live here. Import from `@/types`.

```ts
export interface ImageFile {
    file: string;   // filename inside public/particles/
    label: string;  // shown in FerrariTooltip on hover
}

export interface Icon {
    symbol: string; // emoji or text symbol
    color: string;  // CSS color (ignored for emojis, which render in their own colors)
    label: string;  // shown in FerrariTooltip on hover
}

export interface TimelineEvent {
    date: Date;              // Use new Date('YYYY-MM-DDTHH:mm:ss')
    name: string;            // Event title — shown in UPPERCASE via CSS
    des?: string | string[]; // Optional detail(s) shown in FerrariTooltip via LightbulbIcon
    burstIcon?: string;      // Optional emoji — clicking the date Chip triggers IconBurst
    owner: string;           // Firestore filter key (e.g. 'mindy')
}

export interface TimelineYear {
    description: string;  // Shown above the timeline (Barlow Condensed, uppercase)
    events: TimelineEvent[];
}

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
    owner: string;        // Firestore filter key (e.g. 'mindy')
}
```

## Data layer (`src/data/`)

### Profile system

`src/data/index.ts` imports all profiles and re-exports the one matching `activeProfile`:

```ts
import { activeProfile } from '@/config';
import * as mindy from '@/data/mindy';

const profiles = { mindy } satisfies Record<string, typeof mindy>;
export const { timelineEvents, yearDescriptions, trips, IMAGE_FILES, ICONS } = profiles[activeProfile];
```

To add a new profile: create a folder `src/data/<name>/` with an `index.ts` that exports the five required values, add the import to `src/data/index.ts`, and set `activeProfile` in `config.ts`.

### Profile folder layout (`src/data/mindy/`)

| File         | Export               | Type                            |
| ------------ | -------------------- | ------------------------------- |
| `events.ts`  | `timelineEvents`     | `TimelineEvent[]`               |
|              | `yearDescriptions`   | `Record<number, string>`        |
| `trips.ts`   | `trips`              | `Trip[]`                        |
| `objects.ts` | `IMAGE_FILES`        | `ImageFile[]`                   |
|              | `ICONS`              | `Icon[]`                        |

### Timeline events (`events.ts`)

Events are a **flat array** `timelineEvents: TimelineEvent[]` sorted by date.  
Year descriptions are a separate `yearDescriptions: Record<number, string>` map keyed by year.  
The `useTimeline` hook groups events by year at runtime using `groupByYear(events, yearDescriptions)`.  
Each event must include `owner: 'mindy'` to match the Firestore query filter.

### Trips (`trips.ts`)

To add a new trip: append a `Trip` object (including `owner: 'mindy'`) to the `trips` array.  
`TRIPS_TAKEN` in `JourneyCounter.tsx` is `trips.length` — it updates automatically; **no manual increment needed**.

### Falling objects (`objects.ts`)

```ts
export const IMAGE_FILES: ImageFile[] = [
    { file: 'pen.png', label: 'Favourite animal' },
    { file: 'fer.png', label: 'Charles Leclerc - 16' },
];

export const ICONS: Icon[] = [
    { symbol: '🍉', color: 'inherit', label: 'Description shown on hover' },
    // ...
];
```

To add new falling images: drop a PNG into `public/particles/` and add `{ file, label }` to `IMAGE_FILES`.  
To add new falling icons/emoji: append `{ symbol, color, label }` to `ICONS`.

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

Ambient particle effect rendered via `createPortal` into `document.body` (fixed, z-index 9999, pointer-events auto on particles).

- **Images**: `ImageFile[]` from the active profile's `objects.ts`. Each has `file` (PNG filename) and `label` (tooltip text).
- **Icons**: `Icon[]` from the active profile's `objects.ts`. Each has `symbol`, `color`, and `label`.
- Particle counts and all physics params come from `fallingObjects` in `@/config`.
- Hovering a particle pauses its animation and shows full opacity + a `FerrariTooltip` with its `label`.
- Animation: `fallingDrift` keyframe defined in `index.css` using `--drift` CSS variable.

### `JourneyCounter` (`src/components/JourneyCounter.tsx`)

- `FIRST_DATE` constant: `new Date('2025-08-26T00:00:00')` — update if start date changes.
- `TRIPS_TAKEN = trips.length` — automatically stays in sync with the trips array; no manual update needed.
- `getCounterValues()` returns `{ days, hoursToday, minutesPast }`.
- Refreshes every **30 seconds** via `setInterval`.
- `StatCard` props: `value`, `label`, `live` (pulsing gold dot), `onClick`, `sx`.
- "Trips Taken" card is clickable and navigates to `/trips`.
- Card pattern: `borderTop: 3px solid gold`, `::before` top shimmer, `::after` bottom gold gradient line, hover lifts with gold glow.

### `FerrariTooltip` (`src/components/FerrariTooltip.tsx`)

A styled MUI `Tooltip` with Ferrari dark theme: `surface` background, white text, `border` outline, red glow shadow. Touch-friendly (`enterTouchDelay={0}`, `leaveTouchDelay={4000}`). Used in `HomePage` to show `event.des` details on the `LightbulbIcon`, and in `FallingObjects` to show particle labels.

### `IconBurst` (`src/components/IconBurst.tsx`)

Renders emoji particles via `createPortal` that burst outward from `(x, y)` coordinates. All burst parameters (count, duration, distances, sizes) come from `iconBurst` in `@/config`. Uses CSS class `burst-particle` with `--bx`/`--by` CSS variables for direction. Auto-calls `onDone` after `iconBurst.durationMs`. Triggered from `HomePage` when clicking a date Chip that has `burstIcon`.

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
- All shared interfaces go in `src/types.ts`; import from `@/types`.
- All tunable constants (counts, sizes, timings) go in `src/config.ts`; never hardcode magic numbers in components.
- All data (events, trips, particles) lives in the active profile folder under `src/data/`; components import from `@/data`.
- Always include `owner: 'mindy'` on every `TimelineEvent` and `Trip` object — it is required by the Firestore query filter.
- Use `useTimeline()` and `useTrips()` hooks in pages/components instead of importing static data directly.

## Dev commands

```bash
npm run dev      # Start Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```
