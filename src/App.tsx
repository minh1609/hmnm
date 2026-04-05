import './App.css';
import { datingTimeline } from '@/data';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Chip, Typography } from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AcUnitIcon from '@mui/icons-material/AcUnit';

type SeasonInfo = {
    icon: React.ReactElement;
    color: string;
    bgColor: string;
};

function getSeason(date: Date): SeasonInfo {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5)
        return {
            icon: <LocalFloristIcon sx={{ fontSize: 14 }} />,
            color: '#a855f7',
            bgColor: '#f3e8ff',
        };
    if (month >= 6 && month <= 8)
        return {
            icon: <WbSunnyIcon sx={{ fontSize: 14 }} />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
        };
    if (month >= 9 && month <= 11)
        return {
            icon: <EnergySavingsLeafIcon sx={{ fontSize: 14 }} />,
            color: '#ea580c',
            bgColor: '#ffedd5',
        };
    return {
        icon: <AcUnitIcon sx={{ fontSize: 14 }} />,
        color: '#3b82f6',
        bgColor: '#dbeafe',
    };
}

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
