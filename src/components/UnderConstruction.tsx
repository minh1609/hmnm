import { Box, Typography } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useTheme } from '@mui/material/styles';

export function UnderConstruction() {
    const {
        palette: p,
        tokens: { colors: c, fonts: f },
    } = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 3,
                px: 3,
                textAlign: 'center',
            }}
        >
            <EngineeringIcon
                sx={{
                    fontSize: '4rem',
                    color: p.primary.main,
                    opacity: 0.7,
                }}
            />
            <Typography
                variant="h3"
                sx={{
                    fontFamily: f.display,
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', sm: '2.4rem' },
                    color: p.primary.main,
                    letterSpacing: '-0.02em',
                }}
            >
                Page Under Construction
            </Typography>
            <Typography
                sx={{
                    fontFamily: f.sans,
                    fontSize: '1rem',
                    color: c.inkMuted,
                    maxWidth: 360,
                    lineHeight: 1.6,
                }}
            >
                Something special is on the way. Check back soon.
            </Typography>
            <Typography
                sx={{
                    fontFamily: f.script,
                    fontSize: '1.5rem',
                    color: p.primary.main,
                    opacity: 0.6,
                }}
            >
                Coming Soon ♡
            </Typography>
        </Box>
    );
}
