import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';
import { Box } from '@mui/material';
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
    const setShowCelebration = useAppStore((s) => s.setShowCelebration);
    const setLoading = useAppStore((s) => s.setLoading);
    const celebTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        async function fetchAnswerStatus() {
            try {
                const metaDoc = await getDoc(doc(db, 'general', 'wybmgf'));
                if (metaDoc.exists() && metaDoc.data().answer === true) {
                    setShowCelebration(true);
                }
            } catch {
                // treat as false on error
            } finally {
                setLoading(false);
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
        runTransaction(db, async (tx) => {
            tx.set(
                doc(db, 'general', 'wybmgf'),
                { answer: true, answerTime: serverTimestamp() },
                { merge: true }
            );
            const eventRef = doc(collection(db, 'timeline_events'));
            tx.set(eventRef, {
                date: Timestamp.fromDate(new Date()),
                name: 'Official',
                burstIcon: '💗',
                owner: 'mindy',
            });
        }).catch(() => {});
    }

    async function handleReset() {
        try {
            const batch = writeBatch(db);

            batch.set(doc(db, 'general', 'wybmgf'), { answer: false }, { merge: true });

            const officialSnap = await getDocs(
                query(collection(db, 'timeline_events'), where('name', '==', 'Official'))
            );
            officialSnap.forEach((d) => batch.delete(d.ref));

            await batch.commit();
        } catch {
            // silent
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: c.cream }}>
            <PageHeader title="Questions for You" />

            <QuestionCard
                questions={QUESTIONS}
                onComplete={handleComplete}
                onReset={handleReset}
            />
        </Box>
    );
}
