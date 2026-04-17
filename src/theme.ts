import { createTheme } from '@mui/material/styles';

/**
 * Refined Heritage design tokens — single source of truth.
 *
 * Components access these via `theme.tokens` from `useTheme()` or the sx callback
 * `(theme) => ({...})`. Never import `tokens` directly in components.
 *
 * To swap the entire colour palette: edit `tokens` below — every component that
 * reads from the theme updates automatically.
 *
 * Also update the matching CSS custom properties in index.css for global/animation
 * contexts (keyframes, pseudo-elements, global resets).
 */
export const tokens = {
    colors: {
        // Primary — Deep Burgundy
        burgundy: '#9D2933',
        burgundyLight: '#C04050',
        burgundyDark: '#6B1B24',
        burgundyGlow: 'rgba(157, 41, 51, 0.25)',
        burgundyGlowFaint: 'rgba(157, 41, 51, 0.10)',

        // Secondary — Dusty Rose
        rose: '#D4A5A5',
        roseDark: '#B87878',
        roseGlow: 'rgba(212, 165, 165, 0.35)',
        roseGlowFaint: 'rgba(212, 165, 165, 0.15)',

        // Tertiary — Coffee Brown
        brown: '#6D4C41',
        brownLight: '#8D6E63',
        brownGlow: 'rgba(109, 76, 65, 0.28)',

        // Quaternary — Warm Amber (used for "meaningful" trip type)
        amber: '#B8762A',
        amberLight: '#D4994A',
        amberGlow: 'rgba(184, 118, 42, 0.30)',
        amberGlowFaint: 'rgba(184, 118, 42, 0.12)',

        // Backgrounds (warm light)
        cream: '#FAF7F2',
        creamDark: '#F0EBE3',
        surface: '#FFFFFF',
        panel: '#F5F0E8',

        // Borders / dividers
        border: '#DDD5CC',
        borderSubtle: '#EDE8E0',

        // Text
        ink: '#2C1A12',
        inkMuted: '#7A6356',
        inkSubtle: '#B0A090',

        // Pure utility
        white: '#FFFFFF',
    },
    fonts: {
        // Plus Jakarta Sans — modern geometric sans for body / UI
        sans: "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif",
        // Newsreader — editorial serif for headlines and display text
        display: "'Newsreader', Georgia, 'Times New Roman', serif",
        // Newsreader italic — used for romantic / script-style text
        script: "'Newsreader', Georgia, serif",
        mono: 'ui-monospace, Consolas, monospace',
    },
} as const;

/** Backward-compatible alias — keeps any migration-script references valid. */
export const ferrariTokens = tokens;

// Augment the MUI Theme type so every component can reach `theme.tokens`
// via `useTheme()` or an sx callback — no direct `tokens` import needed.
declare module '@mui/material/styles' {
    interface Theme {
        tokens: typeof tokens;
    }
    interface ThemeOptions {
        tokens?: typeof tokens;
    }
}

const { colors: c, fonts: f } = tokens;

const theme = createTheme({
    tokens,
    palette: {
        mode: 'light',
        primary: {
            main: c.burgundy,
            light: c.burgundyLight,
            dark: c.burgundyDark,
            contrastText: c.white,
        },
        secondary: {
            main: c.rose,
            light: '#E8C8C8',
            dark: c.roseDark,
            contrastText: c.ink,
        },
        background: {
            default: c.cream,
            paper: c.surface,
        },
        text: {
            primary: c.ink,
            secondary: c.inkMuted,
            disabled: c.inkSubtle,
        },
        divider: c.borderSubtle,
    },

    typography: {
        fontFamily: f.sans,

        h1: {
            fontFamily: f.display,
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontFamily: f.display,
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontFamily: f.display,
            fontWeight: 600,
        },
        body1: {
            fontFamily: f.sans,
            fontWeight: 400,
        },
        body2: {
            fontFamily: f.sans,
            fontWeight: 400,
            fontSize: '0.82rem',
        },
        caption: {
            fontFamily: f.sans,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            fontSize: '0.65rem',
        },
        overline: {
            fontFamily: f.sans,
            fontWeight: 600,
            letterSpacing: '0.1em',
        },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: c.cream,
                    color: c.ink,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: f.sans,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;
