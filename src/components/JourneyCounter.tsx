import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { ferrariTokens } from '@/theme';

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
    const { colors: c, fonts: f } = ferrariTokens;
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0,
                px: { xs: 2.5, sm: 3.5 },
                pt: { xs: 1.5, sm: 2 },
                pb: { xs: 1, sm: 1.5 },
                borderRadius: '4px',
                background: `linear-gradient(175deg, ${c.redDeep} 0%, ${c.redDark} 100%)`,
                border: `1px solid rgba(0,0,0,0.3)`,
                borderTop: `3px solid ${c.gold}`,
                minWidth: { xs: 78, sm: 110 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${c.goldGlow}, transparent)`,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent 0%, #a07830 30%, ${c.goldLight} 50%, #a07830 70%, transparent 100%)`,
                    opacity: 0.6,
                },
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 8px 28px ${c.goldGlow}`,
                    borderTop: `3px solid ${c.goldLight}`,
                },
                ...sx,
            }}
        >
            {live && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 7,
                        right: 8,
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        backgroundColor: c.goldLight,
                        animation: 'ferrariPulse 1.4s infinite',
                        '@keyframes ferrariPulse': {
                            '0%, 100%': {
                                opacity: 1,
                                boxShadow: `0 0 4px ${c.gold}`,
                            },
                            '50%': { opacity: 0.25, boxShadow: 'none' },
                        },
                    }}
                />
            )}
            <Typography
                sx={{
                    fontFamily: f.display,
                    fontWeight: 900,
                    fontSize: { xs: '2.2rem', sm: '3rem' },
                    lineHeight: 1,
                    color: c.white,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                    textShadow: `0 0 20px ${c.goldGlow}`,
                }}
            >
                {value.toLocaleString()}
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${c.goldGlow}, transparent)`,
                    my: 0.6,
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    color: c.white,
                    textAlign: 'center',
                    fontSize: { xs: '0.58rem', sm: '0.65rem' },
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
            <Typography
                sx={(theme) => ({
                    fontFamily: ferrariTokens.fonts.display,
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.6rem' },
                    lineHeight: 1,
                    color: theme.palette.primary.main,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    textShadow: `0 0 24px ${theme.palette.primary.dark}88, 0 2px 4px rgba(0,0,0,0.6)`,
                    userSelect: 'none',
                })}
            >
                The Journey So Far
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
