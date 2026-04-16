import { Box, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { useTrips } from '@/hooks/useTrips';
import { tokens } from '@/theme';
import { PageHeader } from '@/components/PageHeader';
function formatDateRange(start: Date, end: Date): string {
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-GB', opts)} — ${end.toLocaleDateString('en-GB', opts)}`;
}

function durationDays(start: Date, end: Date): number {
    let duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(duration, 1);
}

export function TripsPage() {
    const { trips } = useTrips();
    const { colors: c, fonts: f } = tokens;

    return (
        <>
            <Box sx={{ minHeight: '100vh', pb: 6, backgroundColor: c.cream }}>
                <PageHeader
                    title={`Trips Together ${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
                />

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
                                borderRadius: '10px',
                                background: c.surface,
                                border: `1px solid ${c.border}`,
                                borderTop: `3px solid ${c.burgundy}`,
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: `0 4px 18px ${c.burgundyGlowFaint}`,
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${c.roseGlow}, transparent)`,
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent 0%, ${c.roseDark} 30%, ${c.rose} 50%, ${c.roseDark} 70%, transparent 100%)`,
                                    opacity: 0.5,
                                },
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 12px 32px ${c.burgundyGlow}`,
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
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{trip.flag}</Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: f.display,
                                                fontWeight: 700,
                                                fontSize: { xs: '1.5rem', sm: '1.9rem' },
                                                letterSpacing: '-0.02em',
                                                color: c.ink,
                                                lineHeight: 1,
                                                textAlign: 'left',
                                            }}
                                        >
                                            {trip.name}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                        <PlaceIcon sx={{ color: c.brown, fontSize: '0.95rem', flexShrink: 0 }} />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: c.brown,
                                                letterSpacing: '0.06em',
                                                fontSize: '0.7rem',
                                            }}
                                        >
                                            {trip.destinations.map((dest, i) => (
                                                <Box
                                                    key={i}
                                                    component={dest.googleMapLink ? 'a' : 'span'}
                                                    href={dest.googleMapLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        cursor: dest.googleMapLink ? 'pointer' : 'default',
                                                        '&:hover': dest.googleMapLink ? { opacity: 0.75 } : {},
                                                    }}
                                                >
                                                    {dest.name}
                                                    {i < trip.destinations.length - 1 && ', '}
                                                </Box>
                                            ))}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Duration badge */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        background: c.panel,
                                        border: `1px solid ${c.border}`,
                                        borderRadius: '6px',
                                        px: 1.5,
                                        py: 0.75,
                                        minWidth: 56,
                                        ml: 0.5,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: f.display,
                                            fontWeight: 700,
                                            fontSize: '1.6rem',
                                            lineHeight: 1,
                                            color: c.burgundy,
                                            letterSpacing: '-0.03em',
                                        }}
                                    >
                                        {durationDays(trip.startDate, trip.endDate)}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: c.inkMuted,
                                            fontSize: '0.58rem',
                                            letterSpacing: '0.08em',
                                        }}
                                    >
                                        DAY(S)
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
                                        color: c.inkMuted,
                                        fontSize: '0.68rem',
                                        letterSpacing: '0.04em',
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
                                    background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
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
                                                backgroundColor: c.burgundy,
                                                mt: '7px',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontFamily: f.sans,
                                                fontSize: { xs: '0.82rem', sm: '0.88rem' },
                                                color: c.ink,
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
                                    fontFamily: f.display,
                                    fontStyle: 'italic',
                                    fontSize: '2rem',
                                    color: c.inkMuted,
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
