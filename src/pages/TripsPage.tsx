import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useTrips } from '@/hooks/useTrips';
import { useTheme } from '@mui/material/styles';
import { PageHeader } from '@/components/PageHeader';
import { TripDetailDialog } from '@/components/TripDetailDialog';
import type { Trip } from '@/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export function TripsPage() {
    const { trips } = useTrips();
    const {
        tokens: { colors: c, fonts: f },
    } = useTheme();
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const mappedTrips = trips;

    return (
        <>
            <Box sx={{ minHeight: '100vh', pb: 6, backgroundColor: c.cream }}>
                <PageHeader
                    title={`Trips Together · ${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
                />

                {/* World map */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        background: `linear-gradient(180deg, ${c.creamDark} 0%, ${c.panel} 100%)`,
                        borderBottom: `1px solid ${c.border}`,
                    }}
                >
                    <ComposableMap
                        projectionConfig={{ scale: 147, center: [0, 10] }}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    >
                        <Geographies geography={GEO_URL}>
                            {({ geographies }: { geographies: unknown[] }) =>
                                geographies.map((geo: unknown) => (
                                    <Geography
                                        key={(geo as { rsmKey: string }).rsmKey}
                                        geography={geo}
                                        fill={c.panel}
                                        stroke={c.border}
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: 'none' },
                                            hover: { outline: 'none', fill: c.borderSubtle },
                                            pressed: { outline: 'none' },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>

                        {mappedTrips.map(trip => (
                                    <Marker
                                        key={trip.name}
                                        coordinates={trip.coordinates}
                                onClick={() => setSelectedTrip(trip)}
                            >
                                {/* Pulsing halo */}
                                <circle r={12} fill={c.burgundyGlow} stroke="none">
                                    <animate
                                        attributeName="r"
                                        from={8}
                                        to={20}
                                        dur="2.2s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        from={0.55}
                                        to={0}
                                        dur="2.2s"
                                        repeatCount="indefinite"
                                    />
                                </circle>

                                {/* Pin dot */}
                                <circle
                                    r={7}
                                    fill={c.burgundy}
                                    stroke={c.surface}
                                    strokeWidth={2}
                                    style={{ cursor: 'pointer' }}
                                />

                                {/* Flag above pin */}
                                <text
                                    textAnchor="middle"
                                    y={-16}
                                    style={{
                                        fontSize: '16px',
                                        userSelect: 'none',
                                        cursor: 'pointer',
                                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.18))',
                                    }}
                                >
                                    {trip.flag}
                                </text>
                            </Marker>
                        ))}
                    </ComposableMap>

                    {trips.length === 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: f.display,
                                    fontStyle: 'italic',
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                    color: c.inkMuted,
                                    textAlign: 'center',
                                    px: 4,
                                }}
                            >
                                More adventures to come ✈️
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Hint */}
                <Box sx={{ textAlign: 'center', pt: 2.5, pb: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: c.inkSubtle,
                            letterSpacing: '0.1em',
                            fontSize: '0.65rem',
                            fontFamily: f.sans,
                        }}
                    >
                        TAP A PIN TO EXPLORE THE TRIP
                    </Typography>
                </Box>

                {/* Trip pills row */}
                {mappedTrips.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            justifyContent: 'center',
                            px: { xs: 2, sm: 4 },
                            pt: 1,
                            pb: 2,
                        }}
                    >
                        {mappedTrips.map(trip => (
                            <Box
                                key={trip.name}
                                onClick={() => setSelectedTrip(trip)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: '24px',
                                    border: `1px solid ${c.border}`,
                                    background: c.surface,
                                    cursor: 'pointer',
                                    transition: 'all 0.18s ease',
                                    boxShadow: `0 2px 8px ${c.burgundyGlowFaint}`,
                                    '&:hover': {
                                        borderColor: c.burgundy,
                                        background: c.panel,
                                        boxShadow: `0 4px 16px ${c.burgundyGlow}`,
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
                                    {trip.flag}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: f.sans,
                                        fontSize: '0.8rem',
                                        color: c.ink,
                                        fontWeight: 500,
                                        maxWidth: 180,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {trip.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Trip detail dialog */}
            <TripDetailDialog trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
        </>
    );
}
