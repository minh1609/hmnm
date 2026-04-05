import { createTheme } from '@mui/material/styles';

/**
 * Ferrari F1 design tokens — single source of truth.
 * Use these in MUI's `sx` prop via `theme.palette.*` and `theme.typography.*`.
 * The same raw values are mirrored as CSS custom properties in index.css for
 * non-MUI contexts (plain CSS, keyframe animations, etc.).
 */
export const ferrariTokens = {
    colors: {
        // Brand
        red: '#DC0000',
        redBright: '#FF2800',
        redDeep: '#8B0000',
        redGlow: 'rgba(220, 0, 0, 0.35)',
        redGlowFaint: 'rgba(220, 0, 0, 0.12)',

        // Accent / trim
        gold: '#C8A84B',
        goldLight: '#E8D070',
        goldGlow: 'rgba(200, 168, 75, 0.3)',

        // Backgrounds
        black: '#0D0D0D',
        carbon: '#141414',
        surface: '#1A1A1A',
        panel: '#242424',

        // Borders / dividers
        border: '#2E2E2E',
        borderSubtle: '#1E1E1E',

        // Text
        white: '#FFFFFF',
        muted: '#999999',
        subtle: '#555555',
    },
    fonts: {
        // Titillium Web — official F1 font for body / UI text
        sans: "'Titillium Web', 'Arial Narrow', Arial, sans-serif",
        // Barlow Condensed — bold racing display / numbers
        display: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
        // Great Vibes — script for romantic captions
        script: "'Great Vibes', cursive",
        mono: 'ui-monospace, Consolas, monospace',
    },
} as const;

const { colors: c, fonts: f } = ferrariTokens;

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: c.red,
            light: c.redBright,
            dark: c.redDeep,
            contrastText: c.white,
        },
        secondary: {
            main: c.gold,
            light: c.goldLight,
            dark: '#A07830',
            contrastText: c.black,
        },
        background: {
            default: c.black,
            paper: c.surface,
        },
        text: {
            primary: c.white,
            secondary: c.muted,
            disabled: c.subtle,
        },
        divider: c.border,
    },

    typography: {
        fontFamily: f.sans,

        h1: {
            fontFamily: f.display,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
        },
        h2: {
            fontFamily: f.display,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
        },
        h3: {
            fontFamily: f.display,
            fontWeight: 700,
        },
        // "script" variant — use as component="p" with variant overrides
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
            fontFamily: f.display,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            fontSize: '0.65rem',
        },
        overline: {
            fontFamily: f.display,
            fontWeight: 700,
            letterSpacing: '0.2em',
        },
    },

    shape: {
        borderRadius: 4,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: c.black,
                    color: c.white,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: f.display,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                },
            },
        },
    },
});

export default theme;
