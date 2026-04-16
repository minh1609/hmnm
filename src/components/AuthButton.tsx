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
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';
import { tokens } from '@/theme';

export function AuthButton() {
    const { user, loading, role, isAdmin, signIn, signOut } = useAuth();
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const {
        tokens: { colors: c, fonts: f },
    } = useTheme();

    if (loading) {
        return <CircularProgress size={18} thickness={3} sx={{ color: c.burgundy }} />;
    }

    if (!user) {
        return (
            <Chip
                icon={<LoginIcon sx={{ fontSize: '0.9rem !important', color: `${c.burgundy} !important` }} />}
                label="Sign in"
                size="small"
                onClick={signIn}
                variant="outlined"
                sx={{
                    fontFamily: f.sans,
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    color: c.burgundy,
                    borderColor: c.burgundy,
                    backgroundColor: c.surface,
                    borderRadius: '6px',
                    height: 28,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: `${c.roseGlowFaint} !important`,
                        borderColor: c.burgundyLight,
                        color: c.burgundyLight,
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
                            border: `1.5px solid ${isAdmin ? c.burgundy : c.rose}`,
                            boxShadow: `0 0 6px ${isAdmin ? c.burgundyGlow : c.roseGlow}`,
                            fontSize: '0.75rem',
                            bgcolor: c.panel,
                            color: isAdmin ? c.burgundy : c.brown,
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
                            backgroundColor: c.burgundy,
                            border: `1.5px solid ${c.cream}`,
                            boxShadow: `0 0 4px ${c.burgundyGlow}`,
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
                            backgroundColor: c.surface,
                            border: `1px solid ${c.border}`,
                            borderRadius: '8px',
                            boxShadow: `0 8px 24px ${c.burgundyGlowFaint}`,
                            mt: 0.75,
                            minWidth: 180,
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${c.border}` }}>
                    <Typography
                        sx={{
                            fontFamily: f.sans,
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            letterSpacing: '0.02em',
                            color: c.ink,
                        }}
                    >
                        {user.displayName ?? 'Signed in'}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: f.sans,
                            fontSize: '0.7rem',
                            color: c.inkMuted,
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
                            fontFamily: f.sans,
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
                        fontFamily: f.sans,
                        fontSize: '0.8rem',
                        letterSpacing: '0.04em',
                        color: c.inkMuted,
                        gap: 1.5,
                        py: 1.25,
                        '&:hover': { color: c.burgundy, backgroundColor: c.roseGlowFaint },
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
    const c = tokens.colors;
    switch (role) {
        case 'admin':
            return c.burgundy;
        case 'gf':
            return c.brown;
        default:
            return c.inkSubtle;
    }
};
