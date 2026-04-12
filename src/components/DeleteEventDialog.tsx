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
import { ferrariTokens } from '@/theme';
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
            PaperProps={{
                sx: {
                    backgroundColor: ferrariTokens.colors.carbon,
                    border: `1px solid ${ferrariTokens.colors.redDeep}`,
                    borderRadius: 2,
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontFamily: ferrariTokens.fonts.display,
                    fontWeight: 700,
                    fontSize: '1.3rem',
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
                <DeleteOutlineIcon sx={{ fontSize: '1.3rem' }} />
                Xoá kỉ niệm
            </DialogTitle>

            <DialogContent sx={{ pt: '20px !important', pb: 1 }}>
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

                <Typography
                    sx={{
                        fontFamily: ferrariTokens.fonts.sans,
                        color: ferrariTokens.colors.muted,
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                    }}
                >
                    Xoá kỉ niệm{' '}
                    <Typography
                        component="span"
                        sx={{
                            fontFamily: ferrariTokens.fonts.display,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: ferrariTokens.colors.white,
                        }}
                    >
                        {event?.name}
                    </Typography>
                    {dateLabel && (
                        <>
                            {' '}(
                            <Typography
                                component="span"
                                sx={{ color: ferrariTokens.colors.gold, fontWeight: 600 }}
                            >
                                {dateLabel}
                            </Typography>
                            )
                        </>
                    )}
                    ? Không lấy lại được đâu nha.
                </Typography>
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
                    disabled={deleting}
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: ferrariTokens.colors.muted,
                        '&:hover': { color: ferrariTokens.colors.white },
                    }}
                >
                    Huỷ
                </Button>
                <Button
                    onClick={handleDelete}
                    disabled={deleting || !event?.id}
                    variant="contained"
                    startIcon={
                        deleting ? (
                            <CircularProgress size={14} thickness={3} sx={{ color: ferrariTokens.colors.white }} />
                        ) : (
                            <DeleteOutlineIcon />
                        )
                    }
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        backgroundColor: ferrariTokens.colors.red,
                        color: ferrariTokens.colors.white,
                        '&:hover': { backgroundColor: ferrariTokens.colors.redBright },
                        '&.Mui-disabled': {
                            backgroundColor: ferrariTokens.colors.subtle,
                            color: ferrariTokens.colors.muted,
                        },
                    }}
                >
                    {deleting ? 'Đang xoá…' : 'Xoá'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
