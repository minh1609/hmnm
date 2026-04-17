---
name: hmnm-project
description: Domain knowledge and conventions for the hmnm dating progress app — a Refined Heritage themed React/MUI app that tracks a couple's relationship milestones. Use when working on this project, adding new timeline events, creating components, updating the theme, or editing any file under src/.
---

# hmnm — Refined Heritage Dating Progress App

A personal React app that tracks and displays a couple's relationship milestones with an editorial, warm light aesthetic inspired by the "Refined Heritage" design system.

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
    ├── FallingObjects.tsx      # Ambient particle system — falling images + emoji icons
    ├── JourneyCounter.tsx      # Live circular stat cards (days, hours today, minutes past, trips)
    ├── PageHeader.tsx          # Sticky/non-sticky header with back button, title, AuthButton
    ├── TripDetailDialog.tsx    # MUI Dialog showing full trip details (type-coloured)
    ├── CustomTooltip.tsx       # Styled MUI Tooltip (heritage dark theme)
    ├── AuthButton.tsx          # Firebase Auth sign-in/out button
    ├── IconBurst.tsx           # Emoji particle burst effect (portal into document.body)
    ├── YearDescription.tsx     # Animated year description banner
    ├── CreateEventDialog.tsx   # Dialog to create a new timeline event
    ├── DeleteEventDialog.tsx   # Confirmation dialog for event deletion
    ├── GfNoteDialog.tsx        # Dialog for editing gfNote on an event
    ├── ReasonILikeYou.tsx      # Decorative reasons-I-like-you component
    ├── YesCelebration.tsx      # Celebration animation component
    ├── ScrollToTopFab.tsx      # Floating action button — scroll to top
    └── AddEventFab.tsx         # Floating action button — add timeline event

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
export const app; // FirebaseApp
export const analytics; // Analytics
export const db; // Firestore instance — import wherever Firestore is needed
```

Project ID: `pet1609-cf0d7`. Import `db` from `@/firebase`.

## Hooks (`src/hooks/`)

Both hooks follow the same pattern: initialise state with static fallback data, fire a one-shot Firestore query on mount, and update state only if the collection returns documents. Errors are swallowed silently so the static data always shows.

### `useTimeline` (`src/hooks/useTimeline.ts`)

```ts
export function useTimeline(): Record<number, TimelineYear>;
```

- Queries `timeline_events` collection: `where('owner', '==', 'mindy')`, `orderBy('date', 'asc')`.
- Converts Firestore `Timestamp` fields to `Date` via local `toDate()`.
- Groups the flat event list into `Record<number, TimelineYear>` using `groupByYear(events, staticYearDescriptions)`.
- Falls back to the static `timelineEvents` + `yearDescriptions` from `@/data` if collection is empty or unreachable.

### `useTrips` (`src/hooks/useTrips.ts`)

```ts
export function useTrips(): { trips: Trip[] };
```

- Returns `{ trips }`, not a bare array.
- Queries `trips` collection: `where('owner', '==', 'mindy')`, `orderBy('startDate', 'asc')`.
- Converts Firestore `Timestamp` fields (`startDate`, `endDate`) to `Date` via local `toDate()`.
- Falls back to the static `trips` array from `@/data` if collection is empty or unreachable.

## Routing (`src/App.tsx`)

`App.tsx` applies a page transition CSS class based on navigation direction, then renders `<Routes>`. Route ordering:

```ts
const routeOrder: Record<string, number> = { '/': 0, '/trips': 1 };
```

Animation classes applied to the wrapping `<div key={location.key}>`:

| Class                 | Trigger                                      |
| --------------------- | -------------------------------------------- |
| `page-enter-fade`     | Default / initial load (currently always)    |
| `page-enter-forward`  | Navigating to higher-order route (commented) |
| `page-enter-backward` | Navigating to lower-order route (commented)  |

## Design tokens — `tokens` / `ferrariTokens` (`src/theme.ts`)

> **Visual spec:** See `.cursor/skills/hmnm-project/DESIGN.md` for the full "Refined Heritage" design brief (color palette rationale, typography choices, roundedness). Read it before making any design or styling decisions.

Single source of truth. Always import `tokens` (or the alias `ferrariTokens`) from `@/theme`. Never hardcode hex values.

```ts
import { tokens } from '@/theme';
const { colors: c, fonts: f } = tokens;

