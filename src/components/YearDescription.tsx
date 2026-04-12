import { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { ferrariTokens } from '@/theme';

interface YearDescriptionProps {
    description?: string;
}

export const YearDescription = forwardRef<HTMLDivElement, YearDescriptionProps>(
    ({ description }, ref) => {
        if (!description) return null;

        return (
            <Box
                ref={ref}
                className="year-desc-enter"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 1.5,
                    mb: 0.5,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        fontSize: '1.6rem',
                        lineHeight: 1.1,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        textShadow: `0 0 16px ${ferrariTokens.colors.goldGlow}, 0 2px 4px rgba(0,0,0,0.5)`,
                        userSelect: 'none',
                    }}
                >
                    🏁 {description}
                </Typography>
            </Box>
        );
    },
);

YearDescription.displayName = 'YearDescription';
