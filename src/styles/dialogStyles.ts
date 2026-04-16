import { tokens } from '@/theme';

/**
 * Shared Refined Heritage style helpers for MUI Dialogs.
 * All dialogs in the app (Create/Edit, Delete, GfNote) use these to stay consistent.
 */

/** Dialog Paper background, border, and shape. Pass the accent border color. */
export const dialogPaperSx = (borderColor: string) => ({
    backgroundColor: tokens.colors.surface,
    border: `1px solid ${borderColor}`,
    borderRadius: 2,
    backgroundImage: 'none',
    boxShadow: `0 8px 32px ${tokens.colors.burgundyGlowFaint}`,
});

/** DialogTitle — display serif font with a bottom divider. Pass the accent color. */
export const dialogTitleSx = (color: string) => ({
    fontFamily: tokens.fonts.display,
    fontWeight: 700,
    fontSize: '1.3rem',
    letterSpacing: '-0.01em',
    color,
    borderBottom: `1px solid ${tokens.colors.border}`,
    pb: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
});

/** DialogActions row — consistent padding and top divider. */
export const dialogActionsSx = {
    px: 3,
    py: 2,
    borderTop: `1px solid ${tokens.colors.border}`,
    gap: 1,
};

/** Ghost Cancel button — muted text, turns ink on hover. */
export const cancelButtonSx = {
    fontFamily: tokens.fonts.sans,
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: tokens.colors.inkMuted,
    '&:hover': { color: tokens.colors.ink, backgroundColor: tokens.colors.creamDark },
};

/**
 * Contained primary action button.
 * @param bg        Normal background color
 * @param hover     Hover background color
 * @param textColor Button label color (default: white)
 */
export const primaryButtonSx = (bg: string, hover: string, textColor: string = tokens.colors.white) => ({
    fontFamily: tokens.fonts.sans,
    fontWeight: 600,
    letterSpacing: '0.04em',
    backgroundColor: bg,
    color: textColor,
    '&:hover': { backgroundColor: hover },
    '&.Mui-disabled': {
        backgroundColor: tokens.colors.borderSubtle,
        color: tokens.colors.inkSubtle,
    },
});

/**
 * Outlined TextField styled for the light Heritage theme.
 * @param accentColor Color used for hover/focus border and focused label.
 */
export const textFieldSx = (accentColor: string) => ({
    '& .MuiOutlinedInput-root': {
        fontFamily: tokens.fonts.sans,
        color: tokens.colors.ink,
        backgroundColor: tokens.colors.cream,
        '& fieldset': { borderColor: tokens.colors.border },
        '&:hover fieldset': { borderColor: accentColor },
        '&.Mui-focused fieldset': { borderColor: accentColor },
    },
    '& .MuiInputLabel-root': {
        fontFamily: tokens.fonts.sans,
        fontWeight: 600,
        letterSpacing: '0.03em',
        fontSize: '0.85rem',
        color: tokens.colors.inkMuted,
        '&.Mui-focused': { color: accentColor },
    },
    '& .MuiInputBase-input::placeholder': {
        color: tokens.colors.inkSubtle,
        opacity: 1,
    },
});

/** Error Alert styled for the light theme. */
export const errorAlertSx = {
    mb: 2,
    backgroundColor: '#FFF0F1',
    color: tokens.colors.burgundyDark,
    border: `1px solid ${tokens.colors.rose}`,
    '& .MuiAlert-icon': { color: tokens.colors.burgundy },
};