// Primary — Deep Burgundy
tokens.colors.burgundy; // #9D2933  — primary brand
tokens.colors.burgundyLight; // #C04050
tokens.colors.burgundyDark; // #6B1B24
tokens.colors.burgundyGlow; // rgba(157,41,51,0.25)
tokens.colors.burgundyGlowFaint; // rgba(157,41,51,0.10)

// Secondary — Dusty Rose
tokens.colors.rose; // #D4A5A5
tokens.colors.roseDark; // #B87878
tokens.colors.roseGlow; // rgba(212,165,165,0.35)
tokens.colors.roseGlowFaint; // rgba(212,165,165,0.15)

// Tertiary — Coffee Brown
tokens.colors.brown; // #6D4C41
tokens.colors.brownLight; // #8D6E63
tokens.colors.brownGlow; // rgba(109,76,65,0.28)

// Quaternary — Warm Amber (used for "meaningful" trip type)
tokens.colors.amber; // #B8762A
tokens.colors.amberLight; // #D4994A
tokens.colors.amberGlow; // rgba(184,118,42,0.30)
tokens.colors.amberGlowFaint; // rgba(184,118,42,0.12)

// Backgrounds (warm light)
tokens.colors.cream; // #FAF7F2  — page background
tokens.colors.creamDark; // #F0EBE3
tokens.colors.surface; // #FFFFFF  — card/paper bg
tokens.colors.panel; // #F5F0E8

// Borders / dividers
tokens.colors.border; // #DDD5CC
tokens.colors.borderSubtle; // #EDE8E0

// Text
tokens.colors.ink; // #2C1A12  — primary text
tokens.colors.inkMuted; // #7A6356
tokens.colors.inkSubtle; // #B0A090

// Utility
tokens.colors.white; // #FFFFFF
```

**MUI palette** (theme.ts):

| Palette key          | Maps to              |
| -------------------- | -------------------- |
| `primary`            | burgundy (`#9D2933`) |
| `secondary`          | rose (`#D4A5A5`)     |
| `background.default` | cream (`#FAF7F2`)    |
| `background.paper`   | white (`#FFFFFF`)    |
| `text.primary`       | ink (`#2C1A12`)      |
| `text.secondary`     | inkMuted (`#7A6356`) |

> Mode is **light**. `primary` is burgundy, `secondary` is dusty rose.

**Accessing tokens in components** — always use `useTheme()`, never import `tokens` directly:

```ts
import { useTheme } from '@mui/material/styles';

const { tokens: { colors: c, fonts: f } } = useTheme();
// c.burgundy, f.display, etc.
```

The theme is augmented (`declare module`) so `theme.tokens` is fully typed.

**Fonts** (loaded via Google Fonts in `index.html`):

