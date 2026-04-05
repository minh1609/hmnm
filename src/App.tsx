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
import { Box, Button, Chip, Typography } from '@mui/material';

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
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {years.map((year) => (
                        <Button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            variant={
                                year === selectedYear ? 'contained' : 'outlined'
                            }
                            size="small"
                            color="error"
                            sx={{ borderRadius: '20px' }}
                        >
                            {year}
                            {datingTimeline[year].description
                                ? ` · ${datingTimeline[year].description}`
                                : ''}
                        </Button>
                    ))}
                </Box>
            </Box>

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
                                <Typography fontWeight="bold">
                                    {event.name}
                                </Typography>
                                {event.des}
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>
        </>
    );
}

export default App;
