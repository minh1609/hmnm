import '@/App.css';
import { useRef, useState } from 'react';
import { getSeason } from '@/utils';
import { useTimeline } from '@/hooks/useTimeline';
import { useAuth } from '@/hooks/useAuth';

import { JourneyCounter } from '@/components/JourneyCounter';
import { FallingObjects } from '@/components/FallingObjects';
import { IconBurst } from '@/components/IconBurst';
import FerrariTooltip from '@/components/FerrariTooltip';
import { CreateEventDialog } from '@/components/CreateEventDialog';
import { DeleteEventDialog } from '@/components/DeleteEventDialog';
import { GfNoteDialog } from '@/components/GfNoteDialog';
import { AddEventFab } from '@/components/AddEventFab';
import { YearDescription } from '@/components/YearDescription';
import { ferrariTokens } from '@/theme';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Alert, Box, Chip, Snackbar, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { SxProps, Theme } from '@mui/material';
import type { TimelineEvent } from '@/types';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const yearSx =
    (active: boolean): SxProps<Theme> =>
    (theme) => ({
        fontFamily: theme.typography.h2.fontFamily,
        fontWeight: active ? 900 : 600,
        fontSize: active ? '1.9rem' : '1.25rem',
        color: active ? 'white' : 'white',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.06em',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        borderBottom: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
        pb: '2px',
        '&:hover': { color: 'primary.main', opacity: 1 },
    });

