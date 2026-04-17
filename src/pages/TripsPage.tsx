import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { useTrips } from '@/hooks/useTrips';
import { useTheme } from '@mui/material/styles';
import { PageHeader } from '@/components/PageHeader';
import { TripDetailDialog } from '@/components/TripDetailDialog';
import type { Trip } from '@/types';
import { getTripTypeStyle } from '@/utils';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export function TripsPage() {
    const { trips } = useTrips();
    const {
        tokens: { colors: c, fonts: f },
    } = useTheme();
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const mappedTrips = trips;

    const [mapZoom, setMapZoom] = useState(1);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 10]);

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 8;

    return (
        <>
            <Box sx={{ minHeight: '100vh', pb: 6, backgroundColor: c.cream }}>
                <PageHeader
                    title={`Trips Together · ${trips.filter(t => t.type === 'trip').length} trip${trips.filter(t => t.type === 'trip').length !== 1 ? 's' : ''}`}
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
                        <ZoomableGroup
                            zoom={mapZoom}
                            center={mapCenter}
                            minZoom={MIN_ZOOM}
                            maxZoom={MAX_ZOOM}
                            onMoveEnd={({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) => {
                                setMapCenter(coordinates);
                                setMapZoom(zoom);
                            }}
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

                            {mappedTrips.map(trip => {
                                const s = 1 / mapZoom;
                                const ts = getTripTypeStyle(trip.type);
                                return (
                                    <Marker
                                        key={trip.name}
                                        coordinates={trip.coordinates}
                                        onClick={() => setSelectedTrip(trip)}
                                    >
                                        {/* Pulsing halo */}
                                        <circle r={12 * s} fill={ts.halo} stroke="none">
                                            <animate
                                                attributeName="r"
                                                from={8 * s}
                                                to={20 * s}
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
                                            r={7 * s}
                                            fill={ts.pin}
                                            stroke={c.surface}
                                            strokeWidth={2 * s}
                                            style={{ cursor: 'pointer' }}
                                        />

                                        {/* Flag above pin */}
                                        <text
                                            textAnchor="middle"
                                            y={-16 * s}
                                            style={{
                                                fontSize: `${16 * s}px`,
                                                userSelect: 'none',
                                                cursor: 'pointer',
                                                filter: `drop-shadow(0 1px 3px ${ts.halo})`,
                                            }}
                                        >
                                            {trip.flag}
                                        </text>
                                    </Marker>
                                );
                            })}
                        </ZoomableGroup>
                    </ComposableMap>

                    {/* Zoom controls */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                        }}
                    >
                        {[
                            { icon: <AddIcon fontSize="small" />, action: () => setMapZoom(z => Math.min(z * 1.5, MAX_ZOOM)) },
                            { icon: <RemoveIcon fontSize="small" />, action: () => setMapZoom(z => Math.max(z / 1.5, MIN_ZOOM)) },
                        ].map(({ icon, action }, i) => (
                            <IconButton
                                key={i}
                                onClick={action}
                                size="small"
                                sx={{
                                    width: 30,
                                    height: 30,
                                    background: c.surface,
                                    border: `1px solid ${c.border}`,
                                    color: c.inkMuted,
                                    borderRadius: '6px',
                                    boxShadow: `0 2px 6px rgba(0,0,0,0.10)`,
                                    '&:hover': {
                                        background: c.panel,
                                        color: c.burgundy,
                                        borderColor: c.burgundy,
                                    },
                                }}
                            >
                                {icon}
                            </IconButton>
                        ))}
                    </Box>

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
                        {mappedTrips.map(trip => {
                            const ts = getTripTypeStyle(trip.type);
                            return (
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
                                    boxShadow: `0 2px 8px ${ts.glow}`,
                                    '&:hover': {
                                        borderColor: ts.pin,
                                        background: c.panel,
                                        boxShadow: `0 4px 16px ${ts.halo}`,
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
                                {trip.type === 'plan' && (
                                    <Typography
                                        sx={{
                                            fontFamily: f.sans,
                                            fontSize: '0.58rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            color: ts.pin,
                                            background: ts.glow,
                                            border: `1px solid ${ts.halo}`,
                                            borderRadius: '4px',
                                            px: 0.75,
                                            py: 0.25,
                                            lineHeight: 1.4,
                                            flexShrink: 0,
                                        }}
                                    >
                                        FUTURE
                                    </Typography>
                                )}
                            </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>

            {/* Trip detail dialog */}
            <TripDetailDialog trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
        </>
    );
}