| Token           | Font              | Use                                                |
| --------------- | ----------------- | -------------------------------------------------- |
| `fonts.sans`    | Plus Jakarta Sans | Body / UI labels / buttons                         |
| `fonts.display` | Newsreader        | Editorial headings, stat values, display text      |
| `fonts.script`  | Newsreader        | Romantic captions — use with `fontStyle: 'italic'` |
| `fonts.mono`    | system mono       | Code                                               |

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
fallingObjects.imageCount; // number of image particles
fallingObjects.iconCount; // number of emoji/icon particles
fallingObjects.particle.leftMin / leftMax; // horizontal spread (% of viewport)
fallingObjects.particle.sizeMin / sizeMax; // particle size in px
fallingObjects.particle.durationMin / durationMax; // fall duration in seconds
fallingObjects.particle.delayMin / delayMax; // stagger delay in seconds (≤ 0)
fallingObjects.particle.opacityMin / opacityMax; // idle translucency
fallingObjects.particle.driftMin / driftMax; // horizontal sway in px
```

### `iconBurst`

All tunable parameters for the `IconBurst` click effect:

```ts
iconBurst.count; // number of emoji particles per burst
iconBurst.durationMs; // how long the burst stays on screen (ms); matches CSS animation
iconBurst.angleJitter; // random angle spread per particle (radians)
iconBurst.distanceMin; // minimum travel distance from origin (px)
iconBurst.distanceExtra; // extra random distance on top of min (px)
iconBurst.maxDelay; // max per-particle stagger delay (seconds)
iconBurst.sizeBase; // base emoji font-size (rem)
iconBurst.sizeExtra; // max extra font-size added randomly (rem)
```

## Types (`src/types.ts`)

All shared interfaces live here. Import from `@/types`.

```ts
export interface ImageFile {
    file: string; // filename inside public/particles/
    label: string; // shown in tooltip on hover
}

export interface Icon {
    symbol: string; // emoji or text symbol
    color: string; // CSS color (ignored for emojis)
    label: string; // shown in tooltip on hover
}

export type TripType = 'trip' | 'meaningful' | 'plan';
// 'trip'        — completed trip (burgundy pins)
// 'meaningful'  — meaningful/special place (amber pins)
// 'plan'        — future planned trip (brown pins, "FUTURE" badge)

export interface TripDestination {
    name: string;
    googleMapLink?: string; // If present, destination renders as clickable link
}

export interface Trip {
    name: string;
    flag: string;                          // Country flag emoji
    startDate?: Date;                      // Optional — plans may not have dates yet
    endDate?: Date;                        // Optional
    destinations?: TripDestination[];      // Optional
    coordinates: [number, number];         // [longitude, latitude] — required for map pin
    owner: string;                         // Firestore filter key (e.g. 'mindy')
    type: TripType;                        // Required — controls pin color + FUTURE badge
    notes?: string;                        // Optional free-text notes shown in dialog
}

export interface TimelineEvent {
    id?: string;        // Firestore document ID — present for Firestore docs, absent for static data
    date: Date;         // Use new Date('YYYY-MM-DDTHH:mm:ss')
    name: string;       // Event title — shown in UPPERCASE via CSS
    des?: string;       // Optional detail shown in tooltip via LightbulbIcon
    burstIcon?: string; // Optional emoji — clicking the date Chip triggers IconBurst
    owner: string;      // Firestore filter key (e.g. 'mindy')
    gfNote?: string;    // Note added by gf role — only editable by gf
}

