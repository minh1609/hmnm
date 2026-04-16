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
import { tokens } from '@/theme';
import { useAuth } from '@/hooks/useAuth';

export function AuthButton() {
    const { user, loading, role, isAdmin, signIn, signOut } = useAuth();
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    if (loading) {
        return <CircularProgress size={18} thickness={3} sx={{ color: tokens.colors.burgundy }} />;
    }

    if (!user) {
        return (
            <Chip
                icon={
                    <LoginIcon
                        sx={{ fontSize: '0.9rem !important', color: `${tokens.colors.burgundy} !important` }}
                    />
                }
                label="Sign in"
                size="small"
                onClick={signIn}
                variant="outlined"
                sx={{
                    fontFamily: tokens.fonts.sans,
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    color: tokens.colors.burgundy,
                    borderColor: tokens.colors.burgundy,
                    backgroundColor: tokens.colors.surface,
                    borderRadius: '6px',
                    height: 28,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: `${tokens.colors.roseGlowFaint} !important`,
                        borderColor: tokens.colors.burgundyLight,
                        color: tokens.colors.burgundyLight,
                        transform: 'scale(1.06)',
                    },
                    '& .MuiTouchRipple-root': { display: 'none' },
                }}
            />
        );
    }

    return (
        <>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0 }}>
                    <Avatar
                        src={user.photoURL ?? undefined}
                        alt={user.displayName ?? 'User'}
                        sx={{
                            width: 28,
                            height: 28,
                            border: `1.5px solid ${isAdmin ? tokens.colors.burgundy : tokens.colors.rose}`,
                            boxShadow: `0 0 6px ${isAdmin ? tokens.colors.burgundyGlow : tokens.colors.roseGlow}`,
                            fontSize: '0.75rem',
                            bgcolor: tokens.colors.panel,
                            color: isAdmin ? tokens.colors.burgundy : tokens.colors.brown,
                        }}
                    >
                        {user.displayName?.[0] ?? '?'}
                    </Avatar>
                </IconButton>
                {isAdmin && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: tokens.colors.burgundy,
                            border: `1.5px solid ${tokens.colors.cream}`,
                            boxShadow: `0 0 4px ${tokens.colors.burgundyGlow}`,
                        }}
                    />
                )}
            </Box>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                disableScrollLock
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: tokens.colors.surface,
                            border: `1px solid ${tokens.colors.border}`,
                            borderRadius: '8px',
                            boxShadow: `0 8px 24px ${tokens.colors.burgundyGlowFaint}`,
                            mt: 0.75,
                            minWidth: 180,
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${tokens.colors.border}` }}>
                    <Typography
                        sx={{
                            fontFamily: tokens.fonts.sans,
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            letterSpacing: '0.02em',
                            color: tokens.colors.ink,
                        }}
                    >
                        {user.displayName ?? 'Signed in'}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: tokens.fonts.sans,
                            fontSize: '0.7rem',
                            color: tokens.colors.inkMuted,
                            mt: 0.25,
                        }}
                    >
                        {user.email}
                    </Typography>
                    <Chip
                        label={role ?? 'viewer'}
                        size="small"
                        sx={{
                            mt: 0.75,
                            height: 18,
                            fontFamily: tokens.fonts.sans,
                            fontSize: '0.6rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: roleColor(role),
                            borderColor: roleColor(role),
                            backgroundColor: 'transparent',
                            '& .MuiChip-label': { px: 0.75 },
                        }}
                        variant="outlined"
                    />
                </Box>
                <MenuItem
                    onClick={() => {
                        setAnchor(null);
                        signOut();
                    }}
                    sx={{
                        fontFamily: tokens.fonts.sans,
                        fontSize: '0.8rem',
                        letterSpacing: '0.04em',
                        color: tokens.colors.inkMuted,
                        gap: 1.5,
                        py: 1.25,
                        '&:hover': { color: tokens.colors.burgundy, backgroundColor: tokens.colors.roseGlowFaint },
                    }}
                >
                    <LogoutIcon sx={{ fontSize: '1rem' }} />
                    Sign out
                </MenuItem>
            </Menu>
        </>
    );
}

const roleColor = (role: string | null) => {
    switch (role) {
        case 'admin': return tokens.colors.burgundy;
        case 'gf':    return tokens.colors.brown;
        default:      return tokens.colors.inkSubtle;
    }
};
