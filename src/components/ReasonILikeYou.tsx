import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ferrariTokens } from '@/theme';

const REASONS = [
    'funny',
    'caring',
    'beautiful',
    'kind',
    'smart',
    'warm',
    'genuine',
    'adventurous',
    'loving',
    'silly',
    'thoughtful',
    'radiant',
    'strong',
    'sweet',
];

const INTERVAL_MS = 5000;
const FADE_MS = 600;

export function ReasonILikeYou() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

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
                backgroundColor: ferrariTokens.colors.redDark,
                borderTop: `1px solid ${ferrariTokens.colors.redDeep}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }}
        >
            <Typography
                component="span"
                sx={(theme) => ({
                    fontFamily: theme.typography.h3.fontFamily,
                    fontSize: 'clamp(0.65rem, 1.8vw, 1rem)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: ferrariTokens.colors.white,
                    mr: '0.4em',
                })}
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
                    sx={(theme) => ({
                        fontFamily: theme.typography.h1.fontFamily,
                        fontSize: 'clamp(0.65rem, 1.8vw, 1rem)',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: ferrariTokens.colors.gold,
                        textShadow: `0 0 12px ${ferrariTokens.colors.goldGlow}`,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(4px)',
                        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
                        display: 'inline-block',
                    })}
                >
                    {REASONS[index]}
                </Typography>
            </Box>
        </Box>
    );
}