export function HomePage() {
    const { timeline: datingTimeline, refetch } = useTimeline();
    const { isAdmin, isGf } = useAuth();
    const years = Object.keys(datingTimeline)
        .map(Number)
        .sort((a, b) => a - b);

    const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
    const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
    const prevYearRef = useRef(years[0]);

    const [kissBurst, setKissBurst] = useState<{ x: number; y: number; icon: string } | null>(null);

    const [swipeAlert, setSwipeAlert] = useState<string | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState<TimelineEvent | null>(null);
    const [editEvent, setEditEvent] = useState<TimelineEvent | null>(null);
    const [dotMenu, setDotMenu] = useState<{ anchor: HTMLElement; event: TimelineEvent } | null>(null);
    const [gfNoteEvent, setGfNoteEvent] = useState<TimelineEvent | null>(null);
    const touchStartX = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 50) return;

        const currentIndex = years.indexOf(selectedYear);
        if (delta > 0) {
            if (currentIndex === 0) {
                setSwipeAlert('Tiếc mình không gặp nhau sớm hơn');
            } else {
                handleYearSelect(years[currentIndex - 1]);
            }
        } else {
            if (currentIndex === years.length - 1) {
                setSwipeAlert('Mình còn nhiều thời gian để đi tiếp mà, từ từ em ❤️');
            } else {
                handleYearSelect(years[currentIndex + 1]);
            }
        }
    };

    const handleChipClick = (e: React.MouseEvent, burstIcon?: string) => {
        if (!burstIcon) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setKissBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, icon: burstIcon });
    };

    const handleYearSelect = (year: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (year === selectedYear) return;
        setSlideDir(year > prevYearRef.current ? 'left' : 'right');
        prevYearRef.current = year;
        setSelectedYear(year);
    };

    const descRef = useRef<HTMLDivElement>(null);

    const prevDescYear = useRef(selectedYear);
    if (prevDescYear.current !== selectedYear) {
        prevDescYear.current = selectedYear;
        if (descRef.current) {
            descRef.current.classList.remove('year-desc-enter');
            void descRef.current.offsetHeight;
            descRef.current.classList.add('year-desc-enter');
        }
    }

    const currentTimeline = datingTimeline[selectedYear];

    return (
        <>
            {import.meta.env.DEV && (
                <Box sx={{ textAlign: 'center', backgroundColor: 'warning.main', color: 'warning.contrastText', py: 0.5 }}>
                    <span>DEV MODE</span>
                </Box>
            )}
            <FallingObjects />

            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: ferrariTokens.colors.red,
                }}
            >
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
                            <Box key={year} onClick={() => handleYearSelect(year)} sx={yearSx(year === selectedYear)}>
                                {year}
                            </Box>
                        ))}
                    </Box>
                </Box>

                <YearDescription ref={descRef} description={datingTimeline[selectedYear].description} />
            </Box>

            <Box
                key={`timeline-${selectedYear}`}
                className={slideDir === 'left' ? 'timeline-slide-left' : 'timeline-slide-right'}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                sx={{ overflow: 'hidden', pb: 3 }}
            >
                <Timeline position="alternate">
                    {currentTimeline.events.map((event, index) => {
                        const season = getSeason(event.date);
                        return (
                            <TimelineItem key={event.name}>
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
                                        onClick={(e) => handleChipClick(e, event.burstIcon)}
                                        sx={{
                                            backgroundColor: season.bgColor,
                                            color: season.color,
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            cursor: event.burstIcon ? 'pointer' : 'default',
                                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                            '&:hover': {
                                                backgroundColor: season.bgColor,
                                                transform: 'scale(1.12)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                                            },
                                            '& .MuiChip-icon': {
                                                color: season.color,
                                            },
                                        }}
                                    />
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot
                                        onClick={
                                            isAdmin
                                                ? (e) => setDotMenu({ anchor: e.currentTarget, event })
                                                : isGf
                                                  ? () => setGfNoteEvent(event)
                                                  : undefined
                                        }
                                        sx={{
                                            backgroundColor: event.gfNote ? 'white' : ferrariTokens.colors.carbon,
                                            borderColor: ferrariTokens.colors.goldLight,
                                            boxShadow: `0 0 8px ${ferrariTokens.colors.goldGlow}`,
                                            cursor: isAdmin || isGf ? 'pointer' : 'default',
                                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                            ...((isAdmin || isGf) && {
                                                '&:hover': {
                                                    borderColor: ferrariTokens.colors.red,
                                                    boxShadow: `0 0 10px ${ferrariTokens.colors.redGlow}`,
                                                    transform: 'scale(1.3)',
                                                },
                                            }),
                                        }}
                                    />
                                    <TimelineConnector
                                        sx={{
                                            backgroundColor: ferrariTokens.colors.gold,
                                        }}
                                    />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography
                                        fontWeight={700}
                                        sx={(theme) => ({
                                            fontFamily: theme.typography.h3.fontFamily,
                                            fontSize: '1.05rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            color: 'white',
                                            cursor: 'default',
                                        })}
                                    >
                                        {index % 2 == 0 && event.name}
                                        {(event.des || event.gfNote) && (
                                            <FerrariTooltip
                                                title={
                                                    <>
                                                        {event.des && (
                                                            <span style={{ whiteSpace: 'pre-line' }}>{event.des}</span>
                                                        )}
                                                        {event.des && event.gfNote && <br />}
                                                        {event.gfNote && (
                                                            <span
                                                                style={{
                                                                    whiteSpace: 'pre-line',
                                                                    color: ferrariTokens.colors.red,
                                                                }}
                                                            >
                                                                {event.gfNote}
                                                            </span>
                                                        )}
                                                    </>
                                                }
                                                placement="top"
                                            >
                                                <LightbulbIcon
                                                    sx={{
                                                        color: 'white',
                                                        fontSize: '1.1rem',
                                                        mb: '-2px',
                                                        mx: 0.5,
                                                        transition: 'transform 0.2s ease',
                                                        ...(event.gfNote && {
                                                            filter: `drop-shadow(0 0 4px ${ferrariTokens.colors.gold}) drop-shadow(0 0 12px ${ferrariTokens.colors.gold}) drop-shadow(0 0 28px ${ferrariTokens.colors.goldLight}) drop-shadow(0 0 48px ${ferrariTokens.colors.goldLight})`,
                                                        }),
                                                        '&:hover': {
                                                            transform: 'scale(1.35)',
                                                            color: 'gold',
                                                        },
                                                    }}
                                                />
                                            </FerrariTooltip>
                                        )}
                                        {index % 2 == 1 && event.name}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            </Box>

            {kissBurst && (
                <IconBurst x={kissBurst.x} y={kissBurst.y} icon={kissBurst.icon} onDone={() => setKissBurst(null)} />
            )}

            <Snackbar
                open={swipeAlert !== null}
                autoHideDuration={2500}
                onClose={() => setSwipeAlert(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSwipeAlert(null)}
                    severity="info"
                    variant="filled"
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        letterSpacing: '0.05em',
                        backgroundColor: ferrariTokens.colors.redDeep,
                        color: ferrariTokens.colors.white,
                        '& .MuiAlert-icon': { color: ferrariTokens.colors.gold },
                        '& .MuiAlert-action .MuiIconButton-root': { color: ferrariTokens.colors.muted },
                    }}
                >
                    {swipeAlert}
                </Alert>
            </Snackbar>

            {isAdmin && <AddEventFab onClick={() => setCreateDialogOpen(true)} />}

            <Menu
                open={dotMenu !== null}
                anchorEl={dotMenu?.anchor}
                onClose={() => setDotMenu(null)}
                PaperProps={{
                    sx: {
                        backgroundColor: ferrariTokens.colors.carbon,
                        border: `1px solid ${ferrariTokens.colors.border}`,
                        borderRadius: 1.5,
                        backgroundImage: 'none',
                        minWidth: 140,
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        setEditEvent(dotMenu!.event);
                        setDotMenu(null);
                    }}
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        color: ferrariTokens.colors.gold,
                        '&:hover': { backgroundColor: 'rgba(197,160,80,0.12)' },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: ferrariTokens.colors.gold }}>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setDeleteEvent(dotMenu!.event);
                        setDotMenu(null);
                    }}
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        color: ferrariTokens.colors.red,
                        '&:hover': { backgroundColor: 'rgba(218,41,28,0.12)' },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: ferrariTokens.colors.red }}>
                        <DeleteOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <CreateEventDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onCreated={refetch} />

            <CreateEventDialog
                open={editEvent !== null}
                editEvent={editEvent}
                onClose={() => setEditEvent(null)}
                onCreated={refetch}
            />

            <DeleteEventDialog event={deleteEvent} onClose={() => setDeleteEvent(null)} onDeleted={refetch} />

            <GfNoteDialog event={gfNoteEvent} onClose={() => setGfNoteEvent(null)} onSaved={refetch} />
        </>
    );
}
