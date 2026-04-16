import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { tokens } from '@/theme';

interface PageHeaderProps {
    title: string;
    subtitle?: React.ReactNode;
    /** Icon rendered immediately before the title text */
    titleIcon?: React.ReactNode;
    /** Content placed at the trailing (right) edge of the header */
    right?: React.ReactNode;
    /** Override navigate('/') with a custom back handler */
    onBack?: () => void;
    /** Hide the back button (e.g. on the home page). Defaults to true. */
    showBack?: boolean;
    /** Apply position:sticky. Set to false when embedding inside an existing sticky container. Defaults to true. */
    sticky?: boolean;
}

export function PageHeader({
    title,
    subtitle,
    titleIcon,
    right,
    onBack,
    showBack = true,
    sticky = true,
}: PageHeaderProps) {
    const navigate = useNavigate();
    const { colors: c, fonts: f } = tokens;

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
                {titleIcon}
                <Box sx={{ minWidth: 0 }}>
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
                    {subtitle && (
                        <Typography
                            variant="caption"
                            sx={{ color: c.brown, fontFamily: f.sans, letterSpacing: '0.06em', opacity: 0.9 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {right && <Box sx={{ ml: 'auto', flexShrink: 0 }}>{right}</Box>}
        </Box>
    );
}
