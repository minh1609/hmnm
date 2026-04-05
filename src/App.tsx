import './App.css';
import { datingTimeline } from '@/data';
import { getSeason } from '@/utils';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Chip, Typography } from '@mui/material';

function App() {
    return (
        <>
            <Timeline position="alternate">
                {datingTimeline[0].events.map((event) => {
                    const season = getSeason(event.date);
                    return (
                        <TimelineItem>
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
