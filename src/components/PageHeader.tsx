import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { AuthButton } from '@/components/AuthButton';

interface PageHeaderProps {
    title: string;
    /** Override navigate('/') with a custom back handler */
    onBack?: () => void;
    /** Hide the back button (e.g. on the home page). Defaults to true. */
    showBack?: boolean;
    /** Apply position:sticky. Set to false when embedding inside an existing sticky container. Defaults to true. */
    sticky?: boolean;
}

export function PageHeader({
    title,
    onBack,
    showBack = true,
    sticky = true,
}: PageHeaderProps) {
    const navigate = useNavigate();
    const { tokens: { colors: c, fonts: f } } = useTheme();

    return (
        <Box
            sx={{
                ...(sticky && { position: 'sticky', top: 0, zIndex: 100 }),
                backgroundColor: c.cream,
                px: { xs: 2, sm: 4 },
                py: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderBottom: `1px solid ${c.border}`,
                boxShadow: `0 2px 12px ${c.burgundyGlowFaint}`,
            }}
        >
            {showBack && (
                <IconButton
                    onClick={onBack ?? (() => navigate('/'))}
                    sx={{
                        color: c.burgundy,
                        border: `1px solid ${c.burgundy}`,
                        borderRadius: '6px',
                        p: 0.75,
                        '&:hover': {
                            backgroundColor: c.burgundyGlowFaint,
                            '& .MuiSvgIcon-root': { transform: 'scale(1.25)' },
                        },
                    }}
                >
                    <ArrowBackIcon fontSize="small" sx={{ transition: 'transform 0.18s ease' }} />
                </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0, cursor: 'default' }}>
                <Typography
                    sx={{
                        fontFamily: f.display,
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                        letterSpacing: '-0.02em',
                        color: c.ink,
                        lineHeight: 1.1,
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Box sx={{ ml: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {import.meta.env.DEV && (
                    <Box
                        sx={{
                            backgroundColor: 'warning.main',
                            color: 'warning.contrastText',
                            px: 1.5,
                            py: 0.25,
                            borderRadius: '4px',
                            fontFamily: f.sans,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Dev Mode
                    </Box>
                )}
                <AuthButton />
            </Box>
        </Box>
    );
}
