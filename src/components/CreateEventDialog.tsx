import { useState } from 'react';
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
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { activeProfile } from '@/config';
import { ferrariTokens } from '@/theme';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateEventDialog({ open, onClose, onCreated }: Props) {
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [burstIcon, setBurstIcon] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            const parsedDate = new Date(date);
            const doc: Record<string, unknown> = {
                date: Timestamp.fromDate(parsedDate),
                name: name.trim(),
                owner: activeProfile,
            };
            if (description.trim()) doc.des = description.trim();
            if (burstIcon.trim()) doc.burstIcon = burstIcon.trim();

            await addDoc(collection(db, 'timeline_events'), doc);
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
                <AddIcon sx={{ fontSize: '1.3rem' }} />
                Kỉ niệm mới
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
                    {saving ? 'Saving…' : 'Thêm'}
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
