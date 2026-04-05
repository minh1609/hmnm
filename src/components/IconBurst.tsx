import { createPortal } from 'react-dom';
import { useEffect } from 'react';

interface Props {
    x: number;
    y: number;
    icon: string;
    onDone: () => void;
}

const COUNT = 18;

export function IconBurst({ x, y, icon, onDone }: Props) {
    useEffect(() => {
        const timer = setTimeout(onDone, 1500);
        return () => clearTimeout(timer);
    }, [onDone]);

    const particles = Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * 2 * Math.PI + (Math.random() - 0.5) * 0.6;
        const distance = 55 + Math.random() * 90;
        const bx = Math.cos(angle) * distance;
        const by = Math.sin(angle) * distance;
        const delay = Math.random() * 0.18;
        const size = 1.1 + Math.random() * 1.0;

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
