import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const REASONS = [
    'nhí nháu',
    'ngon',
    'ngoan',
    'chếch chi',
    'quan tâm',
    'ấm áp',
    'mặt trời nhỏ',
    'dui tính',
    'hay làm trò',
];

const INTERVAL_MS = 5000;
const FADE_MS = 600;

export function ReasonILikeYou() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const { tokens: { colors: c, fonts: f } } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % REASONS.length);
                setVisible(true);
            }, FADE_MS);
        }, INTERVAL_MS);

        return () => clearInterval(timer);
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                textAlign: 'center',
                py: 1,
                px: 2,
                backgroundColor: `${c.creamDark}EE`,
                backdropFilter: 'blur(6px)',
                borderTop: `1px solid ${c.border}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }}
        >
            <Typography
                component="span"
                sx={{
                    fontFamily: f.sans,
                    fontSize: 'clamp(0.65rem, 1.8vw, 1rem)',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: c.inkMuted,
                    mr: '0.4em',
                }}
            >
                The reason I like you is
            </Typography>

            {/* Fixed-width slot sized to the longest word so the label never shifts */}
            <Box
                component="span"
                sx={{
                    display: 'inline-block',
                    width: '11ch',
                    textAlign: 'left',
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontFamily: f.display,
                        fontStyle: 'italic',
                        fontSize: 'clamp(0.65rem, 1.8vw, 1rem)',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        color: c.burgundy,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(4px)',
                        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
                        display: 'inline-block',
                    }}
                >
                    {REASONS[index]}
                </Typography>
            </Box>
        </Box>
    );
}
