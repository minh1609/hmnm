import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { invalidateTimelineCache } from '@/hooks/useTimeline';
import { useTheme } from '@mui/material/styles';
import {
    dialogPaperSx,
    dialogTitleSx,
    dialogActionsSx,
    secondaryButtonSx,
    primaryButtonSx,
    errorAlertSx,
} from '@/styles/appStyles';
import type { TimelineEvent } from '@/types';

interface Props {
    event: TimelineEvent | null;
    onClose: () => void;
    onDeleted: () => void;
}

export function DeleteEventDialog({ event, onClose, onDeleted }: Props) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const { palette: p, tokens: { colors: c, fonts: f } } = theme;

    const handleClose = () => {
        if (deleting) return;
        setError(null);
        onClose();
    };

    const handleDelete = async () => {
        if (!event?.id) return;

        setDeleting(true);
        setError(null);

        try {
            await deleteDoc(doc(db, 'timeline_events', event.id));
            invalidateTimelineCache();
            onDeleted();
            onClose();
        } catch (err) {
            console.error('[DeleteEventDialog] failed to delete event:', err);
            setError('Failed to delete event. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const dateLabel = event?.date
        .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        .replace(/\//g, '-');

    return (
        <Dialog
            open={event !== null}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            disableScrollLock
            PaperProps={{ sx: dialogPaperSx(theme, c.border) }}
        >
            <DialogTitle sx={dialogTitleSx(theme, p.primary.main)}>
                <DeleteOutlineIcon sx={{ fontSize: '1.3rem' }} />
                Delete
            </DialogTitle>

            <DialogContent sx={{ pt: '20px !important', pb: 1 }}>
                {error && (
                    <Alert severity="error" sx={errorAlertSx(theme)}>
                        {error}
                    </Alert>
                )}

                <Typography
                    sx={{
                        fontFamily: f.sans,
                        color: c.inkMuted,
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                    }}
                >
                    Delete{' '}
                    <Typography
                        component="span"
                        sx={{
                            fontFamily: f.display,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            color: c.ink,
                        }}
                    >
                        {event?.name}
                    </Typography>
                    {dateLabel && (
                        <>
                            {' '}
                            (
                            <Typography component="span" sx={{ color: p.tertiary.main, fontWeight: 600 }}>
                                {dateLabel}
                            </Typography>
                            )
                        </>
                    )}
                    ? This cannot be undone.
                </Typography>
            </DialogContent>

            <DialogActions sx={dialogActionsSx(theme)}>
                <Button onClick={handleClose} disabled={deleting} sx={secondaryButtonSx(theme)}>
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    disabled={deleting || !event?.id}
                    variant="contained"
                    startIcon={
                        deleting ? (
                            <CircularProgress size={14} thickness={3} sx={{ color: c.white }} />
                        ) : (
                            <DeleteOutlineIcon />
                        )
                    }
                    sx={primaryButtonSx(theme, p.primary.main, p.primary.light)}
                >
                    {deleting ? 'Deleting…' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
