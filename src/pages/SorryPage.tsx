import { useEffect, useState } from 'react';

const Mood = {
    Happy: 'happy',
    Sad: 'sad',
    Cry: 'cry',
} as const;
type Mood = (typeof Mood)[keyof typeof Mood];
import { useAppStore } from '@/store';
import { Box } from '@mui/material';
import {
    doc,
    getDoc,
    serverTimestamp,
    runTransaction,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useTheme } from '@mui/material/styles';
import { PageHeader } from '@/components/PageHeader';
import { QuestionCard } from '@/components/QuestionCard';
import type { Question } from '@/types';

const QUESTIONS: Question[] = [
    {
        question: 'Em bé sao oy, tha lỗi cho anh nhá? 🥺',
        options: ['Maybe', 'Still thinking…', 'Not yet', 'Được rồi'],
        correctIndex: 3,
        wrongMessages: [
            "Chọn sai làm em bé khóc oy, dỗ em bé mau đi",
            "Chọn sai làm em bé khóc oy, dỗ em bé mau đi",
            "Chọn sai làm em bé khóc oy, dỗ em bé mau đi",
        ],
    },
];

export function SorryPage() {
    const theme = useTheme();
    const {
        tokens: { colors: c },
    } = theme;
    const [mood, setMood] = useState<Mood>(Mood.Sad);
    const [showSorryText, setSorryText] = useState(false);
    const setLoading = useAppStore((s) => s.setLoading);

    useEffect(() => {
        async function fetchAnswerStatus() {
            try {
                const metaDoc = await getDoc(doc(db, 'general', 'sorry'));
                if (metaDoc.exists() && metaDoc.data().answer === true) {
                    setMood(Mood.Happy)
                }
            } catch {
                // treat as false on error
            } finally {
                setLoading(false);
            }
        }
        fetchAnswerStatus();
    }, []);

    function handleComplete() {
        setMood(Mood.Happy);
        setSorryText(true)
        runTransaction(db, async (tx) => {
            tx.set(
                doc(db, 'general', 'sorry'),
                { answer: true, answerTime: serverTimestamp() },
                { merge: true }
            );
        }).catch(() => {});
    }

    async function handleReset() {
        setMood(Mood.Cry)
        setSorryText(false)
        try {
            const batch = writeBatch(db);
            batch.set(doc(db, 'general', 'sorry'), { answer: false }, { merge: true });
            await batch.commit();
        } catch {
            // silent
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: c.cream }}>
            <PageHeader title={mood === Mood.Happy ? "Yayyyyyy 🥰" : "Xin lỗi bé 😢"} />

            <Box
                component="img"
                src={`${import.meta.env.BASE_URL}babies/${mood}.${mood === Mood.Cry ? 'gif' : 'jpg'}`}
                alt={mood}
                sx={{ width: 200, height: 200, objectFit: 'cover', display: 'block', mx: 'auto', mt: 4, mb: 2 }}
            />

            {showSorryText &&
                <div style={{ width: '80vw', margin: '0 auto' }}>
                    Cảm ơn chị tha lỗi cho anh em ạ, chị đọc giúp em với<br />
                    -------------------<br />
                    Minh ơi, anh xin lỗi làm em buồn nhé, nhiều lần anh chỉ cố giải thích vì sợ em hiểu lầm,
                    nhưng càng nói em càng không thích, nghĩ a muốn gây hấn, anh không thế đâu mà, muốn em không hiểu lầm nữa thôi <br />
                    Giờ anh sẽ nói rõ ràng hơn, có gì hiểu lầm nói sau khi em hết giận nhá<br />
                    Mong em qua phỏng vấn  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{width: 16, height: 16, display: 'inline', verticalAlign: 'middle'}} />
                </div>
            }

            <QuestionCard
                questions={QUESTIONS}
                onComplete={handleComplete}
                onReset={handleReset}
                onWrongAnswer={() => setMood(Mood.Cry)}
                onAdvance={()=>setMood(Mood.Happy)}
            />
        </Box>
    );
}
