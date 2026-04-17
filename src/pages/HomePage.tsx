import '@/App.css';
import { useRef, useState } from 'react';
import { getSeason } from '@/utils';
import { useTimeline } from '@/hooks/useTimeline';
import { useAuth } from '@/hooks/useAuth';

import { JourneyCounter } from '@/components/JourneyCounter';
import { FallingObjects } from '@/components/FallingObjects';
import { IconBurst } from '@/components/IconBurst';
import CustomTooltip from '@/components/CustomTooltip';
import { CreateEventDialog } from '@/components/CreateEventDialog';
import { DeleteEventDialog } from '@/components/DeleteEventDialog';
import { GfNoteDialog } from '@/components/GfNoteDialog';
import { AddEventFab } from '@/components/AddEventFab';
import { ScrollToTopFab } from '@/components/ScrollToTopFab';
import { YearDescription } from '@/components/YearDescription';
import { PageHeader } from '@/components/PageHeader';
import { useTheme } from '@mui/material/styles';

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
        fontWeight: active ? 700 : 400,
        fontStyle: active ? 'normal' : 'italic',
        fontSize: active ? '1.9rem' : '1.25rem',
        color: active ? theme.tokens.colors.burgundy : theme.tokens.colors.inkMuted,
        letterSpacing: '-0.02em',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        borderBottom: active ? `2px solid ${theme.tokens.colors.burgundy}` : '2px solid transparent',
        pb: '2px',
        '&:hover': { color: theme.tokens.colors.burgundy, opacity: 1 },
    });

export function HomePage() {
    const { timeline: datingTimeline, refetch } = useTimeline();
    const { isAdmin, isGf } = useAuth();
    const theme = useTheme();
    const { colors: c, fonts: f } = theme.tokens;

    const years = Object.keys(datingTimeline)
        .map(Number)
        .sort((a, b) => a - b);

    const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
    const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
    const prevYearRef = useRef(years[0]);

    const [bursts, setBursts] = useState<{ id: number; x: number; y: number; icon: string | string[] }[]>([]);
    const burstIdRef = useRef(0);

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
        const id = ++burstIdRef.current;
        setBursts((prev) => [
            ...prev,
            { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, icon: burstIcon },
        ]);
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
            <FallingObjects />

            <PageHeader title="The Journey So Far ..." showBack={false} />
            <JourneyCounter />

            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: c.cream,
                }}
            >
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
                                                boxShadow: `0 4px 14px ${season.color}66`,
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
                                            backgroundColor: event.gfNote ? c.rose : c.surface,
                                            borderColor: c.burgundy,
                                            boxShadow: `0 0 6px ${c.burgundyGlowFaint}`,
                                            cursor: isAdmin || isGf ? 'pointer' : 'default',
                                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                            ...((isAdmin || isGf) && {
                                                '&:hover': {
                                                    borderColor: c.burgundyLight,
                                                    boxShadow: `0 0 10px ${c.burgundyGlow}`,
                                                    transform: 'scale(1.3)',
                                                },
                                            }),
                                        }}
                                    />
                                    <TimelineConnector
                                        sx={{
                                            backgroundColor: c.rose,
                                        }}
                                    />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography
                                        fontWeight={600}
                                        sx={(t) => ({
                                            fontFamily: t.typography.h3.fontFamily,
                                            fontSize: '1.05rem',
                                            letterSpacing: '-0.01em',
                                            color: c.ink,
                                            cursor: 'default',
                                            display: 'inline-block',
                                            transition: 'color 0.3s ease',
                                            '&:hover': {
                                                color: c.burgundy,
                                                animation: 'breathe 4.5s ease-in-out infinite',
                                            },
                                        })}
                                    >
                                        {index % 2 == 0 && event.name}
                                        {(event.des || event.gfNote) && (
                                            <CustomTooltip
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
                                                                    color: c.rose,
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
                                                        color: c.brown,
                                                        fontSize: '1.1rem',
                                                        mb: '-2px',
                                                        mx: 0.5,
                                                        transition: 'transform 0.2s ease, color 0.2s ease',
                                                        ...(event.gfNote && {
                                                            color: c.burgundy,
                                                            filter: `drop-shadow(0 0 4px ${c.roseGlow})`,
                                                        }),
                                                        '&:hover': {
                                                            transform: 'scale(1.35)',
                                                            color: c.burgundy,
                                                        },
                                                    }}
                                                />
                                            </CustomTooltip>
                                        )}
                                        {index % 2 == 1 && event.name}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            </Box>

            {bursts.map((b) => (
                <IconBurst
                    key={b.id}
                    x={b.x}
                    y={b.y}
                    icon={b.icon}
                    onDone={() => setBursts((prev) => prev.filter((burst) => burst.id !== b.id))}
                />
            ))}

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
                        fontFamily: f.sans,
                        letterSpacing: '0.02em',
                        backgroundColor: c.creamDark,
                        color: c.ink,
                        border: `1px solid ${c.border}`,
                        '& .MuiAlert-icon': { color: c.burgundy },
                        '& .MuiAlert-action .MuiIconButton-root': { color: c.inkMuted },
                    }}
                >
                    {swipeAlert}
                </Alert>
            </Snackbar>

            {isAdmin && <AddEventFab onClick={() => setCreateDialogOpen(true)} />}
            <ScrollToTopFab />

            <Menu
                open={dotMenu !== null}
                anchorEl={dotMenu?.anchor}
                onClose={() => setDotMenu(null)}
                PaperProps={{
                    sx: {
                        backgroundColor: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: 2,
                        boxShadow: `0 8px 24px ${c.burgundyGlowFaint}`,
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
                        fontFamily: f.sans,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        fontSize: '0.85rem',
                        color: c.brown,
                        '&:hover': { backgroundColor: c.panel },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: c.brown }}>
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
                        fontFamily: f.sans,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        fontSize: '0.85rem',
                        color: c.burgundy,
                        '&:hover': { backgroundColor: c.roseGlowFaint },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: c.burgundy }}>
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
