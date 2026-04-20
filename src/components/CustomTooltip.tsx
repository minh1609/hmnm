import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip enterTouchDelay={0} leaveTouchDelay={4000} {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.tokens.colors.ink,
        color: theme.tokens.colors.white,
        fontFamily: theme.tokens.fonts.sans,
        fontSize: '0.82rem',
        fontWeight: 500,
        border: `1px solid ${theme.palette.primary.dark}`,
        boxShadow: `0 4px 16px ${theme.palette.primary.glowFaint}`,
        letterSpacing: '0.02em',
        padding: '6px 12px',
        borderRadius: '6px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.tokens.colors.ink,
        '&::before': {
            border: `1px solid ${theme.palette.primary.dark}`,
        },
    },
}));

export default CustomTooltip;
