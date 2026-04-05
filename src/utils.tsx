import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import React from 'react';

export type SeasonInfo = {
    icon: React.ReactElement;
    color: string;
    bgColor: string;
};

export function getSeason(date: Date): SeasonInfo {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5)
        return {
            icon: <LocalFloristIcon sx={{ fontSize: 14 }} />,
            color: '#a855f7',
            bgColor: '#f3e8ff',
        };
    if (month >= 6 && month <= 8)
        return {
            icon: <WbSunnyIcon sx={{ fontSize: 14 }} />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
        };
    if (month >= 9 && month <= 11)
        return {
            icon: <EnergySavingsLeafIcon sx={{ fontSize: 14 }} />,
            color: '#ea580c',
            bgColor: '#ffedd5',
        };
    return {
        icon: <AcUnitIcon sx={{ fontSize: 14 }} />,
        color: '#3b82f6',
        bgColor: '#dbeafe',
    };
}
