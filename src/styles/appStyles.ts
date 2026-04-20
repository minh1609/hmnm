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
    boxShadow: `0 8px 32px ${theme.palette.primary.glowFaint}`,
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

/** Ghost secondary button — muted text, subtle border, turns primary on hover. */
export const secondaryButtonSx = (theme: Theme) => ({
    fontFamily: theme.tokens.fonts.sans,
    fontWeight: 600,
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: theme.tokens.colors.inkMuted,
    border: `1px solid ${theme.tokens.colors.border}`,
    borderRadius: '999px',
    px: 3,
    py: 1,
    backdropFilter: 'blur(4px)',
    backgroundColor: `${theme.tokens.colors.creamDark}CC`,
    '&:hover': {
        backgroundColor: theme.tokens.colors.surface,
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
    },
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
    textColor: string = theme.tokens.colors.white
) => ({
    fontFamily: theme.tokens.fonts.sans,
    fontWeight: 600,
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: '999px',
    px: 3,
    py: 1,
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
    color: theme.palette.primary.dark,
    border: `1px solid ${theme.palette.secondary.main}`,
    '& .MuiAlert-icon': { color: theme.palette.primary.main },
});
