import { Fab, Portal, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ferrariTokens } from '@/theme';

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
                    backgroundColor: ferrariTokens.colors.black,
                    color: ferrariTokens.colors.gold,
                    border: `1px solid ${ferrariTokens.colors.gold}`,
                    boxShadow: `0 6px 16px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3), 0 0 24px ${ferrariTokens.colors.goldGlow}`,
                    animation: 'fabFloat 3s ease-in-out infinite',
                    '@keyframes fabFloat': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-6px)' },
                    },
                    transition: 'transform 2s ease, box-shadow 0.5s ease, background-color 0.5s ease',
                    '&:hover': {
                        backgroundColor: ferrariTokens.colors.carbon,
                        boxShadow: `0 10px 28px rgba(0,0,0,0.55), 0 4px 10px rgba(0,0,0,0.35), 0 0 36px ${ferrariTokens.colors.goldGlow}`,
                        animation: 'none',
                        transform: 'translateY(-4px) scale(1.05)',
                    },
                }}
            >
                <AddIcon sx={{ fontSize: '1.2rem' }} />
                <Typography
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                    }}
                >
                    Thêm nhìu kỉ niệm
                </Typography>
            </Fab>
        </Portal>
    );
}
