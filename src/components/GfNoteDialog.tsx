import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { ferrariTokens } from '@/theme';
import type { TimelineEvent } from '@/types';

interface Props {
    event: TimelineEvent | null;
    onClose: () => void;
    onSaved: () => void;
}

export function GfNoteDialog({ event, onClose, onSaved }: Props) {
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (event) {
            setNote(event.gfNote ?? '');
            setError(null);
        }
    }, [event]);

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    const handleSubmit = async () => {
        if (!event?.id) return;
        setSaving(true);
        setError(null);
        try {
            await updateDoc(doc(db, 'timeline_events', event.id), {
                gfNote: note.trim() || null,
            });
            onSaved();
            onClose();
        } catch (err) {
            console.error('[GfNoteDialog] failed to save gfNote:', err);
            setError('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={event !== null}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: ferrariTokens.colors.carbon,
                    border: `1px solid ${ferrariTokens.colors.red}`,
                    borderRadius: 2,
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontFamily: ferrariTokens.fonts.display,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: ferrariTokens.colors.red,
                    borderBottom: `1px solid ${ferrariTokens.colors.border}`,
                    pb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <FavoriteIcon sx={{ fontSize: '1.2rem' }} />
                {event?.name}
            </DialogTitle>

            <DialogContent sx={{ pt: '24px !important', pb: 1 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            backgroundColor: ferrariTokens.colors.redDeep,
                            color: ferrariTokens.colors.white,
                            '& .MuiAlert-icon': { color: ferrariTokens.colors.goldLight },
                        }}
                    >
                        {error}
                    </Alert>
                )}
                <TextField
                    label="Your Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Add your personal note about this moment…"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            fontFamily: ferrariTokens.fonts.sans,
                            color: ferrariTokens.colors.white,
                            '& fieldset': { borderColor: ferrariTokens.colors.border },
                            '&:hover fieldset': { borderColor: ferrariTokens.colors.red },
                            '&.Mui-focused fieldset': { borderColor: ferrariTokens.colors.red },
                        },
                        '& .MuiInputLabel-root': {
                            fontFamily: ferrariTokens.fonts.display,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            color: ferrariTokens.colors.muted,
                            '&.Mui-focused': { color: ferrariTokens.colors.red },
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: ferrariTokens.colors.subtle,
                            opacity: 1,
                        },
                    }}
                />
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: `1px solid ${ferrariTokens.colors.border}`,
                    gap: 1,
                }}
            >
                <Button
                    onClick={handleClose}
                    disabled={saving}
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: ferrariTokens.colors.muted,
                        '&:hover': { color: ferrariTokens.colors.white },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={saving}
                    variant="contained"
                    startIcon={
                        saving ? (
                            <CircularProgress size={14} thickness={3} sx={{ color: ferrariTokens.colors.white }} />
                        ) : (
                            <FavoriteIcon />
                        )
                    }
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        backgroundColor: ferrariTokens.colors.red,
                        color: ferrariTokens.colors.white,
                        '&:hover': { backgroundColor: ferrariTokens.colors.redDeep },
                        '&.Mui-disabled': {
                            backgroundColor: ferrariTokens.colors.subtle,
                            color: ferrariTokens.colors.muted,
                        },
                    }}
                >
                    {saving ? 'Saving…' : 'Lưu'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
