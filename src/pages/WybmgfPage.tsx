import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Snackbar, Alert, LinearProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { ferrariTokens } from '@/theme';
import { YesCelebration } from '@/components/YesCelebration';
import { PageHeader } from '@/components/PageHeader';
import { AuthButton } from '@/components/AuthButton';

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    wrongMessages: string[];
}

const QUESTIONS: Question[] = [
    {
        question: 'What is our love language? \uD83D\uDC8C',
        options: ['Words of affirmation', 'Acts of service', 'Quality time', 'All of the above'],
        correctIndex: 3,
        wrongMessages: [
            'That\u2019s just one piece of us! Think bigger \uD83D\uDC95',
            'You forgot the others too! \uD83E\uDD7A',
            'We have more than one babe! \uD83E\uDD70',
        ],
    },
    {
        question: 'Will you be my girlfriend? \uD83D\uDC8D',
        options: ['Maybe later', 'Let me think\u2026', 'Ask again tomorrow', 'YES! \uD83E\uDD70'],
        correctIndex: 3,
        wrongMessages: [
            'WHAT DO YOU MEAN MAYBE \uD83D\uDE2D',
            'Stop overthinking and just say yes!! \uD83E\uDEB6',
            'TOMORROW?! I need an answer NOW \uD83D\uDE29',
        ],
    },
];

export function WybmgfPage() {
    const { colors: c, fonts: f } = ferrariTokens;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showYesCelebration, setShowYesCelebration] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(true);
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
                setDoc(
                    doc(db, 'general', 'wybmgf'),
                    { answer: true, answerTime: serverTimestamp() },
                    { merge: true }
                ).catch(() => {});
                addDoc(collection(db, 'timeline_events'), {
                    date: Timestamp.fromDate(new Date()),
                    name: 'official',
                    burstIcon: '💗',
                    owner: 'mindy',
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

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: c.black }}>
            <PageHeader
                title="A Question for You"
                right={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FavoriteIcon sx={{ color: c.gold, fontSize: '1.4rem' }} />
                        <AuthButton />
                    </Box>
                }
            />

            {/* Progress bar */}
            <LinearProgress
                variant={loadingAnswer ? 'indeterminate' : 'determinate'}
                value={showYesCelebration ? 100 : progress}
                sx={{
                    height: 3,
                    backgroundColor: c.redDeep,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: c.gold,
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
                            borderTop: `3px solid ${c.gold}`,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: `linear-gradient(90deg, transparent, ${c.goldLight}, transparent)`,
                            },
                        }}
                    >
                        {/* Question */}
                        <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 2 }}>
                            <Typography
                                sx={{
                                    fontFamily: f.mono,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    color: c.gold,
                                    letterSpacing: '0.1em',
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
                                    color: c.white,
                                    letterSpacing: '0.03em',
                                    lineHeight: 1.35,
                                    textTransform: 'uppercase',
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
                                        backgroundColor: c.panel,
                                        border: `1px solid ${c.border}`,
                                        borderRadius: '6px',
                                        px: 2.5,
                                        py: 1.75,
                                        transition: 'all 0.18s ease',
                                        '&:hover': {
                                            backgroundColor: c.surface,
                                            borderColor: c.gold,
                                            boxShadow: `0 0 0 1px ${c.gold}, 0 4px 16px ${c.goldGlow}`,
                                            transform: 'translateY(-1px)',
                                        },
                                        '&:active': {
                                            transform: 'translateY(0)',
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: f.display,
                                            fontSize: '0.85rem',
                                            letterSpacing: '0.1em',
                                            color: c.gold,
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
                                            color: c.white,
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
                        backgroundColor: c.redDeep,
                        border: `1px solid ${c.red}`,
                        color: c.white,
                        fontFamily: f.sans,
                        '& .MuiAlert-icon': { color: c.gold },
                        '& .MuiAlert-action .MuiSvgIcon-root': { color: c.muted },
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
