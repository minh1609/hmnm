import './App.css';
import { useRef, useState } from 'react';
import { datingTimeline } from '@/data';
import { getSeason } from '@/utils';

import { HeartDivider } from '@/components/HeartDivider';
import { JourneyCounter } from '@/components/JourneyCounter';
import { ferrariTokens } from '@/theme';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Box, Chip, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

const years = Object.keys(datingTimeline).map(Number);

const yearSx = (active: boolean): SxProps<Theme> => (theme) => ({
    fontFamily: theme.typography.h2.fontFamily,
    fontWeight: active ? 900 : 600,
    fontSize: active ? '1.9rem' : '1.25rem',
    color: active ? 'primary.main' : 'text.secondary',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    borderBottom: active
        ? `2px solid ${theme.palette.primary.main}`
        : '2px solid transparent',
    pb: '2px',
    '&:hover': { color: 'primary.main', opacity: 1 },
});

function App() {
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
    const prevYearRef = useRef(years[0]);

    const handleYearSelect = (year: number) => {
        if (year === selectedYear) return;
        setSlideDir(year > prevYearRef.current ? 'left' : 'right');
        prevYearRef.current = year;
        setSelectedYear(year);
    };

    const descRef = useRef<HTMLDivElement>(null);

    // Retrigger the enter animation without remounting
    const prevDescYear = useRef(selectedYear);
    if (prevDescYear.current !== selectedYear) {
        prevDescYear.current = selectedYear;
        if (descRef.current) {
            descRef.current.classList.remove('year-desc-enter');
            void descRef.current.offsetHeight; // force reflow
            descRef.current.classList.add('year-desc-enter');
        }
    }

    const currentTimeline = datingTimeline[selectedYear];

    return (
        <>
            <JourneyCounter />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 3,
                    pb: 1,
                }}
            >
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {years.map((year) => (
                        <Box
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            sx={yearSx(year === selectedYear)}
                        >
                            {year}
                        </Box>
                    ))}
                </Box>
            </Box>

            {datingTimeline[selectedYear].description && (
                <Box
                    ref={descRef}
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
                    <HeartDivider />
                    <Typography
                        sx={(theme) => ({
                            fontFamily: ferrariTokens.fonts.script,
                            fontWeight: 400,
                            fontSize: '2.4rem',
                            lineHeight: 1.15,
                            letterSpacing: '0.03em',
                            color: 'primary.main',
                            textShadow: `0 1px 12px ${theme.palette.primary.dark}55`,
                            userSelect: 'none',
                        })}
                    >
                        {datingTimeline[selectedYear].description}
                    </Typography>
                </Box>
            )}

            <Box
                key={`timeline-${selectedYear}`}
                className={
                    slideDir === 'left'
                        ? 'timeline-slide-left'
                        : 'timeline-slide-right'
                }
                sx={{ overflow: 'hidden' }}
            >
                <Timeline position="alternate">
                    {currentTimeline.events.map((event) => {
                        const season = getSeason(event.date);
                        return (
                            <TimelineItem key={event.date.toISOString()}>
                                <TimelineOppositeContent color="text.secondary">
                                    <Typography fontWeight="bold"></Typography>
                                    <Chip
                                        size="small"
                                        icon={season.icon}
                                        label={event.date
                                            .toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            .replace(/\//g, '-')}
                                        sx={{
                                            backgroundColor: season.bgColor,
                                            color: season.color,
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            cursor: 'default',
                                            transition:
                                                'transform 0.15s ease, box-shadow 0.15s ease',
                                            '&:hover': {
                                                transform: 'scale(1.12)',
                                                boxShadow:
                                                    '0 2px 8px rgba(0,0,0,0.18)',
                                            },
                                            '& .MuiChip-icon': {
                                                color: season.color,
                                            },
                                        }}
                                    />
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot
                                        sx={{
                                            backgroundColor:
                                                ferrariTokens.colors.gold,
                                            borderColor:
                                                ferrariTokens.colors.goldLight,
                                            boxShadow: `0 0 8px ${ferrariTokens.colors.goldGlow}`,
                                        }}
                                    />
                                    <TimelineConnector
                                        sx={{
                                            backgroundColor:
                                                ferrariTokens.colors.gold,
                                            opacity: 0.35,
                                        }}
                                    />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography
                                        fontWeight={700}
                                        sx={(theme) => ({
                                            fontFamily:
                                                theme.typography.h3.fontFamily,
                                            fontSize: '1.05rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            color: 'primary.main',
                                            cursor: 'default',
                                        })}
                                    >
                                        {event.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '0.82rem',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {event.des}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            </Box>
        </>
    );
}

export default App;
