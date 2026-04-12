import type { ImageFile, Icon } from '@/types';

export const IMAGE_FILES: ImageFile[] = [
    { file: 'pen.png', label: 'Favourite animal' },
    { file: 'fer.png', label: 'Charles Leclerc - 16' },
];

export const ICONS: Icon[] = [
    // Emojis — color value is unused, emojis render in their own colors
    { symbol: '🍉', color: 'inherit', label: '5 in summer 2025 and more in 2026' },
    { symbol: '🍪 ', color: 'inherit', label: 'Chocolate only' },
    {
        symbol: '🧋',
        color: 'inherit',
        label: 'Creme Burlee @ Machi Machi, Cream Cheese @ Matcha Matcha, Pure Latte @ Chayan',
    },
    { symbol: '🧁', color: 'inherit', label: 'Vava Designer cake, Farmboy' },
];