export interface TimelineYear {
    description: string; // Shown above the timeline
    events: TimelineEvent[];
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

| File         | Export             | Type                     |
| ------------ | ------------------ | ------------------------ |
| `events.ts`  | `timelineEvents`   | `TimelineEvent[]`        |
|              | `yearDescriptions` | `Record<number, string>` |
| `trips.ts`   | `trips`            | `Trip[]`                 |
| `objects.ts` | `IMAGE_FILES`      | `ImageFile[]`            |
|              | `ICONS`            | `Icon[]`                 |

### Timeline events (`events.ts`)

Events are a **flat array** `timelineEvents: TimelineEvent[]` sorted by date.  
Year descriptions are a separate `yearDescriptions: Record<number, string>` map keyed by year.  
The `useTimeline` hook groups events by year at runtime using `groupByYear(events, yearDescriptions)`.  
Each event must include `owner: 'mindy'` to match the Firestore query filter.

### Trips (`trips.ts`)

To add a new trip: append a `Trip` object (including `owner: 'mindy'` and `coordinates: [lon, lat]`) to the `trips` array.

- `type: 'trip'` — a completed trip (burgundy map pin).
- `type: 'meaningful'` — a special/meaningful place (amber map pin).
- `type: 'plan'` — a future planned trip (brown map pin + "FUTURE" badge in dialog).
- `startDate`/`endDate` and `destinations` are optional for plans without dates yet.
- `TRIPS_TAKEN` in `JourneyCounter.tsx` counts only entries where `type === 'trip'` — it updates automatically; **no manual increment needed**.

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

- `PageHeader` at the top: title shows trip count (only `type === 'trip'` entries), back button navigates to `/`.
- **Interactive world map** (`react-simple-maps` — `ComposableMap` + `ZoomableGroup`): countries from `world-atlas@2` CDN, zoom controls (+/−) in the bottom-right corner.
- Each trip is a **map pin** coloured by `getTripTypeStyle(trip.type)`: pulsing halo + solid pin dot + flag emoji above.
- Clicking a pin → opens `TripDetailDialog`.
- **Trip pills row** below the map: horizontal wrapping row of pill buttons, one per trip. Each pill shows flag + name + "FUTURE" badge (for plans). Clicking a pill opens `TripDetailDialog`.
- Empty state on map: "More adventures to come ✈️" when no trips exist.

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
- Trips taken count: `trips.filter(t => t.type === 'trip').length` — only real trips, automatically in sync.
- `getCounterValues()` returns `{ days, hoursToday, minutesPast }`.
- Refreshes every **30 seconds** via `setInterval`.
- `StatCard` props: `value`, `label`, `icon` (watermark MUI icon), `live` (pulsing rose dot), `onClick`, `sx`.
- Cards are **circular** — `borderRadius: '50%'`, watermark icon at 5.5% opacity in background, value centered in burgundy italic serif.
- "Trips Taken" card is clickable and navigates to `/trips`.
- Hover lifts the circle with `burgundyGlow` box-shadow.

### `PageHeader` (`src/components/PageHeader.tsx`)

Reusable sticky/non-sticky header used by all secondary pages.

Props:

| Prop        | Type     | Default | Description                                          |
| ----------- | -------- | ------- | ---------------------------------------------------- |
| `title`     | `string` | —       | Displayed in display serif font                       |
| `onBack`    | `() => void` | navigate('/') | Custom back handler                         |
| `showBack`  | `boolean`| `true`  | Show/hide the back arrow button                      |
| `sticky`    | `boolean`| `true`  | Whether to apply `position: sticky` + `top: 0`      |

- Shows a "Dev Mode" amber badge in `import.meta.env.DEV`.
- Renders `AuthButton` on the right side.

### `TripDetailDialog` (`src/components/TripDetailDialog.tsx`)

MUI `Dialog` that opens when a trip pin or pill is clicked on `TripsPage`.

- `borderTop` coloured by `getTripTypeStyle(trip.type).pin`.
- Shows: flag + name heading, "FUTURE" badge (plans only), destinations (linked if `googleMapLink`), duration badge (days count), date range, and `trip.notes` (italic serif, muted).
- Bottom accent line uses `getTripTypeStyle().gradient`.
- Props: `trip: Trip | null`, `onClose: () => void`.

### `IconBurst` (`src/components/IconBurst.tsx`)

Renders emoji particles via `createPortal` that burst outward from `(x, y)` coordinates. All burst parameters (count, duration, distances, sizes) come from `iconBurst` in `@/config`. Uses CSS class `burst-particle` with `--bx`/`--by` CSS variables for direction. Auto-calls `onDone` after `iconBurst.durationMs`. Triggered from `HomePage` when clicking a date Chip that has `burstIcon`.

## Animations (`src/App.css`)

| CSS class              | Effect                                       |
| ---------------------- | -------------------------------------------- |
| `timeline-slide-left`  | Slide in from right when advancing year      |
| `timeline-slide-right` | Slide in from left when going back           |
| `year-desc-enter`      | Fade + slide up for year description text    |
| `page-enter-fade`      | Fade in for page transitions (always active) |
| `page-enter-forward`   | Slide in from right for forward navigation   |
| `page-enter-backward`  | Slide in from left for backward navigation   |
| `burst-particle`       | Outward burst animation using `--bx`/`--by`  |

Retrigger without remount: remove class → force reflow (`offsetHeight`) → re-add class.

## Utils (`src/utils.tsx`)

### `getSeason(date)`

Returns `SeasonInfo` based on month:

```ts
export type SeasonInfo = {
    icon: React.ReactElement;
    color: string;
    bgColor: string;
    weatherEmojis: string[]; // season-appropriate emoji for use in UI
};
```

| Months | Season | Color            | bgColor    |
| ------ | ------ | ---------------- | ---------- |
| 3–5    | Spring | Purple `#a855f7` | `#f3e8ff`  |
| 6–8    | Summer | Amber `#f59e0b`  | `#fef3c7`  |
| 9–10   | Autumn | Orange `#ea580c` | `#ffedd5`  |
| 11–2   | Winter | Blue `#3b82f6`   | `#dbeafe`  |

### `getTripTypeStyle(type)`

```ts
export type TripTypeStyle = {
    pin: string;      // solid pin / accent colour
    halo: string;     // semi-transparent halo fill for SVG animate
    glow: string;     // very faint tint for card shadows / backgrounds
    gradient: string; // accent gradient for dialog bottom rule
};

export function getTripTypeStyle(type: TripType): TripTypeStyle;
```

| TripType      | Pin colour    | Token source  |
| ------------- | ------------- | ------------- |
| `'trip'`      | burgundy      | `c.burgundy`  |
| `'meaningful'`| amber         | `c.amber`     |
| `'plan'`      | brown         | `c.brown`     |

Use this wherever a UI element should be coloured by trip type (map pins, dialog border, card accents).

## Conventions

- Access tokens via `useTheme().tokens` in components — **never** import `tokens` directly from `@/theme` in component files.
- MUI theme is **light mode**; `primary` = burgundy, `secondary` = dusty rose.
- Typography variants `h1`/`h2`/`h3` use `fonts.display` (Newsreader serif) — no auto-uppercase.
- Use `variant="caption"` for small label text — it uses `fonts.sans` with letter-spacing + uppercase.
- Use `fontStyle: 'italic'` with `fonts.display` (Newsreader) for romantic / script-style text.
- Card pattern: `borderTop: 3px solid <color>`, `::before` top shimmer gradient, `::after` bottom gradient line, hover lifts with glow shadow.
- Keep `@/` alias (not relative imports) for all `src/` imports.
- `des` field on `TimelineEvent` is `string | undefined` — treat as plain string.
- `burstIcon` on a `TimelineEvent` makes the date Chip interactive and fires `IconBurst` on click.
- All shared interfaces go in `src/types.ts`; import from `@/types`.
- All tunable constants (counts, sizes, timings) go in `src/config.ts`; never hardcode magic numbers in components.
- All data (events, trips, particles) lives in the active profile folder under `src/data/`; components import from `@/data`.
- Always include `owner: 'mindy'` on every `TimelineEvent` and `Trip` object — required by Firestore query filter.
- Always include `coordinates: [lon, lat]` on every `Trip` object — required for map pin placement.
- Always include `type: TripType` on every `Trip` object.
- Use `useTimeline()` and `useTrips()` hooks in pages/components instead of importing static data directly.
- `useTrips()` returns `{ trips }` — destructure accordingly.
- For trip-type-dependent colours, use `getTripTypeStyle(trip.type)` from `@/utils` — never hardcode trip type colours.
- CSS custom properties in `index.css` mirror `tokens` in `theme.ts` — keep them in sync when adding new colour tokens.

## Dev commands

```bash
npm run dev      # Start Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```
