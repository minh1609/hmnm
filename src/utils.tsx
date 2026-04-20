import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import React from 'react';
import type { TripType } from '@/types';
import theme from '@/theme';

const p = theme.palette;

export type TripTypeStyle = {
    /** Solid pin / accent colour */
    pin: string;
    /** Semi-transparent halo fill */
    halo: string;
    /** Very faint tint for card shadows / backgrounds */
    glow: string;
    /** Accent gradient used for bottom rule in dialogs */
    gradient: string;
};

const TRIP_TYPE_STYLES: Record<TripType, TripTypeStyle> = {
    trip: {
        pin: p.primary.main,
        halo: p.primary.glow!,
        glow: p.primary.glowFaint!,
        gradient: `linear-gradient(90deg, transparent 0%, ${p.primary.dark} 30%, ${p.primary.main} 50%, ${p.primary.dark} 70%, transparent 100%)`,
    },
    meaningful: {
        pin: p.quaternary.main,
        halo: p.quaternary.glow!,
        glow: p.quaternary.glowFaint!,
        gradient: `linear-gradient(90deg, transparent 0%, ${p.quaternary.main} 30%, ${p.quaternary.light} 50%, ${p.quaternary.main} 70%, transparent 100%)`,
    },
    plan: {
        pin: p.tertiary.main,
        halo: p.tertiary.glow!,
        glow: p.tertiary.glow!,
        gradient: `linear-gradient(90deg, transparent 0%, ${p.tertiary.light} 30%, ${p.tertiary.main} 50%, ${p.tertiary.light} 70%, transparent 100%)`,
    },
};

export function getTripTypeStyle(type: TripType): TripTypeStyle {
    return TRIP_TYPE_STYLES[type] ?? TRIP_TYPE_STYLES.trip;
}

export type SeasonInfo = {
    icon: React.ReactElement;
    color: string;
    bgColor: string;
    weatherEmojis: string[];
};

const SEASON_ICON_SIZE = 14;

export function getSeason(date: Date): SeasonInfo {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5)
        return {
            icon: <LocalFloristIcon sx={{ fontSize: SEASON_ICON_SIZE }} />,
            color: '#a855f7',
            bgColor: '#f3e8ff',
            weatherEmojis: ['🌸', '🌷', '🌼', '🌺', '🌻', '🪻'],
        };
    if (month >= 6 && month <= 8)
        return {
            icon: <WbSunnyIcon sx={{ fontSize: SEASON_ICON_SIZE }} />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
            weatherEmojis: ['☀️', '🌞', '🌈', '🌤️', '⛱️', '🌻'],
        };
    if (month >= 9 && month <= 10)
        return {
            icon: <EnergySavingsLeafIcon sx={{ fontSize: SEASON_ICON_SIZE }} />,
            color: '#ea580c',
            bgColor: '#ffedd5',
            weatherEmojis: ['🍂', '🍁', '🍃', '🌾', '🌰', '🍄'],
        };
    return {
        icon: <AcUnitIcon sx={{ fontSize: SEASON_ICON_SIZE }} />,
        color: '#3b82f6',
        bgColor: '#dbeafe',
        weatherEmojis: ['❄️', '⛄', '🌨️', '🧊', '☃️', '🌬️'],
    };
}
