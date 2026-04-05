import './App.css';
import { useState } from 'react';
import { datingTimeline } from '@/data';
import { getSeason } from '@/utils';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Box, Chip, Typography } from '@mui/material';

const years = Object.keys(datingTimeline).map(Number);

function App() {
    const [selectedYear, setSelectedYear] = useState(years[0]);

    const currentTimeline = datingTimeline[selectedYear];

    return (
        <>
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
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: 'italic',
                                fontWeight: year === selectedYear ? 600 : 400,
                                fontSize:
                                    year === selectedYear ? '1.8rem' : '1.2rem',
                                color:
                                    year === selectedYear
                                        ? '#b5174f'
                                        : '#c2185b',
                                opacity: year === selectedYear ? 1 : 0.45,
                                cursor: 'pointer',
                                letterSpacing: '0.02em',
                                transition: 'all 0.2s ease',
                                userSelect: 'none',
                                borderBottom:
                                    year === selectedYear
                                        ? '1.5px solid #b5174f'
                                        : '1.5px solid transparent',
                                pb: '2px',
                                '&:hover': {
                                    opacity: 1,
                                    color: '#b5174f',
                                },
                            }}
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
                                background:
                                    'linear-gradient(to right, transparent, #c2185b)',
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
                                background:
                                    'linear-gradient(to left, transparent, #c2185b)',
                            }}
                        />
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                            fontWeight: 600,
                            fontSize: '2rem',
                            letterSpacing: '0.04em',
                            color: '#b5174f',
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
                                    fontWeight={600}
                                    sx={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.05rem',
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
