import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { iconBurst } from '@/config';

interface Props {
    x: number;
    y: number;
    icon: string;
    onDone: () => void;
}

export function IconBurst({ x, y, icon, onDone }: Props) {
    useEffect(() => {
        const timer = setTimeout(onDone, iconBurst.durationMs);
        return () => clearTimeout(timer);
    }, [onDone]);

    const particles = Array.from({ length: iconBurst.count }, (_, i) => {
        const angle = (i / iconBurst.count) * 2 * Math.PI + (Math.random() - 0.5) * iconBurst.angleJitter;
        const distance = iconBurst.distanceMin + Math.random() * iconBurst.distanceExtra;
        const bx = Math.cos(angle) * distance;
        const by = Math.sin(angle) * distance;
        const delay = Math.random() * iconBurst.maxDelay;
        const size = iconBurst.sizeBase + Math.random() * iconBurst.sizeExtra;

        return (
            <span
                key={i}
                className="burst-particle"
                style={
                    {
                        left: x,
                        top: y,
                        '--bx': `${bx}px`,
                        '--by': `${by}px`,
                        animationDelay: `${delay}s`,
                        fontSize: `${size}rem`,
                    } as React.CSSProperties
                }
            >
                {icon}
            </span>
        );
    });

    return createPortal(<>{particles}</>, document.body);
}
