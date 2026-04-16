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
import { tokens } from '@/theme';
import {
    dialogPaperSx,
    dialogTitleSx,
    dialogActionsSx,
    cancelButtonSx,
    primaryButtonSx,
    errorAlertSx,
} from '@/styles/dialogStyles';
import type { TimelineEvent } from '@/types';

interface Props {
    event: TimelineEvent | null;
    onClose: () => void;
    onDeleted: () => void;
}

export function DeleteEventDialog({ event, onClose, onDeleted }: Props) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const dateLabel = event?.date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).replace(/\//g, '-');

    return (
        <Dialog
            open={event !== null}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: dialogPaperSx(tokens.colors.border) }}
        >
            <DialogTitle sx={dialogTitleSx(tokens.colors.burgundy)}>
                <DeleteOutlineIcon sx={{ fontSize: '1.3rem' }} />
                Xoá kỉ niệm
            </DialogTitle>

            <DialogContent sx={{ pt: '20px !important', pb: 1 }}>
                {error && (
                    <Alert severity="error" sx={errorAlertSx}>
                        {error}
                    </Alert>
                )}

                <Typography
                    sx={{
                        fontFamily: tokens.fonts.sans,
                        color: tokens.colors.inkMuted,
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                    }}
                >
                    Xoá kỉ niệm{' '}
                    <Typography
                        component="span"
                        sx={{
                            fontFamily: tokens.fonts.display,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            color: tokens.colors.ink,
                        }}
                    >
                        {event?.name}
                    </Typography>
                    {dateLabel && (
                        <>
                            {' '}(
                            <Typography
                                component="span"
                                sx={{ color: tokens.colors.brown, fontWeight: 600 }}
                            >
                                {dateLabel}
                            </Typography>
                            )
                        </>
                    )}
                    ? Không lấy lại được đâu nha.
                </Typography>
            </DialogContent>

            <DialogActions sx={dialogActionsSx}>
                <Button
                    onClick={handleClose}
                    disabled={deleting}
                    sx={cancelButtonSx}
                >
                    Huỷ
                </Button>
                <Button
                    onClick={handleDelete}
                    disabled={deleting || !event?.id}
                    variant="contained"
                    startIcon={
                        deleting ? (
                            <CircularProgress size={14} thickness={3} sx={{ color: tokens.colors.white }} />
                        ) : (
                            <DeleteOutlineIcon />
                        )
                    }
                    sx={primaryButtonSx(tokens.colors.burgundy, tokens.colors.burgundyLight)}
                >
                    {deleting ? 'Đang xoá…' : 'Xoá'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
