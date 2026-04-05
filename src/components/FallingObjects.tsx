import { createPortal } from 'react-dom';

// ── Images ────────────────────────────────────────────────────────────────────
// Drop transparent PNGs into public/particles/ and list their filenames here.
const BASE = import.meta.env.BASE_URL; // '/hmnm/'
const IMAGE_FILES = ['pen.png', 'fer.png'];
const IMAGE_SRCS = IMAGE_FILES.map((f) => `${BASE}particles/${f}`);

// ── Icons ─────────────────────────────────────────────────────────────────────
// Mix unicode symbols (color applies) and emojis (color is ignored — they use
// their own built-in colors). Add any emoji or symbol you like here.
const ICONS: { symbol: string; color: string }[] = [
    // Emojis — color value is unused, emojis render in their own colors
    { symbol: '🍉', color: 'inherit' },
    { symbol: '🍪 ', color: 'inherit' },
    { symbol: '🧋', color: 'inherit' },
    { symbol: '🧁', color: 'inherit' },
];

// ── Particle types ─────────────────────────────────────────────────────────────
type ImageParticle = {
    kind: 'image';
    id: number;
    src: string;
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
        src: pick(IMAGE_SRCS),
    })),
    ...Array.from<unknown, IconParticle>({ length: ICON_COUNT }, (_, i) => ({
        kind: 'icon',
        ...baseParticle(IMAGE_COUNT + i),
        ...pick(ICONS),
    })),
];

export function FallingObjects() {
    return createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            {PARTICLES.map((p) => {
                const sharedStyle = {
                    position: 'absolute' as const,
                    left: `${p.left}%`,
                    top: '-6%',
                    opacity: p.opacity,
                    userSelect: 'none' as const,
                    animation: `fallingDrift ${p.duration}s ${p.delay}s linear infinite`,
                    '--drift': `${p.drift}px`,
                } as React.CSSProperties;

                if (p.kind === 'image') {
                    return (
                        <img
                            key={p.id}
                            src={p.src}
                            alt=""
                            aria-hidden="true"
                            style={{
                                ...sharedStyle,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                objectFit: 'contain',
                            }}
                        />
                    );
                }

                return (
                    <span
                        key={p.id}
                        aria-hidden="true"
                        style={{
                            ...sharedStyle,
                            fontSize: `${p.size}px`,
                            color: p.color,
                            lineHeight: 1,
                        }}
                    >
                        {p.symbol}
                    </span>
                );
            })}
        </div>,
        document.body
    );
}
