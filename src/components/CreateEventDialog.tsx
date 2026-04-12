import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { activeProfile } from '@/config';
import { ferrariTokens } from '@/theme';
import type { TimelineEvent } from '@/types';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
    /** When provided, the dialog operates in edit mode */
    editEvent?: TimelineEvent | null;
}

export function CreateEventDialog({ open, onClose, onCreated, editEvent }: Props) {
    const isEditing = Boolean(editEvent);

    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [burstIcon, setBurstIcon] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && editEvent) {
            const d = editEvent.date;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            setDate(`${yyyy}-${mm}-${dd}`);
            setName(editEvent.name);
            setDescription(Array.isArray(editEvent.des) ? editEvent.des.join('\n') : (editEvent.des ?? ''));
            setBurstIcon(editEvent.burstIcon ?? '');
            setError(null);
        } else if (open && !editEvent) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editEvent]);

    const reset = () => {
        setDate('');
        setName('');
        setDescription('');
        setBurstIcon('');
        setError(null);
    };

    const handleClose = () => {
        if (saving) return;
        reset();
        onClose();
    };

    const handleSubmit = async () => {
        if (!date || !name.trim()) {
            setError('Date and event name are required.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Append local noon to avoid UTC midnight parsing, which shifts the date
            // back by one day in timezones west of UTC (e.g. Canada UTC-4/UTC-5).
            const parsedDate = new Date(`${date}T12:00:00`);
            const data: Record<string, unknown> = {
                date: Timestamp.fromDate(parsedDate),
                name: name.trim(),
                owner: activeProfile,
                des: description.trim() || null,
                burstIcon: burstIcon.trim() || null,
            };

            if (isEditing && editEvent?.id) {
                await updateDoc(doc(db, 'timeline_events', editEvent.id), data);
            } else {
                if (!data.des) delete data.des;
                if (!data.burstIcon) delete data.burstIcon;
                await addDoc(collection(db, 'timeline_events'), data);
            }

            reset();
            onCreated();
            onClose();
        } catch (err) {
            console.error('[CreateEventDialog] failed to save event:', err);
            setError('Failed to save event. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: ferrariTokens.colors.carbon,
                    border: `1px solid ${ferrariTokens.colors.gold}`,
                    borderRadius: 2,
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontFamily: ferrariTokens.fonts.display,
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: ferrariTokens.colors.gold,
                    borderBottom: `1px solid ${ferrariTokens.colors.border}`,
                    pb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {isEditing ? <EditIcon sx={{ fontSize: '1.3rem' }} /> : <AddIcon sx={{ fontSize: '1.3rem' }} />}
                {isEditing ? 'Sửa kỉ niệm' : 'Kỉ niệm mới'}
            </DialogTitle>

            <DialogContent sx={{ pt: '24px !important', pb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                backgroundColor: ferrariTokens.colors.redDeep,
                                color: ferrariTokens.colors.white,
                                '& .MuiAlert-icon': { color: ferrariTokens.colors.goldLight },
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={inputSx}
                    />

                    <TextField
                        label="Event Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                        placeholder="e.g. First Date, Trip to Paris…"
                        sx={inputSx}
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Optional — a little story about this moment…"
                        sx={inputSx}
                    />

                    <Box>
                        <TextField
                            label="Burst Icon"
                            value={burstIcon}
                            onChange={(e) => setBurstIcon(e.target.value)}
                            fullWidth
                            placeholder="Optional — paste an emoji, e.g. 💋"
                            sx={inputSx}
                            inputProps={{ maxLength: 4 }}
                        />
                        <Typography
                            variant="body2"
                            sx={{ mt: 0.5, color: ferrariTokens.colors.muted, fontSize: '0.75rem' }}
                        >
                            Tap the date chip on the timeline to trigger this icon burst.
                        </Typography>
                    </Box>
                </Box>
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
                            <CircularProgress size={14} thickness={3} sx={{ color: ferrariTokens.colors.black }} />
                        ) : isEditing ? (
                            <EditIcon />
                        ) : (
                            <AddIcon />
                        )
                    }
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        backgroundColor: ferrariTokens.colors.gold,
                        color: ferrariTokens.colors.black,
                        '&:hover': { backgroundColor: ferrariTokens.colors.goldLight },
                        '&.Mui-disabled': {
                            backgroundColor: ferrariTokens.colors.subtle,
                            color: ferrariTokens.colors.muted,
                        },
                    }}
                >
                    {saving ? 'Saving…' : isEditing ? 'Lưu' : 'Thêm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const inputSx = {
    '& .MuiOutlinedInput-root': {
        fontFamily: ferrariTokens.fonts.sans,
        color: ferrariTokens.colors.white,
        '& fieldset': { borderColor: ferrariTokens.colors.border },
        '&:hover fieldset': { borderColor: ferrariTokens.colors.gold },
        '&.Mui-focused fieldset': { borderColor: ferrariTokens.colors.gold },
    },
    '& .MuiInputLabel-root': {
        fontFamily: ferrariTokens.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontSize: '0.8rem',
        color: ferrariTokens.colors.muted,
        '&.Mui-focused': { color: ferrariTokens.colors.gold },
    },
    '& .MuiInputBase-input::placeholder': {
        color: ferrariTokens.colors.subtle,
        opacity: 1,
    },
};
