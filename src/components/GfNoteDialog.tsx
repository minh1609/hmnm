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
    const theme = useTheme();
    const { colors: c } = theme.tokens;

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
            invalidateTimelineCache();
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
            disableScrollLock
            PaperProps={{ sx: dialogPaperSx(theme, c.rose) }}
        >
            <DialogTitle sx={dialogTitleSx(theme, c.burgundy)}>
                <FavoriteIcon sx={{ fontSize: '1.2rem' }} />
                {event?.name}
            </DialogTitle>

            <DialogContent sx={{ pt: '24px !important', pb: 1 }}>
                {error && (
                    <Alert severity="error" sx={errorAlertSx(theme)}>
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
                    sx={textFieldSx(theme, c.burgundy)}
                />
            </DialogContent>

            <DialogActions sx={dialogActionsSx(theme)}>
                <Button
                    onClick={handleClose}
                    disabled={saving}
                    sx={secondaryButtonSx(theme)}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={saving}
                    variant="contained"
                    startIcon={
                        saving ? (
                            <CircularProgress size={14} thickness={3} sx={{ color: c.white }} />
                        ) : (
                            <FavoriteIcon />
                        )
                    }
                    sx={primaryButtonSx(theme, c.burgundy, c.burgundyLight)}
                >
                    {saving ? 'Saving…' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
