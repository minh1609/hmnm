import { useState } from 'react';
import { createPortal } from 'react-dom';
import FerrariTooltip from '@/components/FerrariTooltip';

import { IMAGE_FILES, ICONS } from '@/data';
import { fallingObjects } from '@/config';

// ── Images ────────────────────────────────────────────────────────────────────
// Drop transparent PNGs into public/particles/ and list their filenames here.
const BASE = import.meta.env.BASE_URL; // '/hmnm/'
const IMAGE_SRCS = IMAGE_FILES.map(({ file, label }) => ({
    src: `${BASE}particles/${file}`,
    label,
}));

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
    const p = fallingObjects.particle;
    return {
        id,
        left: rand(p.leftMin, p.leftMax),
        size: rand(p.sizeMin, p.sizeMax),
        duration: rand(p.durationMin, p.durationMax),
        delay: rand(p.delayMin, p.delayMax),
        opacity: rand(p.opacityMin, p.opacityMax),
        drift: rand(p.driftMin, p.driftMax),
    };
}

// Build pool: half images, half icons — computed once, stable across re-renders
const IMAGE_COUNT = fallingObjects.imageCount;
const ICON_COUNT = fallingObjects.iconCount;

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
