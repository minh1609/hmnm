import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useTheme } from '@mui/material/styles';
import { PageHeader } from '@/components/PageHeader';

function formatDates(value: unknown): unknown {
    if (value === null || value === undefined) return value;
    if (typeof value === 'object') {
        if (typeof (value as Record<string, unknown>).toDate === 'function') {
            const d = (value as { toDate: () => Date }).toDate();
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const mn = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            return `${dd}/${mm}/${d.getFullYear()} ${hh}:${mn}:${ss}`;
        }
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, formatDates(v)])
        );
    }
    return value;
}

interface DocData {
    loading: boolean;
    data: Record<string, unknown> | null;
    error: string | null;
}

export function AdminPage() {
    const theme = useTheme();
    const {
        tokens: { colors: c },
    } = theme;

    const [sorry, setSorry] = useState<DocData>({ loading: true, data: null, error: null });
    const [wybmgf, setWybmgf] = useState<DocData>({ loading: true, data: null, error: null });

    useEffect(() => {
        getDoc(doc(db, 'general', 'sorry'))
            .then((snap) =>
                setSorry({ loading: false, data: snap.exists() ? snap.data() as Record<string, unknown> : null, error: null })
            )
            .catch((e) => setSorry({ loading: false, data: null, error: String(e) }));

        getDoc(doc(db, 'general', 'wybmgf'))
            .then((snap) =>
                setWybmgf({ loading: false, data: snap.exists() ? snap.data() as Record<string, unknown> : null, error: null })
            )
            .catch((e) => setWybmgf({ loading: false, data: null, error: String(e) }));
    }, []);

    function renderDoc(label: string, state: DocData) {
        return (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                    general / {label}
                </Typography>
                {state.loading && <Typography color="text.secondary">Loading…</Typography>}
                {state.error && <Typography color="error">{state.error}</Typography>}
                {!state.loading && !state.error && state.data === null && (
                    <Typography color="text.secondary">Document does not exist</Typography>
                )}
                {state.data && (
                    <Box component="pre" sx={{ m: 0, fontSize: 14, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {JSON.stringify(formatDates(state.data), null, 2)}
                    </Box>
                )}
            </Paper>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: c.cream }}>
            <PageHeader title="Admin" />
            <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', width: '100%' }}>
                {renderDoc('sorry', sorry)}
                {renderDoc('wybmgf', wybmgf)}
            </Box>
        </Box>
    );
}
