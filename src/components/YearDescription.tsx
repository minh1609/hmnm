import { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface YearDescriptionProps {
    description?: string;
}

export const YearDescription = forwardRef<HTMLDivElement, YearDescriptionProps>(
    ({ description }, ref) => {
        const { tokens: { colors: c, fonts: f } } = useTheme();

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
                        fontFamily: f.display,
                        fontWeight: 600,
                        fontStyle: 'italic',
                        fontSize: '1.5rem',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        color: c.burgundy,
                        userSelect: 'none',
                    }}
                >
                    {description}
                </Typography>
            </Box>
        );
    },
);

YearDescription.displayName = 'YearDescription';
