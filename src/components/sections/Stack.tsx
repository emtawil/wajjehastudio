"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animation/Reveal";
import { Wrap } from "@/components/layout/Wrap";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const STACK: [string, string, string, string, string][] = [
    ["01", "LARAVEL", "BACKEND", "Routing, Eloquent, queues, testing — the backbone of our web applications.", "PHP 8 · ELOQUENT · QUEUES"],
    ["02", "INERTIA.JS", "GLUE", "Modern SPAs without an API tax — Laravel renders, React reacts.", "SSR · PARTIAL RELOADS"],
    ["03", "REACT", "UI RUNTIME", "The component model we use everywhere — web, mobile and desktop.", "HOOKS · COMPONENTS"],
    ["04", "NEXT.JS", "WEB FRAMEWORK", "Sites that render where it's cheapest — server, edge or static.", "SSR · ISR · APP ROUTER"],
    ["05", "VITE", "TOOLING", "Instant dev server and lean production builds, for sites and Electron apps.", "SPA · DESKTOP BUILDS"],
    ["06", "REACT NATIVE", "MOBILE", "One codebase, two stores, zero compromise.", "IOS · ANDROID"],
    ["07", "ELECTRON", "DESKTOP", "Desktop tools that feel native — tray, shortcuts, auto-update.", "WINDOWS · MACOS · LINUX"],
    ["08", "TAILWIND CSS", "STYLING", "Design tokens at typing speed. Consistency you can grep.", "TOKENS · VARIANTS"],
    ["09", "SHADCN/UI", "COMPONENTS", "Accessible primitives we copy, own and bend to your brand.", "RADIX · A11Y · OWNED"],
];

export function Stack() {
    const sectionRef = useRef<HTMLElement>(null);
    const ruleRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const rule = ruleRef.current;
        if (!section || !rule || prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                rule,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: { trigger: section, start: "top 85%", end: "bottom 70%", scrub: true },
                }
            );
        }, section);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="stack" className="scroll-mt-24 bg-paper2 py-[120px]">
            <Wrap>
                <Reveal className="mb-[60px] flex flex-wrap items-end justify-between gap-10">
                    <div>
                        <span className="mb-5 block font-mono text-[10.5px] font-medium tracking-[.26em] text-blued">02 — STACK</span>
                        <h2 className="font-serif text-[clamp(38px,5vw,74px)] leading-none tracking-[-.02em]">Tools we trust.</h2>
                    </div>
                    <p className="max-w-[300px] text-right font-mono text-[10.5px] leading-[1.9] tracking-[.14em] text-mut">
                        NINE TOOLS, ONE TOOLCHAIN —<br />NOTHING WE DON&apos;T USE IN PRODUCTION.
                    </p>
                </Reveal>

                <div ref={ruleRef} className="mb-2 h-px origin-left bg-blue" />

                {STACK.map((r, i) => (
                    <Reveal key={r[0]} delay={(i % 3) * 60} className={`border-t border-line ${i === STACK.length - 1 ? "border-b" : ""}`}>
                        <div className="group grid items-baseline gap-y-1 px-3 py-[22px] transition-shadow duration-200 hover:bg-paper hover:shadow-[inset_3px_0_0_#4fb3ff] md:grid-cols-[70px_210px_140px_1fr_auto] md:gap-6">
                            <span className="font-mono text-[11px] font-medium text-mut">{r[0]}</span>
                            <span className="text-[17px] font-bold tracking-[0.06em] transition-colors group-hover:text-blued">{r[1]}</span>
                            <span className="hidden font-mono text-[9.5px] tracking-[0.22em] text-mut md:block">{r[2]}</span>
                            <span className="max-w-[46ch] text-[13.5px] leading-[1.65] text-hold">{r[3]}</span>
                            <span className="hidden text-right font-mono text-[9px] tracking-[0.12em] text-mut md:block">{r[4]}</span>
                        </div>
                    </Reveal>
                ))}
            </Wrap>
        </section>
    );
}
