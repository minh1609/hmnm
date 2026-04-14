import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import React from 'react';

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
