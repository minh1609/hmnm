import { Fab, Portal, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { tokens } from '@/theme';

interface Props {
    onClick: () => void;
}

export function AddEventFab({ onClick }: Props) {
    return (
        <Portal>
            <Fab
                variant="extended"
                onClick={onClick}
                sx={{
                    position: 'fixed',
                    bottom: 28,
                    right: 28,
                    zIndex: 1200,
                    px: 2.5,
                    gap: 1,
                    borderRadius: '999px',
                    backgroundColor: tokens.colors.burgundy,
                    color: tokens.colors.white,
                    border: `1px solid ${tokens.colors.burgundyDark}`,
                    boxShadow: `0 6px 16px ${tokens.colors.burgundyGlow}, 0 2px 6px rgba(0,0,0,0.12)`,
                    animation: 'fabFloat 3s ease-in-out infinite',
                    '@keyframes fabFloat': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-6px)' },
                    },
                    transition: 'transform 2s ease, box-shadow 0.5s ease, background-color 0.5s ease',
                    '&:hover': {
                        backgroundColor: tokens.colors.burgundyLight,
                        boxShadow: `0 10px 28px ${tokens.colors.burgundyGlow}`,
                        animation: 'none',
                        transform: 'translateY(-4px) scale(1.05)',
                    },
                }}
            >
                <AddIcon sx={{ fontSize: '1.2rem' }} />
                <Typography
                    sx={{
                        fontFamily: tokens.fonts.sans,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.04em',
                        lineHeight: 1,
                    }}
                >
                    Thêm nhìu kỉ niệm
                </Typography>
            </Fab>
        </Portal>
    );
}
