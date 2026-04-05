import { useState } from 'react';
import { createPortal } from 'react-dom';
import FerrariTooltip from '@/components/FerrariTooltip';

// ── Images ────────────────────────────────────────────────────────────────────
// Drop transparent PNGs into public/particles/ and list their filenames here.
const BASE = import.meta.env.BASE_URL; // '/hmnm/'
const IMAGE_FILES: { file: string; label: string }[] = [
    { file: 'pen.png', label: 'Favourite animal' },
    { file: 'fer.png', label: 'Charles Leclerc - 16' },
];
const IMAGE_SRCS = IMAGE_FILES.map(({ file, label }) => ({
    src: `${BASE}particles/${file}`,
    label,
}));

// ── Icons ─────────────────────────────────────────────────────────────────────
// Mix unicode symbols (color applies) and emojis (color is ignored — they use
// their own built-in colors). Add any emoji or symbol you like here.
const ICONS: { symbol: string; color: string; label: string }[] = [
    // Emojis — color value is unused, emojis render in their own colors
    { symbol: '🍉', color: 'inherit', label: '5 in summer 2025 and more in 2026' },
    { symbol: '🍪 ', color: 'inherit', label: 'Chocolate only' },
    {
        symbol: '🧋',
        color: 'inherit',
        label: 'Creme Burlee @ Machi Machi, Cream Cheese @ Matcha Matcha, Pure Latte @Chayam',
    },
    { symbol: '🧁', color: 'inherit', label: 'Vava Designer cake, Farmboy' },
];

// ── Particle types ─────────────────────────────────────────────────────────────
type ImageParticle = {
    kind: 'image';
    id: number;
    src: string;
    label: string;
    left: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    drift: number;
};

type IconParticle = {
    kind: 'icon';
    id: number;
    symbol: string;
    color: string;
    label: string;
    left: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    drift: number;
};

type Particle = ImageParticle | IconParticle;

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function baseParticle(id: number) {
    return {
        id,
        left: rand(0, 100),
        size: rand(18, 36),
        duration: rand(10, 24),
        delay: rand(-24, 0),
        opacity: rand(0.25, 0.55),
        drift: rand(-40, 40),
    };
}

// Build pool: half images, half icons — computed once, stable across re-renders
const IMAGE_COUNT = 12;
const ICON_COUNT = 13;

const PARTICLES: Particle[] = [
    ...Array.from<unknown, ImageParticle>({ length: IMAGE_COUNT }, (_, i) => ({
        kind: 'image',
        ...baseParticle(i),
        ...pick(IMAGE_SRCS),
    })),
    ...Array.from<unknown, IconParticle>({ length: ICON_COUNT }, (_, i) => ({
        kind: 'icon',
        ...baseParticle(IMAGE_COUNT + i),
        ...pick(ICONS),
    })),
];

export function FallingObjects() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                overflow: 'hidden',
            }}
        >
            {PARTICLES.map((p) => {
                const isHovered = hoveredId === p.id;
                const sharedStyle = {
                    position: 'absolute' as const,
                    left: `${p.left}%`,
                    top: '-6%',
                    opacity: isHovered ? 1 : p.opacity,
                    userSelect: 'none' as const,
                    animation: `fallingDrift ${p.duration}s ${p.delay}s linear infinite`,
                    animationPlayState: isHovered ? 'paused' : 'running',
                    '--drift': `${p.drift}px`,
                    pointerEvents: 'auto' as const,
                    cursor: 'default',
                    transition: 'opacity 0.2s ease',
                } as React.CSSProperties;

                if (p.kind === 'image') {
                    return (
                        <FerrariTooltip key={p.id} title={p.label} placement="top" arrow>
                            <img
                                src={p.src}
                                alt=""
                                aria-hidden="true"
                                onMouseEnter={() => setHoveredId(p.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    ...sharedStyle,
                                    width: `${p.size}px`,
                                    height: `${p.size}px`,
                                    objectFit: 'contain',
                                }}
                            />
                        </FerrariTooltip>
                    );
                }

                return (
                    <FerrariTooltip key={p.id} title={p.label} placement="top" arrow>
                        <span
                            aria-hidden="true"
                            onMouseEnter={() => setHoveredId(p.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                ...sharedStyle,
                                fontSize: `${p.size}px`,
                                color: p.color,
                                lineHeight: 1,
                            }}
                        >
                            {p.symbol}
                        </span>
                    </FerrariTooltip>
                );
            })}
        </div>,
        document.body
    );
}
