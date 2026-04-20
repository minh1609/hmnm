import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
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
    icon: React.ReactNode;
    live?: boolean;
    onClick?: () => void;
    sx?: SxProps<Theme>;
}

function StatCard({ value, label, icon, live, onClick, sx }: StatCardProps) {
    const {
        palette: p,
        tokens: { colors: c, fonts: f },
    } = useTheme();
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: onClick ? 'pointer' : 'default',
                ...sx,
            }}
        >
            {/* Circle */}
            <Box
                sx={{
                    position: 'relative',
                    width: { xs: 88, sm: 112 },
                    height: { xs: 88, sm: 112 },
                    borderRadius: '50%',
                    background: c.creamDark,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
                    boxShadow: `0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 ${c.surface}`,
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: `0 8px 28px ${p.primary.glow}`,
                    },
                }}
            >
                {/* Faint watermark icon */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.055,
                        pointerEvents: 'none',
                        '& .MuiSvgIcon-root': {
                            fontSize: { xs: 52, sm: 64 },
                            color: c.ink,
                        },
                    }}
                >
                    {icon}
                </Box>

                {/* Value */}
                <Typography
                    sx={{
                        fontFamily: f.display,
                        fontWeight: 700,
                        fontStyle: 'italic',
                        fontSize: { xs: '1.6rem', sm: '2rem' },
                        lineHeight: 1,
                        color: p.primary.main,
                        letterSpacing: '-0.02em',
                        fontVariantNumeric: 'tabular-nums',
                        position: 'relative',
                        animation: 'breathe 4.5s ease-in-out infinite',
                    }}
                >
                    {value.toLocaleString()}
                </Typography>

                {/* Live pulse dot */}
                {live && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: { xs: 8, sm: 10 },
                            right: { xs: 8, sm: 10 },
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: p.secondary.main,
                            animation: 'heritagePulse 1.8s ease-in-out infinite',
                            '@keyframes heritagePulse': {
                                '0%, 100%': { opacity: 1, boxShadow: `0 0 6px ${p.secondary.glow}` },
                                '50%': { opacity: 0.25, boxShadow: 'none' },
                            },
                        }}
                    />
                )}
            </Box>

            {/* Label */}
            <Typography
                sx={{
                    fontFamily: f.sans,
                    fontWeight: 600,
                    fontSize: { xs: '0.6rem', sm: '0.65rem' },
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: c.inkSubtle,
                    textAlign: 'center',
                    userSelect: 'none',
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
    const {
        tokens: { colors: c, fonts: f },
    } = useTheme();

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
                gap: { xs: 2, sm: 2.5 },
                mt: title ? 5 : 2,
            }}
        >
            {/* Section heading */}
            <Typography
                sx={{
                    fontFamily: f.display,
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: { xs: '1.4rem', sm: '1.8rem' },
                    lineHeight: 1.1,
                    color: c.ink,
                    textAlign: 'center',
                    letterSpacing: '-0.01em',
                    userSelect: 'none',
                }}
            ></Typography>

            {/* Stat grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: { xs: 2, sm: 3 },
                    width: '100%',
                    justifyItems: 'center',
                    '@media (min-width: 480px)': {
                        gridTemplateColumns: 'repeat(4, 1fr)',
                    },
                }}
            >
                <StatCard value={values.days} label="Days Shared" icon={<CalendarTodayRoundedIcon />} />
                <StatCard value={values.hoursToday} label="Hours Today" icon={<ScheduleRoundedIcon />} live />
                <StatCard value={values.minutesPast} label="Minutes Past" icon={<TimerRoundedIcon />} live />
                <StatCard
                    value={trips.filter(t => t.type === 'trip').length}
                    label="Trips Taken"
                    icon={<ExploreRoundedIcon />}
                    onClick={() => navigate('/trips')}
                />
            </Box>
        </Box>
    );
}
