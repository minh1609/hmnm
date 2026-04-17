import { useEffect, useState } from 'react';
import { Fab, Portal, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';
import { secondaryButtonSx } from '@/styles/appStyles';

export function ScrollToTopFab() {
    const theme = useTheme();

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Portal>
            <Zoom in={visible} timeout={250} unmountOnExit>
                <Fab
                    size="medium"
                    aria-label="Scroll to top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    sx={{
                        position: 'fixed',
                        bottom: 28,
                        left: 28,
                        zIndex: 1200,
                        ...secondaryButtonSx(theme),
                    }}
                >
                    <KeyboardArrowUpIcon sx={{ fontSize: '1.5rem' }} />
                </Fab>
            </Zoom>
        </Portal>
    );
}
