import { StrictMode, Suspense, Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import './index.css';
import './firebase';
import App from './App.tsx';
import theme from './theme';
import { ReasonILikeYou } from './components/ReasonILikeYou';

/** Centred wrapper used by the loading and error states. */
const AppShell = ({ children }: { children: ReactNode }) => {
    const { tokens: { colors: c } } = useTheme();
    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: c.cream,
            }}
        >
            {children}
        </Box>
    );
};

const SuspenseFallback = () => {
    const { tokens: { colors: c } } = useTheme();
    return (
        <AppShell>
            <CircularProgress sx={{ color: c.burgundy }} size={40} thickness={3} />
        </AppShell>
    );
};

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
    state = { error: null };
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            // Class components can't use hooks. Access tokens directly from the
            // imported theme object — values are identical to what useTheme() returns.
            const { colors: c, fonts: f } = theme.tokens;
            return (
                <ThemeProvider theme={theme}>
                    <Box
                        sx={{
                            minHeight: '100dvh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            backgroundColor: c.cream,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: f.display,
                                fontSize: '1.4rem',
                                letterSpacing: '-0.01em',
                                color: c.burgundy,
                            }}
                        >
                            Something went wrong
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: c.inkMuted, fontFamily: f.mono }}
                        >
                            {(this.state.error as Error).message}
                        </Typography>
                    </Box>
                </ThemeProvider>
            );
        }
        return this.props.children;
    }
}

const container = document.getElementById('root')!;
// Reuse the existing root during HMR hot reloads to avoid the
// "container already passed to createRoot" warning.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const root = (container as any).__reactRoot ?? createRoot(container);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(container as any).__reactRoot = root;

root.render(
    <StrictMode>
        <ErrorBoundary>
            <HashRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Suspense fallback={<SuspenseFallback />}>
                        <ReasonILikeYou />
                        <App />
                    </Suspense>
                </ThemeProvider>
            </HashRouter>
        </ErrorBoundary>
    </StrictMode>
);
