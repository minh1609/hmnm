import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import React from 'react';
import type { TripType } from '@/types';
import { tokens } from '@/theme';

const { colors: c } = tokens;

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
        pin: c.burgundy,
        halo: c.burgundyGlow,
        glow: c.burgundyGlowFaint,
        gradient: `linear-gradient(90deg, transparent 0%, ${c.burgundyDark} 30%, ${c.burgundy} 50%, ${c.burgundyDark} 70%, transparent 100%)`,
    },
    meaningful: {
        pin: c.amber,
        halo: c.amberGlow,
        glow: c.amberGlowFaint,
        gradient: `linear-gradient(90deg, transparent 0%, ${c.amber} 30%, ${c.amberLight} 50%, ${c.amber} 70%, transparent 100%)`,
    },
    plan: {
        pin: c.brown,
        halo: c.brownGlow,
        glow: c.brownGlow,
        gradient: `linear-gradient(90deg, transparent 0%, ${c.brownLight} 30%, ${c.brown} 50%, ${c.brownLight} 70%, transparent 100%)`,
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
