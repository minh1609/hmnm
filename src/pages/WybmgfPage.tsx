import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Snackbar, Alert, LinearProgress, Button, CircularProgress } from '@mui/material';
import {
    doc,
    getDoc,
    collection,
    serverTimestamp,
    Timestamp,
    runTransaction,
    query,
    where,
    getDocs,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useTheme } from '@mui/material/styles';
import { YesCelebration } from '@/components/YesCelebration';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { secondaryButtonSx } from '@/styles/appStyles';

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    wrongMessages: string[];
}

const QUESTIONS: Question[] = [
    {
        question: 'What is our love language? 💌',
        options: ['Words of affirmation', 'Acts of service', 'Quality time', 'All of the above'],
        correctIndex: 3,
        wrongMessages: [
            "That's just one piece of us! Think bigger 💕",
            'You forgot the others too! 🥺',
            'We have more than one babe! 🥰',
        ],
    },
    {
        question: 'Will you be my girlfriend? 💍',
        options: ['Maybe later', 'Let me think…', 'Ask again tomorrow', 'YES! 🥰'],
        correctIndex: 3,
        wrongMessages: [
            'WHAT DO YOU MEAN MAYBE 😭',
            'Stop overthinking and just say yes!! 🪶',
            'TOMORROW?! I need an answer NOW 😩',
        ],
    },
];

