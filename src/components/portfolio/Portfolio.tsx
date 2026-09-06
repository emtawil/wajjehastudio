"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { PreviewFrame } from "./PreviewFrame";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Portfolio() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track || prefersReducedMotion()) return;

        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
            const tween = gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => "+=" + (distance() + 200),
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (st) => {
                        if (barRef.current) barRef.current.style.transform = `scaleX(${st.progress})`;
                        if (countRef.current) {
                            const i = Math.min(projects.length, Math.max(1, Math.round(st.progress * (projects.length - 1)) + 1));
                            countRef.current.textContent = String(i).padStart(2, "0");
                        }
                    },
                },
            });
            return () => {
                tween.scrollTrigger?.kill();
                tween.kill();
                gsap.set(track, { x: 0 });
            };
        });

        return () => mm.revert();
    }, []);

    return (
        <section ref={sectionRef} id="work" className="pwrap scroll-mt-0 bg-night text-paper">
            <div className="px-6 md:px-[72px] lg:pt-[104px]">
                <div className="flex flex-wrap items-end justify-between gap-10">
                    <div>
                        <span className="mb-5 block font-mono text-[10.5px] font-medium tracking-[.26em] text-blue">04 — SELECTED WORK</span>
                        <h2 className="font-serif text-[clamp(38px,4.6vw,64px)] leading-none tracking-[-.02em]">
                            Concepts, built<br />to be opened.
                        </h2>
                    </div>
                    <p className="max-w-[320px] text-right font-mono text-[10px] leading-[1.8] tracking-[.12em] text-mut">
                        EVERY PREVIEW IS A REAL, LIVE PAGE.<br />CLICK ANY CARD TO OPEN THE FULL<br />DESIGN IN A NEW TAB.
                    </p>
                </div>
            </div>

            <div ref={trackRef} className="ptrack pt-10 lg:pt-0">
                {projects.map((p, i) => (
                    <article key={p.slug} className="pcard group">
                        <PreviewFrame p={p} />
                        <div className="flex items-baseline gap-4 px-1">
                            <span className="font-mono text-[11px] font-medium text-blue">{String(i + 1).padStart(2, "0")}</span>
                            <h3 className="font-serif text-[22px] font-medium">{p.name}</h3>
                            <span className="ml-auto hidden font-mono text-[9px] tracking-[.16em] text-mut sm:block">{p.category}</span>
                        </div>
                        <p className="max-w-[46ch] px-1 text-[13.5px] leading-[1.65] text-[#98a0ab]">{p.blurb}</p>
                        <div className="flex flex-wrap items-center gap-2 px-1">
                            {p.tech.map((t) => (
                                <span key={t} className="border border-linep px-2.5 py-1 font-mono text-[8.5px] tracking-[.14em] text-mut">
                  {t}
                </span>
                            ))}
                            <a
                                href={`/designs/${p.slug}.html`}
                                target="_blank"
                                rel="noopener"
                                className="ml-auto font-mono text-[9.5px] tracking-[.18em] text-blue underline-offset-4 hover:underline"
                            >
                                OPEN FULL DESIGN ↗
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            <div className="pfoot">
        <span className="font-mono text-[11px] font-medium text-blue">
          <span ref={countRef}>01</span> / {String(projects.length).padStart(2, "0")}
        </span>
                <div className="h-px flex-1 bg-linep">
                    <div ref={barRef} className="h-px origin-left bg-blue" style={{ transform: "scaleX(0)" }} />
                </div>
                <span className="font-mono text-[9.5px] tracking-[.2em] text-mut">SCROLL — THE SCENE IS PINNED</span>
            </div>
        </section>
    );
}