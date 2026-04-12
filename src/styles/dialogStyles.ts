import { ferrariTokens } from '@/theme';

/**
 * Shared Ferrari-themed style helpers for MUI Dialogs.
 * All dialogs in the app (Create/Edit, Delete, GfNote) use these to stay consistent.
 */

/** Dialog Paper background, border, and shape. Pass the accent border color. */
export const dialogPaperSx = (borderColor: string) => ({
    backgroundColor: ferrariTokens.colors.carbon,
    border: `1px solid ${borderColor}`,
    borderRadius: 2,
    backgroundImage: 'none',
});

/** DialogTitle — uppercase display font with a bottom divider. Pass the accent color. */
export const dialogTitleSx = (color: string) => ({
    fontFamily: ferrariTokens.fonts.display,
    fontWeight: 700,
    fontSize: '1.3rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color,
    borderBottom: `1px solid ${ferrariTokens.colors.border}`,
    pb: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
});

/** DialogActions row — consistent padding and top divider. */
export const dialogActionsSx = {
    px: 3,
    py: 2,
    borderTop: `1px solid ${ferrariTokens.colors.border}`,
    gap: 1,
};

/** Ghost Cancel button — muted text, turns white on hover. */
export const cancelButtonSx = {
    fontFamily: ferrariTokens.fonts.display,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: ferrariTokens.colors.muted,
    '&:hover': { color: ferrariTokens.colors.white },
};

/**
 * Contained primary action button.
 * @param bg        Normal background color
 * @param hover     Hover background color
 * @param textColor Button label color (default: white)
 */
export const primaryButtonSx = (bg: string, hover: string, textColor: string = ferrariTokens.colors.white) => ({
    fontFamily: ferrariTokens.fonts.display,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    backgroundColor: bg,
    color: textColor,
    '&:hover': { backgroundColor: hover },
    '&.Mui-disabled': {
        backgroundColor: ferrariTokens.colors.subtle,
        color: ferrariTokens.colors.muted,
    },
});

/**
 * Outlined TextField styled for the dark Ferrari theme.
 * @param accentColor Color used for hover/focus border and focused label.
 */
export const textFieldSx = (accentColor: string) => ({
    '& .MuiOutlinedInput-root': {
        fontFamily: ferrariTokens.fonts.sans,
        color: ferrariTokens.colors.white,
        '& fieldset': { borderColor: ferrariTokens.colors.border },
        '&:hover fieldset': { borderColor: accentColor },
        '&.Mui-focused fieldset': { borderColor: accentColor },
    },
    '& .MuiInputLabel-root': {
        fontFamily: ferrariTokens.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        fontSize: '0.8rem',
        color: ferrariTokens.colors.muted,
        '&.Mui-focused': { color: accentColor },
    },
    '& .MuiInputBase-input::placeholder': {
        color: ferrariTokens.colors.subtle,
        opacity: 1,
    },
});

/** Error Alert styled for the dark theme. */
export const errorAlertSx = {
    mb: 2,
    backgroundColor: ferrariTokens.colors.redDeep,
    color: ferrariTokens.colors.white,
    '& .MuiAlert-icon': { color: ferrariTokens.colors.goldLight },
};
