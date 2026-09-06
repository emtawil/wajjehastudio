"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

export function PreviewFrame({ p }: { p: Project }) {
    const screenRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [near, setNear] = useState(false);   // load the demo only when approaching
    const [active, setActive] = useState(true); // run it only while on-screen

    /* scale-to-fit */
    useEffect(() => {
        const fit = () => {
            const s = screenRef.current;
            const f = iframeRef.current;
            if (!s || !f) return;
            f.style.transform = `scale(${s.clientWidth / p.w})`;
        };
        fit();
        const ro = new ResizeObserver(fit);
        if (screenRef.current) ro.observe(screenRef.current);
        return () => ro.disconnect();
    }, [p.w]);

    /* mount: don't even load the demo until its tile is close to the viewport */
    useEffect(() => {
        const el = screenRef.current;
        if (!el) return;
        const ob = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setNear(true);
                    ob.disconnect();
                }
            },
            { rootMargin: "600px" }
        );
        ob.observe(el);
        return () => ob.disconnect();
    }, []);

    /* pause: a display:none iframe has its rAF suspended and its timers
       throttled by the browser — off-screen demos cost (almost) nothing */
    useEffect(() => {
        const el = screenRef.current;
        if (!el) return;
        const ob = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
            rootMargin: "150px",
        });
        ob.observe(el);
        return () => ob.disconnect();
    }, []);

    useEffect(() => {
        const f = iframeRef.current;
        if (f) f.style.display = active ? "" : "none";
    }, [active, near]);

    return (
        <div className="pframe">
            {p.frame === "browser" && (
                <div className="flex items-center gap-3 rounded-t-[10px] border border-b-0 border-linep glass-bar px-4 py-[11px]">
          <span className="flex gap-1.5">
            <i className="h-[9px] w-[9px] rounded-full bg-[#39424e] transition-colors group-hover:bg-blue" />
            <i className="h-[9px] w-[9px] rounded-full bg-[#39424e]" />
            <i className="h-[9px] w-[9px] rounded-full bg-[#39424e]" />
          </span>
                    <span className="flex-1 truncate font-mono text-[10.5px] tracking-[0.08em] text-mut">{p.url}</span>
                </div>
            )}
            {p.frame === "mac" && (
                <div className="flex items-center gap-3 rounded-t-[10px] border border-b-0 border-linep glass-bar px-4 py-[11px]">
          <span className="flex gap-[7px]">
            <i className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
            <i className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
            <i className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          </span>
                    <span className="flex-1 truncate text-center font-mono text-[10.5px] tracking-[0.1em] text-mut">{p.title}</span>
                    <span className="rounded border border-linep px-2 py-[3px] font-mono text-[9px] tracking-[0.14em] text-mut">{p.meta}</span>
                </div>
            )}
            <div
                ref={screenRef}
                className={`pscreen ${p.frame === "browser" || p.frame === "mac" ? "rbrowser" : ""} ${
                    p.frame === "phone" ? "phone" : ""
                } transition-colors group-hover:border-blue/60`}
                style={{ aspectRatio: `${p.w} / ${p.h}` }}
            >
                {p.frame === "phone" && <span className="isl" aria-hidden="true" />}
                <div className="absolute inset-0 overflow-hidden">
                    <iframe
                        ref={iframeRef}
                        src={near ? `/designs/${p.slug}.html` : "about:blank"}
                        title={`${p.name} — live preview`}
                        tabIndex={-1}
                        loading="lazy"
                        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                        style={{ width: p.w, height: p.h }}
                    />
                </div>
            </div>
        </div>
    );
}