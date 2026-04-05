import { Box, Typography } from '@mui/material';

export function HeartDivider() {
    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: theme.palette.primary.main,
                opacity: 0.5,
            })}
        >
            <Box
                sx={(theme) => ({
                    width: 48,
                    height: '1px',
                    background: `linear-gradient(to right, transparent, ${theme.palette.primary.main})`,
                })}
            />
            <Typography
                component="span"
                sx={{ fontSize: '0.6rem', letterSpacing: '3px' }}
            >
                ♥
            </Typography>
            <Box
                sx={(theme) => ({
                    width: 48,
                    height: '1px',
                    background: `linear-gradient(to left, transparent, ${theme.palette.primary.main})`,
                })}
            />
        </Box>
    );
}
