import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTrips } from '@/hooks/useTrips';

const FIRST_DATE = new Date('2025-08-26T00:00:00');

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
    onClick?: () => void;
    sx?: SxProps<Theme>;
}

function StatCard({ value, label, live, onClick, sx }: StatCardProps) {
    const { tokens: { colors: c, fonts: f } } = useTheme();
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0,
                px: { xs: 2.5, sm: 3.5 },
                pt: { xs: 1.5, sm: 2 },
                pb: { xs: 1, sm: 1.5 },
                borderRadius: '8px',
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderTop: `3px solid ${c.burgundy}`,
                flex: 1,
                minWidth: 0,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: `0 2px 10px ${c.burgundyGlowFaint}`,
                cursor: onClick ? 'pointer' : 'default',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${c.roseGlow}, transparent)`,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent 0%, ${c.rose} 30%, ${c.roseDark} 50%, ${c.rose} 70%, transparent 100%)`,
                    opacity: 0.4,
                },
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 8px 24px ${c.burgundyGlow}`,
                    borderTop: `3px solid ${c.burgundyLight}`,
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
                        backgroundColor: c.burgundy,
                        animation: 'heritagePulse 1.4s infinite',
                        '@keyframes heritagePulse': {
                            '0%, 100%': {
                                opacity: 1,
                                boxShadow: `0 0 4px ${c.burgundyGlow}`,
                            },
                            '50%': { opacity: 0.25, boxShadow: 'none' },
                        },
                    }}
                />
            )}
            <Typography
                sx={{
                    fontFamily: f.display,
                    fontWeight: 700,
                    fontSize: { xs: '2.2rem', sm: '3rem' },
                    lineHeight: 1,
                    color: c.burgundy,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                {value.toLocaleString()}
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
                    my: 0.6,
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    color: c.inkMuted,
                    textAlign: 'center',
                    fontSize: { xs: '0.58rem', sm: '0.65rem' },
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

interface JourneyCounterProps {
    /** Optional heading rendered above the stat cards. Omit to hide the title entirely. */
    title?: string;
}

export function JourneyCounter({ title }: JourneyCounterProps) {
    const [values, setValues] = useState(getCounterValues());
    const { trips } = useTrips();
    const navigate = useNavigate();
    const { tokens: { colors: c, fonts: f } } = useTheme();

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
                mt: title ? 5 : 2,
            }}
        >
            {title && (
                <Typography
                    sx={{
                        fontFamily: f.display,
                        fontWeight: 700,
                        fontStyle: 'italic',
                        fontSize: { xs: '2rem', sm: '2.6rem' },
                        lineHeight: 1,
                        color: c.ink,
                        letterSpacing: '-0.02em',
                        userSelect: 'none',
                    }}
                >
                    {title}
                </Typography>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    width: '100%',
                    justifyContent: 'space-evenly',
                    gap: { xs: 1, sm: 2 },
                    mt: 0.5,
                    cursor: 'default',
                }}
            >
                <StatCard value={values.days} label="Days Shared" />
                <StatCard value={values.hoursToday} label="Hours Today" live />
                <StatCard value={values.minutesPast} label="Minutes Past" live />
                <StatCard value={trips.length} label="Trips Taken" onClick={() => navigate('/trips')} />
            </Box>
        </Box>
    );
}
