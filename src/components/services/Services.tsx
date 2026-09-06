"use client";

import { useEffect, useState } from "react";
import { services } from "@/data/services";
import { Reveal } from "@/components/animation/Reveal";
import { Wrap } from "@/components/layout/Wrap";

export function Services() {
    const [open, setOpen] = useState<string | null>(null);
    // transitions only arm after the first frame — nothing animates during hydration
    const [armed, setArmed] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setArmed(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <section id="services" className="scroll-mt-24 py-[120px]">
            <Wrap>
                <Reveal className="mb-[60px] flex flex-wrap items-end justify-between gap-10">
                    <div>
                        <span className="mb-5 block font-mono text-[10.5px] font-medium tracking-[.26em] text-blued">01 — SERVICES</span>
                        <h2 className="font-serif text-[clamp(38px,5vw,74px)] leading-none tracking-[-.02em]">What we build.</h2>
                    </div>
                    <p className="max-w-[300px] text-right font-mono text-[10.5px] leading-[1.9] tracking-[.14em] text-mut">
                        FIVE SERVICE LINES, ONE TEAM.<br />CLICK A ROW TO EXPAND.
                    </p>
                </Reveal>

                <div>
                    {services.map((s, i) => {
                        const isOpen = open === s.idx;
                        return (
                            <Reveal key={s.idx} delay={(i % 3) * 70} className={`border-t border-line ${i === services.length - 1 ? "border-b" : ""}`}>
                                <button
                                    onClick={() => setOpen(isOpen ? null : s.idx)}
                                    aria-expanded={isOpen}
                                    className="group grid w-full grid-cols-[44px_1fr_40px] items-center gap-4 py-7 text-left md:grid-cols-[64px_1fr_auto_46px] md:gap-6 md:py-8"
                                >
                  <span className={`font-mono text-xs font-medium transition-colors ${isOpen ? "text-blued" : "text-mut group-hover:text-blued"}`}>
                    {s.idx}
                  </span>
                                    <span className="font-serif text-[clamp(24px,3.2vw,38px)] font-medium leading-[1.05] tracking-[-.01em] transition-transform duration-300 group-hover:translate-x-2.5">
                    {s.title}
                  </span>
                                    <span className="hidden font-mono text-[9.5px] tracking-[.2em] text-mut md:block">{s.tags}</span>
                                    <span className={`plus ${isOpen ? "open" : ""}`} />
                                </button>
                                <div
                                    aria-hidden={!isOpen}
                                    className={armed ? "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" : "grid"}
                                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                >
                                    <div className="overflow-hidden">
                                        <div className="grid gap-6 pb-11 md:grid-cols-[64px_1fr_1fr] md:gap-6">
                                            <p className="max-w-[52ch] text-[15px] leading-[1.8] text-hold md:col-start-2">{s.body}</p>
                                            <ul className="md:col-start-3">
                                                {s.deliverables.map((d) => (
                                                    <li key={d} className="flex gap-3 border-b border-line py-[11px] font-mono text-xs tracking-[.06em]">
                                                        <span className="mt-[6px] h-[5px] w-[5px] flex-none bg-blue" />
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </Wrap>
        </section>
    );
}