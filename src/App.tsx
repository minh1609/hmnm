import './App.css';
import { useState } from 'react';
import { colors } from '@/theme';
import { datingTimeline } from '@/data';
import { getSeason } from '@/utils';

import { HeartDivider } from '@/components/HeartDivider';
import { JourneyCounter } from '@/components/JourneyCounter';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Box, Chip, Typography } from '@mui/material';

const years = Object.keys(datingTimeline).map(Number);

const yearSx = (active: boolean) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: active ? 600 : 400,
    fontSize: active ? '1.9rem' : '1.25rem',
    color: active ? colors.primary : '#c2185b',
    opacity: active ? 1 : 0.45,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    borderBottom: active
        ? `1.5px solid ${colors.primary}`
        : '1.5px solid transparent',
    pb: '2px',
    '&:hover': { opacity: 1, color: colors.primary },
});

function App() {
    const [selectedYear, setSelectedYear] = useState(years[0]);

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
                            onClick={() => setSelectedYear(year)}
                            sx={yearSx(year === selectedYear)}
                        >
                            {year}
                        </Box>
                    ))}
                </Box>
            </Box>

            {datingTimeline[selectedYear].description && (
                <Box
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
                        sx={{
                            fontFamily: "'Great Vibes', cursive",
                            fontWeight: 400,
                            fontSize: '2.4rem',
                            lineHeight: 1.15,
                            letterSpacing: '0.03em',
                            color: colors.primary,
                            textShadow: '0 1px 8px rgba(194,24,91,0.10)',
                            userSelect: 'none',
                        }}
                    >
                        {datingTimeline[selectedYear].description}
                    </Typography>
                </Box>
            )}

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
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography
                                    fontWeight={500}
                                    sx={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        fontSize: '1.15rem',
                                        fontStyle: 'italic',
                                        color: '#c2185b',
                                        letterSpacing: '0.3px',
                                        cursor: 'default',
                                    }}
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
        </>
    );
}

export default App;
