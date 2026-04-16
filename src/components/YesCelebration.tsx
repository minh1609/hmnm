import { Box, Typography } from '@mui/material';
import { ferrariTokens } from '@/theme';

const PARTICLE_EMOJIS = ['❤️', '💕', '💖', '💗', '💓', '🥰', '✨', '💝', '🌸', '⭐'];
const HEART_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
    left: `${(i * 3.25) % 100}%`,
    fontSize: `${1.0 + (i % 5) * 0.32}rem`,
    duration: `${6.5 + (i % 7) * 0.9}s`,
    delay: `${(i % 11) * 0.35}s`,
    rotation: `${((i * 43) % 120) - 60}deg`,
    emoji: PARTICLE_EMOJIS[i % PARTICLE_EMOJIS.length],
}));

export function YesCelebration() {
    const { colors: c, fonts: f } = ferrariTokens;

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 9997,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                    'radial-gradient(ellipse at 50% 55%, rgba(200,168,75,0.22) 0%, rgba(220,0,0,0.14) 42%, rgba(13,13,13,0.93) 100%)',
                backdropFilter: 'blur(4px)',
                animation: 'yesCelebFadeIn 0.8s ease forwards',
                overflow: 'hidden',
            }}
        >
            {/* Gold ambient glow ring */}
            <Box
                className="yes-glow-ring"
                sx={{ width: '80vmin', height: '80vmin', margin: 'auto', position: 'absolute' }}
            />

            {/* Rising heart/emoji particles */}
            {HEART_PARTICLES.map((p, i) => (
                <Box
                    key={i}
                    sx={
                        {
                            position: 'absolute',
                            bottom: '-30px',
                            left: p.left,
                            fontSize: p.fontSize,
                            lineHeight: 1,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            willChange: 'transform, opacity',
                            '--rise-rot': p.rotation,
                            animation: `heartRise ${p.duration} ${p.delay} ease-in-out both`,
                        } as React.CSSProperties & Record<string, unknown>
                    }
                >
                    {p.emoji}
                </Box>
            ))}

            {/* Central content */}
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, px: 4 }}>
                <Typography
                    component="span"
                    sx={{
                        display: 'block',
                        fontFamily: f.script,
                        fontSize: { xs: '4.8rem', sm: '7.5rem' },
                        color: c.gold,
                        lineHeight: 1,
                        animation: 'yesReveal 5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both',
                        textShadow: [
                            `0 0 24px rgba(200,168,75,0.9)`,
                            `0 0 56px rgba(200,168,75,0.55)`,
                            `0 0 96px rgba(200,168,75,0.28)`,
                        ].join(', '),
                    }}
                >
                    YES! 🥰
                </Typography>

                <Typography
                    component="span"
                    sx={{
                        display: 'block',
                        fontFamily: f.display,
                        fontSize: { xs: '1rem', sm: '1.35rem' },
                        color: c.white,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        mt: 3,
                        opacity: 0,
                        animation: 'subReveal 1.5s cubic-bezier(0.22, 1, 0.36, 1) 4s forwards',
                    }}
                >
                    I knew you would
                </Typography>

                <Typography
                    component="span"
                    sx={{
                        display: 'block',
                        fontSize: { xs: '2.8rem', sm: '3.8rem' },
                        mt: 1.5,
                        opacity: 0,
                        animation: 'yesCelebFadeIn 1s ease 5.5s forwards, heartBeat 1.8s ease 6.5s infinite',
                    }}
                >
                    ❤️
                </Typography>
            </Box>
        </Box>
    );
}
