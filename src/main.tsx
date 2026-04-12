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
import { ferrariTokens } from './theme';

const AppShell = ({ children }: { children: ReactNode }) => (
    <Box
        sx={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: ferrariTokens.colors.black,
        }}
    >
        {children}
    </Box>
);

const SuspenseFallback = () => (
    <AppShell>
        <CircularProgress sx={{ color: ferrariTokens.colors.gold }} size={40} thickness={3} />
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
                            fontFamily: ferrariTokens.fonts.display,
                            fontSize: '1.4rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: ferrariTokens.colors.red,
                        }}
                    >
                        Something went wrong
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: ferrariTokens.colors.muted, fontFamily: ferrariTokens.fonts.mono }}
                    >
                        {(this.state.error as Error).message}
                    </Typography>
                </AppShell>
            );
        }
        return this.props.children;
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <HashRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Suspense fallback={<SuspenseFallback />}>
                        <App />
                    </Suspense>
                </ThemeProvider>
            </HashRouter>
        </ErrorBoundary>
    </StrictMode>
);
