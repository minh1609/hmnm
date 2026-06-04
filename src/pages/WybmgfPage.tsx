import { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
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
import { PageHeader } from '@/components/PageHeader';
import { QuestionCard } from '@/components/QuestionCard';
import type { Question } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { secondaryButtonSx } from '@/styles/appStyles';

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
        tokens: { colors: c },
    } = theme;
    const { isAdmin } = useAuth();

    const [showYesCelebration, setShowYesCelebration] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(true);
    const [resetting, setResetting] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const celebTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    function handleComplete() {
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
    }

    async function handleReset() {
        setResetting(true);
        try {
            const batch = writeBatch(db);

            batch.set(doc(db, 'general', 'wybmgf'), { answer: false }, { merge: true });

            const officialSnap = await getDocs(
                query(collection(db, 'timeline_events'), where('name', '==', 'official'))
            );
            officialSnap.forEach((d) => batch.delete(d.ref));

            await batch.commit();
            setShowYesCelebration(false);
            setResetKey((k) => k + 1);
        } catch {
            // silent
        } finally {
            setResetting(false);
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: c.cream }}>
            <PageHeader title="Questions for You" />

            <QuestionCard
                key={resetKey}
                questions={QUESTIONS}
                loadingAnswer={loadingAnswer}
                showYesCelebration={showYesCelebration}
                onComplete={handleComplete}
            />

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
        </Box>
    );
}
