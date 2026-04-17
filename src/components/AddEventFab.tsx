import { Fab, Portal, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { burgundyFabSx, fabLabelSx } from '@/styles/appStyles';

interface Props {
    onClick: () => void;
}

export function AddEventFab({ onClick }: Props) {
    const theme = useTheme();

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
                    ...burgundyFabSx(theme),
                }}
            >
                <AddIcon sx={{ fontSize: '1.2rem' }} />
                <Typography sx={fabLabelSx(theme)}>Add event</Typography>
            </Fab>
        </Portal>
    );
}
