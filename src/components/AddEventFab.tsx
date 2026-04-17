import { Button, Portal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { primaryButtonSx } from '@/styles/appStyles';

interface Props {
    onClick: () => void;
}

export function AddEventFab({ onClick }: Props) {
    const theme = useTheme();

    return (
        <Portal>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onClick}
                sx={{
                    position: 'fixed',
                    bottom: 28,
                    right: 28,
                    zIndex: 1200,
                    animation: 'breathe 2.8s ease-in-out infinite',
                    ...primaryButtonSx(theme, theme.tokens.colors.burgundy, theme.tokens.colors.burgundyLight),
                    '&:hover': {
                        backgroundColor: theme.tokens.colors.burgundyLight,
                        animationPlayState: 'paused',
                    },
                }}
            >
                Add event
            </Button>
        </Portal>
    );
}
