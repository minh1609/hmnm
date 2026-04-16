import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';

const FerrariTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip enterTouchDelay={0} leaveTouchDelay={4000} {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.tokens.colors.ink,
        color: theme.tokens.colors.white,
        fontFamily: theme.tokens.fonts.sans,
        fontSize: '0.82rem',
        fontWeight: 500,
        border: `1px solid ${theme.tokens.colors.burgundyDark}`,
        boxShadow: `0 4px 16px ${theme.tokens.colors.burgundyGlowFaint}`,
        letterSpacing: '0.02em',
        padding: '6px 12px',
        borderRadius: '6px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.tokens.colors.ink,
        '&::before': {
            border: `1px solid ${theme.tokens.colors.burgundyDark}`,
        },
    },
}));

export default FerrariTooltip;
