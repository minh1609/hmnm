import { Box, Typography } from '@mui/material';

export function HeartDivider() {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#c2185b',
                opacity: 0.45,
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, #c2185b)',
                }}
            />
            <Typography
                component="span"
                sx={{ fontSize: '0.6rem', letterSpacing: '3px' }}
            >
                ♥
            </Typography>
            <Box
                sx={{
                    width: 48,
                    height: '1px',
                    background: 'linear-gradient(to left, transparent, #c2185b)',
                }}
            />
        </Box>
    );
}
