import { createTheme } from '@mui/material/styles';

/**
 * Refined Heritage design tokens — structural / neutral values only.
 *
 * Brand colours (primary, secondary, tertiary, quaternary) live exclusively
 * in `theme.palette` and must always be accessed through it.
 * These tokens hold only the structural values that have no palette equivalent.
 */
const tokens = {
    colors: {
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

// Augment the MUI Theme type so every component can reach `theme.tokens`
// via `useTheme()` or an sx callback — no direct `tokens` import needed.
declare module '@mui/material/styles' {
    interface Theme {
        tokens: typeof tokens;
    }
    interface ThemeOptions {
        tokens?: typeof tokens;
    }

    // Glow / glowFaint extensions on every named palette colour
    interface PaletteColor {
        glow?: string;
        glowFaint?: string;
    }
    interface SimplePaletteColorOptions {
        glow?: string;
        glowFaint?: string;
    }

    // Custom brand palette slots
    interface Palette {
        tertiary: PaletteColor;
        quaternary: PaletteColor;
    }
    interface PaletteOptions {
        tertiary?: SimplePaletteColorOptions;
        quaternary?: SimplePaletteColorOptions;
    }
}

const { colors: c, fonts: f } = tokens;

const theme = createTheme({
    tokens,
    palette: {
        mode: 'light',

        // ── Primary — Deep Burgundy ──────────────────────────────────────────
        primary: {
            main: '#9D2933',
            light: '#C04050',
            dark: '#6B1B24',
            contrastText: c.white,
            glow: 'rgba(157, 41, 51, 0.25)',
            glowFaint: 'rgba(157, 41, 51, 0.10)',
        },

        // ── Secondary — Dusty Rose ───────────────────────────────────────────
        secondary: {
            main: '#D4A5A5',
            light: '#E8C8C8',
            dark: '#B87878',
            contrastText: c.ink,
            glow: 'rgba(212, 165, 165, 0.35)',
            glowFaint: 'rgba(212, 165, 165, 0.15)',
        },

        // ── Tertiary — Coffee Brown ──────────────────────────────────────────
        tertiary: {
            main: '#6D4C41',
            light: '#8D6E63',
            dark: '#5D4037',
            contrastText: c.white,
            glow: 'rgba(109, 76, 65, 0.28)',
            glowFaint: 'rgba(109, 76, 65, 0.10)',
        },

        // ── Quaternary — Warm Amber ──────────────────────────────────────────
        quaternary: {
            main: '#B8762A',
            light: '#D4994A',
            dark: '#8B5A20',
            contrastText: c.white,
            glow: 'rgba(184, 118, 42, 0.30)',
            glowFaint: 'rgba(184, 118, 42, 0.12)',
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
