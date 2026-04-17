import { Box, Typography, Dialog, DialogContent } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { useTheme } from '@mui/material/styles';
import type { Trip } from '@/types';
import { getTripTypeStyle } from '@/utils';

function formatDateRange(start: Date, end: Date): string {
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-GB', opts)} — ${end.toLocaleDateString('en-GB', opts)}`;
}

function durationDays(start: Date, end: Date): number {
    return Math.max(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)), 1);
}

interface TripDetailDialogProps {
    trip: Trip | null;
    onClose: () => void;
}

export function TripDetailDialog({ trip, onClose }: TripDetailDialogProps) {
    const {
        tokens: { colors: c, fonts: f },
    } = useTheme();

    const ts = trip ? getTripTypeStyle(trip.type) : null;

    return (
        <Dialog
            open={!!trip}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    background: c.surface,
                    border: `1px solid ${c.border}`,
                    borderTop: `3px solid ${ts?.pin ?? c.burgundy}`,
                    overflow: 'hidden',
                    m: { xs: 2, sm: 4 },
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${ts?.halo ?? c.roseGlow}, transparent)`,
                        zIndex: 1,
                    },
                },
            }}
        >
            {trip && (
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    {/* Header */}
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
                        <Box sx={{ flex: 1, pr: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                                <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{trip.flag}</Typography>
                                <Typography
                                    sx={{
                                        fontFamily: f.display,
                                        fontWeight: 700,
                                        fontSize: { xs: '1.4rem', sm: '1.9rem' },
                                        letterSpacing: '-0.02em',
                                        color: c.ink,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {trip.name}
                                </Typography>
                                {trip.type === 'plan' && (
                                    <Typography
                                        sx={{
                                            fontFamily: f.sans,
                                            fontSize: '0.62rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.12em',
                                            color: ts?.pin ?? c.brown,
                                            background: ts?.glow ?? c.brownGlow,
                                            border: `1px solid ${ts?.halo ?? c.brownGlow}`,
                                            borderRadius: '4px',
                                            px: 1,
                                            py: 0.4,
                                            lineHeight: 1.4,
                                            alignSelf: 'center',
                                        }}
                                    >
                                        FUTURE
                                    </Typography>
                                )}
                            </Box>

                            {trip.destinations && trip.destinations.length > 0 && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        flexWrap: 'wrap',
                                    }}
                                >
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
                                                {i < trip.destinations!.length - 1 && ', '}
                                            </Box>
                                        ))}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Duration badge */}
                        {trip.startDate && trip.endDate && (
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
                                    mr: 4,
                                    flexShrink: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: f.display,
                                        fontWeight: 700,
                                        fontSize: '1.6rem',
                                        lineHeight: 1,
                                        color: ts?.pin ?? c.burgundy,
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
                        )}
                    </Box>

                    {/* Date range */}
                    {trip.startDate && trip.endDate && (
                        <Box sx={{ px: { xs: 2.5, sm: 3.5 }, pb: trip.notes ? 1.5 : 2.5 }}>
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
                    )}

                    {/* Notes */}
                    {trip.notes && (
                        <>
                            <Box
                                sx={{
                                    mx: { xs: 2.5, sm: 3.5 },
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
                                    mb: 2,
                                }}
                            />
                            <Box sx={{ px: { xs: 2.5, sm: 3.5 }, pb: { xs: 2.5, sm: 3 } }}>
                                <Typography
                                    sx={{
                                        fontFamily: f.display,
                                        fontStyle: 'italic',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        color: c.inkMuted,
                                        lineHeight: 1.65,
                                    }}
                                >
                                    {trip.notes}
                                </Typography>
                            </Box>
                        </>
                    )}

                    {/* Bottom accent */}
                    <Box
                        sx={{
                            height: '2px',
                            background: ts?.gradient,
                            opacity: 0.5,
                        }}
                    />
                </DialogContent>
            )}
        </Dialog>
    );
}
