import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import { tokens } from '@/theme';

const FerrariTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip enterTouchDelay={0} leaveTouchDelay={4000} {...props} arrow classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: tokens.colors.ink,
        color: tokens.colors.white,
        fontFamily: tokens.fonts.sans,
        fontSize: '0.82rem',
        fontWeight: 500,
        border: `1px solid ${tokens.colors.burgundyDark}`,
        boxShadow: `0 4px 16px ${tokens.colors.burgundyGlowFaint}`,
        letterSpacing: '0.02em',
        padding: '6px 12px',
        borderRadius: '6px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: tokens.colors.ink,
        '&::before': {
            border: `1px solid ${tokens.colors.burgundyDark}`,
        },
    },
}));

export default FerrariTooltip;
