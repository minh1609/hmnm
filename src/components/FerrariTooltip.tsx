import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import { ferrariTokens } from '@/theme';

const FerrariTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: ferrariTokens.colors.surface,
        color: 'white',
        fontFamily: ferrariTokens.fonts.sans,
        fontSize: '0.82rem',
        fontWeight: 500,
        border: `1px solid ${ferrariTokens.colors.border}`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 8px ${ferrariTokens.colors.redGlowFaint}`,
        letterSpacing: '0.02em',
        padding: '6px 12px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: ferrariTokens.colors.surface,
        '&::before': {
            border: `1px solid ${ferrariTokens.colors.border}`,
        },
    },
}));

export default FerrariTooltip;
