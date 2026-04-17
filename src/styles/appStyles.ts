import type { Theme } from '@mui/material/styles';

/**
 * Shared Refined Heritage style helpers for MUI components.
 * All functions accept the MUI `theme` object as their first argument so that
 * colours and fonts flow from the active theme — no direct token imports needed.
 */

// ─── Dialogs ────────────────────────────────────────────────────────────────

/** Dialog Paper background, border, and shape. Pass the accent border colour. */
export const dialogPaperSx = (theme: Theme, borderColor: string) => ({
    backgroundColor: theme.tokens.colors.surface,
    border: `1px solid ${borderColor}`,
    borderRadius: 2,
    backgroundImage: 'none',
    boxShadow: `0 8px 32px ${theme.tokens.colors.burgundyGlowFaint}`,
});

/** DialogTitle — display serif font with a bottom divider. Pass the accent colour. */
export const dialogTitleSx = (theme: Theme, color: string) => ({
    fontFamily: theme.tokens.fonts.display,
    fontWeight: 700,
    fontSize: '1.3rem',
    letterSpacing: '-0.01em',
    color,
    borderBottom: `1px solid ${theme.tokens.colors.border}`,
    pb: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
});

/** DialogActions row — consistent padding and top divider. */
export const dialogActionsSx = (theme: Theme) => ({
    px: 3,
    py: 2,
    borderTop: `1px solid ${theme.tokens.colors.border}`,
    gap: 1,
});

/** Ghost secondary button — muted text, subtle border, turns ink on hover. */
export const secondaryButtonSx = (theme: Theme) => ({
    fontFamily: theme.tokens.fonts.sans,
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: theme.tokens.colors.inkMuted,
    border: `1px solid ${theme.tokens.colors.border}`,
    '&:hover': { color: theme.tokens.colors.ink, backgroundColor: theme.tokens.colors.creamDark },
});

/**
 * Contained primary action button.
 * @param theme     MUI theme
 * @param bg        Normal background colour
 * @param hover     Hover background colour
 * @param textColor Button label colour (default: white)
 */
export const primaryButtonSx = (
    theme: Theme,
    bg: string,
    hover: string,
    textColor: string = theme.tokens.colors.white,
) => ({
    fontFamily: theme.tokens.fonts.sans,
    fontWeight: 600,
    letterSpacing: '0.04em',
    backgroundColor: bg,
    color: textColor,
    '&:hover': { backgroundColor: hover },
    '&.Mui-disabled': {
        backgroundColor: theme.tokens.colors.borderSubtle,
        color: theme.tokens.colors.inkSubtle,
    },
});

/**
 * Outlined TextField styled for the light Heritage theme.
 * @param theme       MUI theme
 * @param accentColor Colour used for hover/focus border and focused label.
 */
export const textFieldSx = (theme: Theme, accentColor: string) => ({
    '& .MuiOutlinedInput-root': {
        fontFamily: theme.tokens.fonts.sans,
        color: theme.tokens.colors.ink,
        backgroundColor: theme.tokens.colors.cream,
        '& fieldset': { borderColor: theme.tokens.colors.border },
        '&:hover fieldset': { borderColor: accentColor },
        '&.Mui-focused fieldset': { borderColor: accentColor },
    },
    '& .MuiInputLabel-root': {
        fontFamily: theme.tokens.fonts.sans,
        fontWeight: 600,
        letterSpacing: '0.03em',
        fontSize: '0.85rem',
        color: theme.tokens.colors.inkMuted,
        '&.Mui-focused': { color: accentColor },
    },
    '& .MuiInputBase-input::placeholder': {
        color: theme.tokens.colors.inkSubtle,
        opacity: 1,
    },
});

/** Error Alert styled for the light theme. */
export const errorAlertSx = (theme: Theme) => ({
    mb: 2,
    backgroundColor: '#FFF0F1',
    color: theme.tokens.colors.burgundyDark,
    border: `1px solid ${theme.tokens.colors.rose}`,
    '& .MuiAlert-icon': { color: theme.tokens.colors.burgundy },
});

// ─── FAB ────────────────────────────────────────────────────────────────────

/**
 * Floating action button in the burgundy brand colour with a float animation.
 * Handles all visual styling (colours, shadow, animation, hover) but not
 * positioning — set `position`, `bottom`, `right`, and `zIndex` at the call site.
 */
export const burgundyFabSx = (theme: Theme) => ({
    px: 2.5,
    gap: 1,
    borderRadius: '999px',
    backgroundColor: theme.tokens.colors.burgundy,
    color: theme.tokens.colors.white,
    border: `1px solid ${theme.tokens.colors.burgundyDark}`,
    boxShadow: `0 6px 16px ${theme.tokens.colors.burgundyGlow}, 0 2px 6px rgba(0,0,0,0.12)`,
    animation: 'fabFloat 3s ease-in-out infinite',
    '@keyframes fabFloat': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-6px)' },
    },
    transition: 'transform 2s ease, box-shadow 0.5s ease, background-color 0.5s ease',
    '&:hover': {
        backgroundColor: theme.tokens.colors.burgundyLight,
        boxShadow: `0 10px 28px ${theme.tokens.colors.burgundyGlow}`,
        animation: 'none',
        transform: 'translateY(-4px) scale(1.05)',
    },
});

/** Typography label inside a FAB — tight, weighted, sans-serif. */
export const fabLabelSx = (theme: Theme) => ({
    fontFamily: theme.tokens.fonts.sans,
    fontWeight: 600,
    fontSize: '0.85rem',
    letterSpacing: '0.04em',
    lineHeight: 1,
});
