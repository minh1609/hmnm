import { useEffect, useState } from 'react';
import { Fab, Portal, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';

export function ScrollToTopFab() {
    const {
        tokens: { colors: c },
    } = useTheme();

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
                        borderRadius: '999px',
                        backgroundColor: c.surface,
                        color: c.burgundy,
                        border: `1px solid ${c.rose}`,
                        boxShadow: `0 4px 14px ${c.roseGlow}, 0 2px 6px rgba(0,0,0,0.08)`,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            backgroundColor: c.roseGlowFaint,
                            boxShadow: `0 8px 22px ${c.roseGlow}`,
                            transform: 'translateY(-3px)',
                        },
                    }}
                >
                    <KeyboardArrowUpIcon sx={{ fontSize: '1.5rem' }} />
                </Fab>
            </Zoom>
        </Portal>
    );
}
