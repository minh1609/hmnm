import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { QuestionCardProps } from './QuestionCard.types';

export type { Question } from './QuestionCard.types';

export function QuestionCard({ question, currentIndex, totalCount, onAnswer }: QuestionCardProps) {
    const theme = useTheme();
    const {
        palette: p,
        tokens: { colors: c, fonts: f },
    } = theme;

    return (
        <Box
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
                    {`${currentIndex + 1} / ${totalCount}`}
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
                        onClick={() => onAnswer(i)}
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
    );
}
