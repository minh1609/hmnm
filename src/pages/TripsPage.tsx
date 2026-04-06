import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightIcon from '@mui/icons-material/Flight';
import PlaceIcon from '@mui/icons-material/Place';
import { useNavigate } from 'react-router-dom';
import { trips } from '@/data';
import { ferrariTokens } from '@/theme';
import { FallingObjects } from '@/components/FallingObjects';

function formatDateRange(start: Date, end: Date): string {
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-GB', opts)} — ${end.toLocaleDateString('en-GB', opts)}`;
}

function durationDays(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function TripsPage() {
    const navigate = useNavigate();
    const { colors: c, fonts: f } = ferrariTokens;

    return (
        <>
            <FallingObjects />

            <Box sx={{ minHeight: '100vh', pb: 6 }}>
                {/* Header */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        backgroundColor: c.red,
                        px: { xs: 2, sm: 4 },
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderBottom: `1px solid ${c.redDeep}`,
                        boxShadow: `0 2px 16px rgba(0,0,0,0.5)`,
                    }}
                >
                    <IconButton
                        onClick={() => navigate('/')}
                        sx={{
                            color: c.gold,
                            border: `1px solid ${c.gold}`,
                            borderRadius: '4px',
                            p: 0.75,
                            '&:hover': {
                                backgroundColor: `${c.goldGlow}`,
                                borderColor: c.goldLight,
                            },
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FlightIcon
                            sx={{
                                color: c.gold,
                                fontSize: '1.6rem',
                                transform: 'rotate(-45deg)',
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: f.display,
                                fontWeight: 900,
                                fontSize: { xs: '1.6rem', sm: '2.2rem' },
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: c.white,
                                textShadow: `0 0 20px ${c.goldGlow}`,
                                lineHeight: 1,
                            }}
                        >
                            Trips Together
                        </Typography>
                    </Box>

                    <Box sx={{ ml: 'auto' }}>
                        <Box
                            sx={{
                                fontFamily: f.display,
                                fontSize: '0.7rem',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: c.muted,
                                textAlign: 'right',
                            }}
                        >
                            {trips.length} trip{trips.length !== 1 ? 's' : ''}
                        </Box>
                    </Box>
                </Box>

                {/* Trip cards */}
                <Box
                    sx={{
                        maxWidth: 680,
                        mx: 'auto',
                        px: { xs: 2, sm: 4 },
                        pt: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {trips.map((trip) => (
                        <Box
                            key={trip.name}
                            sx={{
                                borderRadius: '6px',
                                background: `linear-gradient(160deg, ${c.redDeep} 0%, ${c.redDark} 100%)`,
                                border: `1px solid ${c.border}`,
                                borderTop: `3px solid ${c.gold}`,
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 6px 28px rgba(0,0,0,0.5)',
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${c.goldGlow}, transparent)`,
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent 0%, #a07830 30%, ${c.goldLight} 50%, #a07830 70%, transparent 100%)`,
                                    opacity: 0.6,
                                },
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 12px 40px ${c.goldGlow}`,
                                },
                            }}
                        >
                            {/* Card header row */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    px: { xs: 2.5, sm: 3.5 },
                                    pt: { xs: 2, sm: 2.5 },
                                    pb: 1,
                                }}
                            >
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                        <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{trip.flag}</Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: f.display,
                                                fontWeight: 900,
                                                fontSize: { xs: '1.5rem', sm: '1.9rem' },
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                color: c.white,
                                                lineHeight: 1,
                                            }}
                                        >
                                            {trip.name}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <PlaceIcon sx={{ color: c.gold, fontSize: '0.95rem' }} />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: c.gold,
                                                letterSpacing: '0.08em',
                                                fontSize: '0.7rem',
                                            }}
                                        >
                                            {trip.destination}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Duration badge */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        background: `rgba(0,0,0,0.3)`,
                                        border: `1px solid ${c.border}`,
                                        borderRadius: '4px',
                                        px: 1.5,
                                        py: 0.75,
                                        minWidth: 56,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: f.display,
                                            fontWeight: 900,
                                            fontSize: '1.6rem',
                                            lineHeight: 1,
                                            color: c.white,
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {durationDays(trip.startDate, trip.endDate)}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: c.muted,
                                            fontSize: '0.58rem',
                                            letterSpacing: '0.1em',
                                        }}
                                    >
                                        DAYS
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Date range */}
                            <Box
                                sx={{
                                    px: { xs: 2.5, sm: 3.5 },
                                    pb: 1.5,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: c.muted,
                                        fontSize: '0.68rem',
                                        letterSpacing: '0.06em',
                                    }}
                                >
                                    {formatDateRange(trip.startDate, trip.endDate)}
                                </Typography>
                            </Box>

                            {/* Divider */}
                            <Box
                                sx={{
                                    mx: { xs: 2.5, sm: 3.5 },
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${c.goldGlow}, transparent)`,
                                    mb: 2,
                                }}
                            />

                            {/* Highlights */}
                            <Box
                                sx={{
                                    px: { xs: 2.5, sm: 3.5 },
                                    pb: { xs: 2.5, sm: 3 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.75,
                                }}
                            >
                                {trip.highlights.map((hl, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: '50%',
                                                backgroundColor: c.gold,
                                                mt: '7px',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontFamily: f.sans,
                                                fontSize: { xs: '0.82rem', sm: '0.88rem' },
                                                color: c.white,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {hl}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}

                    {trips.length === 0 && (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: f.script,
                                    fontSize: '2rem',
                                    color: c.muted,
                                }}
                            >
                                More adventures to come ✈️
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
}
