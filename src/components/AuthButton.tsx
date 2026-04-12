import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { ferrariTokens } from '@/theme';
import { useAuth } from '@/hooks/useAuth';

export function AuthButton() {
    const { user, loading, signIn, signOut } = useAuth();
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    if (loading) {
        return (
            <Box sx={containerSx}>
                <CircularProgress size={18} thickness={3} sx={{ color: ferrariTokens.colors.gold }} />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={containerSx}>
                <Chip
                    icon={
                        <LoginIcon
                            sx={{ fontSize: '0.9rem !important', color: `${ferrariTokens.colors.gold} !important` }}
                        />
                    }
                    label="Sign in"
                    size="small"
                    onClick={signIn}
                    variant="outlined"
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: ferrariTokens.colors.gold,
                        borderColor: ferrariTokens.colors.gold,
                        backgroundColor: ferrariTokens.colors.black,
                        borderRadius: '4px',
                        height: 28,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: ferrariTokens.colors.goldLight,
                        },
                        '&.MuiChip-root:hover': {
                            backgroundColor: `${ferrariTokens.colors.goldGlow} !important`,
                        },
                    }}
                />
            </Box>
        );
    }

    return (
        <Box sx={containerSx}>
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar
                    src={user.photoURL ?? undefined}
                    alt={user.displayName ?? 'User'}
                    sx={{
                        width: 28,
                        height: 28,
                        border: `1.5px solid ${ferrariTokens.colors.gold}`,
                        boxShadow: `0 0 8px ${ferrariTokens.colors.goldGlow}`,
                        fontSize: '0.75rem',
                        bgcolor: ferrariTokens.colors.surface,
                        color: ferrariTokens.colors.gold,
                    }}
                >
                    {user.displayName?.[0] ?? '?'}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: ferrariTokens.colors.surface,
                            border: `1px solid ${ferrariTokens.colors.border}`,
                            borderRadius: '2px',
                            mt: 0.75,
                            minWidth: 180,
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${ferrariTokens.colors.border}` }}>
                    <Typography
                        sx={{
                            fontFamily: ferrariTokens.fonts.display,
                            fontSize: '0.8rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: ferrariTokens.colors.white,
                        }}
                    >
                        {user.displayName ?? 'Signed in'}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: ferrariTokens.fonts.sans,
                            fontSize: '0.7rem',
                            color: ferrariTokens.colors.muted,
                            mt: 0.25,
                        }}
                    >
                        {user.email}
                    </Typography>
                </Box>
                <MenuItem
                    onClick={() => {
                        setAnchor(null);
                        signOut();
                    }}
                    sx={{
                        fontFamily: ferrariTokens.fonts.display,
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: ferrariTokens.colors.muted,
                        gap: 1.5,
                        py: 1.25,
                        '&:hover': { color: ferrariTokens.colors.red, backgroundColor: 'transparent' },
                    }}
                >
                    <LogoutIcon sx={{ fontSize: '1rem' }} />
                    Sign out
                </MenuItem>
            </Menu>
        </Box>
    );
}

const containerSx = {
    position: 'fixed',
    top: 12,
    right: 14,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
} as const;
