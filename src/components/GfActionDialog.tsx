import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Divider,
    Button,
    CircularProgress,
    TextField,
    Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { invalidateTimelineCache } from '@/hooks/useTimeline';
import { useTheme } from '@mui/material/styles';
import {
    dialogPaperSx,
    dialogTitleSx,
    dialogActionsSx,
    secondaryButtonSx,
    primaryButtonSx,
    textFieldSx,
    errorAlertSx,
} from '@/styles/appStyles';
import { GfReact, GF_REACT_EMOJI } from '@/types';
import type { TimelineEvent } from '@/types';

const REACTIONS: GfReact[] = [GfReact.Heart, GfReact.Laugh, GfReact.Wow, GfReact.Sad, GfReact.Angry];

interface Props {
    event: TimelineEvent | null;
    onClose: () => void;
    onSaved: () => void;
}

export function GfActionDialog({ event, onClose, onSaved }: Props) {
    const [saving, setSaving] = useState(false);
    const [note, setNote] = useState('');
    const [pendingReact, setPendingReact] = useState<GfReact | null | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const { palette: p, tokens: { colors: c, fonts: f } } = theme;

    useEffect(() => {
        if (event) {
            setNote(event.gfNote ?? '');
            setPendingReact(undefined);
            setError(null);
        }
    }, [event]);

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    const handleReactToggle = (reaction: GfReact) => {
        if (saving) return;
        const current = pendingReact !== undefined ? pendingReact : event?.gfReact ?? null;
        setPendingReact(current === reaction ? null : reaction);
    };

    const handleSave = async () => {
        if (!event?.id || saving) return;
        setSaving(true);
        setError(null);

        const nextReact = pendingReact !== undefined ? pendingReact : event.gfReact ?? null;
        const nextNote = note.trim() || null;

        try {
            await updateDoc(doc(db, 'timeline_events', event.id), {
                gfReact: nextReact,
                gfNote: nextNote,
            });
            invalidateTimelineCache();
            onSaved();
            onClose();
        } catch (err) {
            console.error('[GfActionDialog] failed to save:', err);
            setError('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const activeReact = pendingReact !== undefined ? pendingReact : event?.gfReact ?? null;

    return (
        <Dialog
            open={event !== null}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            disableScrollLock
            PaperProps={{ sx: dialogPaperSx(theme, p.secondary.main) }}
        >
            <DialogTitle sx={dialogTitleSx(theme, p.primary.main)}>
                <FavoriteIcon sx={{ fontSize: '1.2rem' }} />
                {event?.name}
            </DialogTitle>

            <DialogContent sx={{ pt: '20px !important', pb: 1 }}>
                {error && (
                    <Alert severity="error" sx={errorAlertSx(theme)}>
                        {error}
                    </Alert>
                )}

                {/* ── Emoji reaction bar ── */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        fontFamily: f.sans,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: c.inkMuted,
                        textTransform: 'uppercase',
                        mb: 1.5,
                    }}
                >
                    React to this moment
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'center',
                        py: 1,
                    }}
                >
                    {REACTIONS.map((r) => {
                        const selected = activeReact === r;
                        return (
                            <Box
                                key={r}
                                component="button"
                                disabled={saving}
                                onClick={() => handleReactToggle(r)}
                                sx={{
                                    border: 'none',
                                    background: selected ? `${p.secondary.main}33` : 'transparent',
                                    borderRadius: '50%',
                                    width: 52,
                                    height: 52,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    outline: selected ? `2px solid ${p.secondary.main}` : '2px solid transparent',
                                    transition: 'transform 0.15s ease, outline 0.15s ease, background 0.15s ease',
                                    '&:hover': {
                                        transform: 'scale(1.25)',
                                        background: `${p.secondary.main}22`,
                                        outline: `2px solid ${p.secondary.main}88`,
                                    },
                                    '&:active': { transform: 'scale(0.95)' },
                                }}
                            >
                                {GF_REACT_EMOJI[r]}
                            </Box>
                        );
                    })}
                </Box>

                {activeReact && (
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            textAlign: 'center',
                            fontFamily: f.sans,
                            color: c.inkSubtle,
                            mt: 0.5,
                        }}
                    >
                        Tap again to remove
                    </Typography>
                )}

                <Divider sx={{ borderColor: c.borderSubtle, my: 2 }} />

                {/* ── Note field ── */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        fontFamily: f.sans,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: c.inkMuted,
                        textTransform: 'uppercase',
                        mb: 1.5,
                    }}
                >
                    Your note
                </Typography>

                <TextField
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Add your personal note about this moment…"
                    disabled={saving}
                    sx={textFieldSx(theme, p.primary.main)}
                />
            </DialogContent>

            <DialogActions sx={dialogActionsSx(theme)}>
                <Button onClick={handleClose} disabled={saving} sx={secondaryButtonSx(theme)}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    variant="contained"
                    startIcon={
                        saving ? (
                            <CircularProgress size={14} thickness={3} sx={{ color: c.white }} />
                        ) : (
                            <FavoriteIcon />
                        )
                    }
                    sx={primaryButtonSx(theme, p.primary.main, p.primary.light)}
                >
                    {saving ? 'Saving…' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
