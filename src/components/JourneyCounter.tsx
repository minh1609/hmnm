import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { HeartDivider } from './HeartDivider';
import { colors } from '@/theme';

const FIRST_DATE = new Date('2025-08-26T00:00:00');
const TRIPS_TAKEN = 1;

function getCounterValues() {
    const now = new Date();
    const diff = now.getTime() - FIRST_DATE.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursToday = now.getHours();
    const minutesPast = now.getMinutes();
    return { days, hoursToday, minutesPast };
}

interface StatCardProps {
    value: number;
    label: string;
    live?: boolean;
    sx?: SxProps<Theme>;
}

function StatCard({ value, label, live, sx }: StatCardProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                px: { xs: 2, sm: 4 },
                py: { xs: 2, sm: 2.5 },
                borderRadius: '16px',
                background:
                    'linear-gradient(135deg, rgba(194,24,91,0.06) 0%, rgba(181,23,79,0.03) 100%)',
                border: '1px solid rgba(194,24,91,0.14)',
                minWidth: { xs: 68, sm: 100 },
                position: 'relative',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(194,24,91,0.12)',
                },
                ...sx,
            }}
        >
            {live && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 10,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#c2185b',
                        opacity: 0.7,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
                            '50%': { opacity: 0.3, transform: 'scale(0.6)' },
                        },
                    }}
                />
            )}
            <Typography
                sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.8rem' },
                    lineHeight: 1,
                    color: colors.primary,
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                {value.toLocaleString()}
            </Typography>
            <Typography
                sx={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: { xs: '0.65rem', sm: '0.72rem' },
                    fontWeight: 600,
                    color: '#c2185b',
                    opacity: 0.7,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

export function JourneyCounter() {
    const [values, setValues] = useState(getCounterValues());

    useEffect(() => {
        const timer = setInterval(() => setValues(getCounterValues()), 30000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 3,
            }}
        >
            <HeartDivider />

            <Typography
                sx={{
                    fontFamily: "'Great Vibes', cursive",
                    fontWeight: 400,
                    fontSize: { xs: '2.4rem', sm: '3rem' },
                    lineHeight: 1.1,
                    color: colors.primary,
                    letterSpacing: '0.02em',
                    textShadow: '0 1px 10px rgba(194,24,91,0.13)',
                    userSelect: 'none',
                }}
            >
                The Journey So Far ...
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    mt: 0.5,
                    cursor: 'default',
                }}
            >
                <StatCard value={values.days} label="Days Shared" />
                <StatCard value={values.hoursToday} label="Hours Today" live />
                <StatCard
                    value={values.minutesPast}
                    label="Minutes Past"
                    live
                />
                <StatCard
                    sx={{ cursor: 'pointer' }}
                    value={TRIPS_TAKEN}
                    label="Trips Taken"
                />
            </Box>
        </Box>
    );
}