export function WybmgfPage() {
    const theme = useTheme();
    const {
        tokens: { colors: c, fonts: f },
    } = theme;
    const { isAdmin } = useAuth();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showYesCelebration, setShowYesCelebration] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(true);
    const [resetting, setResetting] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; key: number }>({
        open: false,
        message: '',
        key: 0,
    });
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const celebTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const question = QUESTIONS[currentIndex];
    const progress = (currentIndex / QUESTIONS.length) * 100;

    useEffect(() => {
        async function fetchAnswerStatus() {
            try {
                const metaDoc = await getDoc(doc(db, 'general', 'wybmgf'));
                if (metaDoc.exists() && metaDoc.data().answer === true) {
                    setShowYesCelebration(true);
                }
            } catch {
                // treat as false on error
            } finally {
                setLoadingAnswer(false);
            }
        }
        fetchAnswerStatus();
    }, []);

    useEffect(
        () => () => {
            if (celebTimerRef.current) clearTimeout(celebTimerRef.current);
        },
        []
    );

    function handleAnswer(optionIndex: number) {
        if (optionIndex === question.correctIndex) {
            if (currentIndex + 1 >= QUESTIONS.length) {
                setShowYesCelebration(true);
                runTransaction(db, async (tx) => {
                    tx.set(
                        doc(db, 'general', 'wybmgf'),
                        { answer: true, answerTime: serverTimestamp() },
                        { merge: true }
                    );
                    const eventRef = doc(collection(db, 'timeline_events'));
                    tx.set(eventRef, {
                        date: Timestamp.fromDate(new Date()),
                        name: 'official',
                        burstIcon: '💗',
                        owner: 'mindy',
                    });
                }).catch(() => {});
            } else {
                setCurrentIndex((i) => i + 1);
                setWrongAttempts(0);
            }
        } else {
            const msgs = question.wrongMessages;
            const msg = msgs[wrongAttempts % msgs.length];
            setWrongAttempts((n) => n + 1);
            setSnackbar((s) => ({ open: true, message: msg, key: s.key + 1 }));
        }
    }

    async function handleReset() {
        setResetting(true);
        try {
            const batch = writeBatch(db);

            // Set answer to false in general/wybmgf
            batch.set(doc(db, 'general', 'wybmgf'), { answer: false }, { merge: true });

            // Delete all timeline_events where name === 'official'
            const officialSnap = await getDocs(
                query(collection(db, 'timeline_events'), where('name', '==', 'official'))
            );
            officialSnap.forEach((d) => batch.delete(d.ref));

            await batch.commit();
            setShowYesCelebration(false);
            setCurrentIndex(0);
            setWrongAttempts(0);
        } catch {
            // silent
        } finally {
            setResetting(false);
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: c.cream }}>
            <PageHeader title="Questions for You" />

            {/* Progress bar */}
            <LinearProgress
                variant={loadingAnswer ? 'indeterminate' : 'determinate'}
                value={showYesCelebration ? 100 : progress}
                sx={{
                    height: 3,
                    backgroundColor: c.borderSubtle,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: c.burgundy,
                        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    },
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 2, sm: 4 },
                    py: 4,
                }}
            >
                {!loadingAnswer && !showYesCelebration && (
                    <Box
                        key={currentIndex}
                        className="timeline-slide-left"
                        sx={{
                            width: '100%',
                            maxWidth: 520,
                            backgroundColor: c.surface,
                            border: `1px solid ${c.border}`,
                            borderTop: `3px solid ${c.burgundy}`,
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: `0 4px 18px ${c.burgundyGlowFaint}`,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: `linear-gradient(90deg, transparent, ${c.roseGlow}, transparent)`,
                            },
                        }}
                    >
                        {/* Question */}
                        <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 2 }}>
                            <Typography
                                sx={{
                                    fontFamily: f.sans,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    fontWeight: 600,
                                    color: c.inkSubtle,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                }}
                            >
                                {showYesCelebration ? 'Complete ✓' : `${currentIndex + 1} / ${QUESTIONS.length}`}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: f.display,
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                    fontWeight: 600,
                                    color: c.ink,
                                    letterSpacing: '-0.01em',
                                    lineHeight: 1.35,
                                }}
                            >
                                {question.question}
                            </Typography>
                        </Box>

                        {/* Options */}
                        <Box
                            sx={{
                                px: { xs: 2.5, sm: 4 },
                                pb: { xs: 3, sm: 4 },
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            {question.options.map((option, i) => (
                                <Box
                                    key={i}
                                    component="button"
                                    onClick={() => handleAnswer(i)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        width: '100%',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        backgroundColor: c.cream,
                                        border: `1px solid ${c.border}`,
                                        borderRadius: '8px',
                                        px: 2.5,
                                        py: 1.75,
                                        transition: 'all 0.18s ease',
                                        '&:hover': {
                                            backgroundColor: c.panel,
                                            borderColor: c.burgundy,
                                            boxShadow: `0 0 0 1px ${c.burgundy}, 0 4px 12px ${c.burgundyGlowFaint}`,
                                            transform: 'translateY(-1px)',
                                        },
                                        '&:active': {
                                            transform: 'translateY(0)',
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: f.sans,
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            letterSpacing: '0.06em',
                                            color: c.burgundy,
                                            minWidth: '22px',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: f.sans,
                                            fontSize: { xs: '0.95rem', sm: '1rem' },
                                            color: c.ink,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {option}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* YES! Celebration overlay */}
            {showYesCelebration && <YesCelebration />}

            {/* Admin reset button — overlaid above celebration */}
            {showYesCelebration && isAdmin && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 72,
                        left: 24,
                        zIndex: 9999,
                    }}
                >
                    <Button
                        startIcon={
                            resetting ? <CircularProgress size={14} sx={{ color: 'inherit' }} /> : <DeleteOutlineIcon />
                        }
                        onClick={handleReset}
                        disabled={resetting}
                        sx={secondaryButtonSx(theme)}
                    >
                        Reset
                    </Button>
                </Box>
            )}

            {/* Wrong answer snackbar */}
            <Snackbar
                key={snackbar.key}
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ mb: '48px' }}
            >
                <Alert
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    severity="error"
                    variant="filled"
                    sx={{
                        backgroundColor: c.creamDark,
                        border: `1px solid ${c.rose}`,
                        color: c.ink,
                        fontFamily: f.sans,
                        '& .MuiAlert-icon': { color: c.burgundy },
                        '& .MuiAlert-action .MuiSvgIcon-root': { color: c.inkMuted },
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
