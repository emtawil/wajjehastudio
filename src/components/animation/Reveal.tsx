"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function Reveal({
                           children,
                           className = "",
                           delay = 0,
                           y = 30,
                       }: {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            el.classList.add("in");
            return;
        }
        const ob = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    el.classList.add("in");
                    ob.disconnect();
                }
            },
            { rootMargin: "0px 0px -10% 0px" }
        );
        ob.observe(el);
        return () => ob.disconnect();
    }, []);

    const style: CSSProperties = {
        ...(delay ? { transitionDelay: `${delay}ms` } : {}),
        ...(y !== 30 ? ({ "--rv-y": `${y}px` } as CSSProperties) : {}),
    };

    return (
        <div ref={ref} className={`rv ${className}`} style={style}>
            {children}
        </div>
    );
}