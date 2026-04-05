import { Box, Typography } from '@mui/material';

export function HeartDivider() {
    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: 'white',
                opacity: 0.5,
            })}
        >
            <Typography
                component="span"
                sx={{ fontSize: '1.4rem', letterSpacing: '3px' }}
            >
                🏁
            </Typography>
        </Box>
    );
}
