import { StrictMode, Suspense, Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import './index.css';
import './firebase';
import App from './App.tsx';
import theme from './theme';
import { tokens } from './theme';
import { ReasonILikeYou } from './components/ReasonILikeYou';

const AppShell = ({ children }: { children: ReactNode }) => (
    <Box
        sx={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: tokens.colors.cream,
        }}
    >
        {children}
    </Box>
);

const SuspenseFallback = () => (
    <AppShell>
        <CircularProgress sx={{ color: tokens.colors.burgundy }} size={40} thickness={3} />
    </AppShell>
);

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
    state = { error: null };
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return (
                <AppShell>
                    <Typography
                        sx={{
                            fontFamily: tokens.fonts.display,
                            fontSize: '1.4rem',
                            letterSpacing: '-0.01em',
                            color: tokens.colors.burgundy,
                        }}
                    >
                        Something went wrong
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: tokens.colors.inkMuted, fontFamily: tokens.fonts.mono }}
                    >
                        {(this.state.error as Error).message}
                    </Typography>
                </AppShell>
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
