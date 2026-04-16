import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { tokens } from '@/theme';
import { useAuth } from '@/hooks/useAuth';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
        />
        <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            fill="#34A853"
        />
        <path
            d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
            fill="#FBBC05"
        />
        <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z"
            fill="#EA4335"
        />
    </svg>
);

interface AuthGateProps {
    children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const { user, loading, signIn } = useAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100dvh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tokens.colors.cream,
                }}
            >
                <CircularProgress
                    sx={{ color: tokens.colors.burgundy }}
                    size={40}
                    thickness={3}
                />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box
                sx={{
                    minHeight: '100dvh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tokens.colors.cream,
                    px: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${tokens.colors.roseGlow}, transparent)`,
                        pointerEvents: 'none',
                    },
                }}
            >
                {/* Decorative top stripe */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${tokens.colors.burgundy}, ${tokens.colors.rose}, ${tokens.colors.burgundy}, transparent)`,
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        zIndex: 1,
                        maxWidth: 360,
                        width: '100%',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '4rem',
                            lineHeight: 1,
                            filter: `drop-shadow(0 0 16px ${tokens.colors.roseGlow})`,
                        }}
                    >
                        🌸
                    </Typography>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            sx={{
                                fontFamily: tokens.fonts.display,
                                fontSize: '2.4rem',
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                color: tokens.colors.ink,
                                lineHeight: 1.1,
                            }}
                        >
                            Our Story
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: tokens.fonts.display,
                                fontStyle: 'italic',
                                fontSize: '1.3rem',
                                color: tokens.colors.brown,
                                mt: 0.5,
                            }}
                        >
                            A private journey
                        </Typography>
                    </Box>

                    {/* Divider */}
                    <Box
                        sx={{
                            width: '100%',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${tokens.colors.border}, transparent)`,
                        }}
                    />

                    <Typography
                        variant="caption"
                        sx={{
                            color: tokens.colors.inkMuted,
                            textAlign: 'center',
                            letterSpacing: '0.06em',
                        }}
                    >
                        Sign in to access this page
                    </Typography>

                    <Button
                        onClick={signIn}
                        startIcon={<GoogleIcon />}
                        variant="outlined"
                        fullWidth
                        sx={{
                            fontFamily: tokens.fonts.sans,
                            fontSize: '0.9rem',
                            letterSpacing: '0.04em',
                            color: tokens.colors.ink,
                            borderColor: tokens.colors.border,
                            backgroundColor: tokens.colors.surface,
                            py: 1.5,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: tokens.colors.burgundy,
                                backgroundColor: tokens.colors.panel,
                                boxShadow: `0 0 12px ${tokens.colors.burgundyGlowFaint}`,
                            },
                        }}
                    >
                        Continue with Google
                    </Button>
                </Box>

                {/* Decorative bottom stripe */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${tokens.colors.rose}, ${tokens.colors.burgundy}, ${tokens.colors.rose}, transparent)`,
                    }}
                />
            </Box>
        );
    }

    return <>{children}</>;
}
