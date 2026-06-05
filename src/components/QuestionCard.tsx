import { useState } from 'react';
import { Box, Typography, LinearProgress, Snackbar, Alert, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Question } from '@/types';
import { useAppStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { secondaryButtonSx } from '@/styles/appStyles';

export type { Question };

interface QuestionCardProps {
    questions: Question[];
    onComplete: () => void;
    onReset?: () => void | Promise<void>;
    onWrongAnswer?: (questionIndex: number, chosenIndex: number) => void;
    onAdvance?: (questionIndex: number) => void;
}

export function QuestionCard({ questions, onComplete, onReset, onWrongAnswer, onAdvance }: QuestionCardProps) {
    const showCelebration = useAppStore((s) => s.showCelebration);
    const setShowCelebration = useAppStore((s) => s.setShowCelebration);
    const loading = useAppStore((s) => s.loading);
    const resetting = useAppStore((s) => s.resetting);
    const setResetting = useAppStore((s) => s.setResetting);
    const { isAdmin } = useAuth();
    const theme = useTheme();
    const {
        palette: p,
        tokens: { colors: c, fonts: f },
    } = theme;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; key: number }>({
        open: false,
        message: '',
        key: 0,
    });

    const question = questions[currentIndex];
    const progress = (currentIndex / questions.length) * 100;

    async function handleReset() {
        setResetting(true)
        try {
            await onReset?.();
        } catch {}
        setCurrentIndex(0);
        setWrongAttempts(0);
        setSnackbar({ open: false, message: '', key: 0 });
        setShowCelebration(false);
        setResetting(false);
    }

    function handleAnswer(optionIndex: number) {
        if (optionIndex === question.correctIndex) {
            //last answer check
            if (currentIndex + 1 >= questions.length) {
                setShowCelebration(true)
                onComplete();
            } else {
                setCurrentIndex((i) => i + 1);
                setWrongAttempts(0);
                onAdvance?.(currentIndex);
            }
        } else {
            const msgs = question.wrongMessages;
            const msg = msgs[wrongAttempts % msgs.length];
            setWrongAttempts((n) => n + 1);
            setSnackbar((s) => ({ open: true, message: msg, key: s.key + 1 }));
            onWrongAnswer?.(currentIndex, optionIndex);
        }
    }

    return (
        <>
                <LinearProgress
                variant={loading ? 'indeterminate' : 'determinate'}
                value={showCelebration ? 100 : progress}
                sx={{
                    height: 3,
                    backgroundColor: c.borderSubtle,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: p.primary.main,
                        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    },
                }}
            />

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
                {!loading && !showCelebration && (
                    <Box
                        key={currentIndex}
                        className="timeline-slide-left"
                        sx={{
                            width: '100%',
                            maxWidth: 520,
                            backgroundColor: c.surface,
                            border: `1px solid ${c.border}`,
                            borderTop: `3px solid ${p.primary.main}`,
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: `0 4px 18px ${p.primary.glowFaint}`,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: `linear-gradient(90deg, transparent, ${p.secondary.glow}, transparent)`,
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
                                {`${currentIndex + 1} / ${questions.length}`}
                            </Typography>
                            {question.image && (
                                <Box
                                    component="img"
                                    src={question.image}
                                    alt=""
                                    sx={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        mb: 2,
                                        objectFit: 'cover',
                                        maxHeight: 260,
                                    }}
                                />
                            )}
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
                                            borderColor: p.primary.main,
                                            boxShadow: `0 0 0 1px ${p.primary.main}, 0 4px 12px ${p.primary.glowFaint}`,
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
                                            color: p.primary.main,
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

            {showCelebration && isAdmin && (
                <Box sx={{ position: 'fixed', bottom: 72, left: 24, zIndex: 9999 }}>
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
                        border: `1px solid ${p.secondary.main}`,
                        color: c.ink,
                        fontFamily: f.sans,
                        '& .MuiAlert-icon': { color: p.primary.main },
                        '& .MuiAlert-action .MuiSvgIcon-root': { color: c.inkMuted },
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
