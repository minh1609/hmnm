// ── Data Profile ──────────────────────────────────────────────────────────────

/**
 * Which data folder under `src/data/` to use.
 * Each profile folder must have an `index.ts` that exports
 * `datingTimeline`, `trips`, `IMAGE_FILES`, and `ICONS`.
 *
 * Available profiles: 'mindy'
 */
export const activeProfile = 'mindy' as const;

export type DataProfile = typeof activeProfile;

// ── FallingObjects ────────────────────────────────────────────────────────────

export const fallingObjects = {
    /**
     * How many image particles (transparent PNGs from public/particles/) to
     * render in the ambient background. Higher values are denser but costlier.
     */
    imageCount: 6,

    /**
     * How many emoji/icon particles to render alongside the images.
     * Total ambient particles = imageCount + iconCount.
     */
    iconCount: 10,

    particle: {
        /**
         * Horizontal spread: particles are placed at a random horizontal
         * position between these two percentages of the viewport width.
         */
        leftMin: 0,
        leftMax: 100,

        /** Particle size range in pixels (applies to both images and icons). */
        sizeMin: 18,
        sizeMax: 36,

        /**
         * Fall duration range in seconds. Shorter = faster falling particles.
         * Each particle picks a random value in [durationMin, durationMax].
         */
        durationMin: 10,
        durationMax: 24,

        /**
         * Negative delay staggers particles so they don't all start from the
         * top simultaneously. Range is in seconds; must be ≤ 0.
         */
        delayMin: -24,
        delayMax: 0,

        /**
         * Translucency of idle particles. 1 = fully opaque, 0 = invisible.
         * Particles become fully opaque on hover regardless of this setting.
         */
        opacityMin: 0.25,
        opacityMax: 0.55,

        /**
         * Horizontal sway (the `fallingDrift` CSS keyframe uses `--drift`).
         * Positive values drift right, negative drift left; particles can do
         * either depending on the random pick within [driftMin, driftMax].
         */
        driftMin: -40,
        driftMax: 40,
    },
} as const;

// ── IconBurst ─────────────────────────────────────────────────────────────────

export const iconBurst = {
    /**
     * Number of emoji particles emitted per burst. More particles = a fuller
     * explosion, but each burst creates this many DOM nodes temporarily.
     */
    count: 18,

    /**
     * How long (ms) the burst animation stays on screen before `onDone` is
     * called and the portal is removed. Should match the CSS animation length.
     */
    durationMs: 1500,

    /**
     * Random jitter added to each particle's evenly-distributed angle (radians).
     * Keeps the burst from looking like a perfect ring.
     */
    angleJitter: 0.6,

    /** Minimum travel distance from the burst origin in pixels. */
    distanceMin: 55,

    /**
     * Extra random distance on top of `distanceMin`.
     * Effective range: [distanceMin, distanceMin + distanceExtra].
     */
    distanceExtra: 90,

    /** Maximum random stagger delay per particle in seconds. */
    maxDelay: 0.18,

    /** Base font-size of each emoji particle in rem. */
    sizeBase: 1.1,

    /** Maximum extra font-size added randomly on top of `sizeBase` in rem. */
    sizeExtra: 1.0,
} as const;
