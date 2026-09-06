"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

let lenis: Lenis | null = null;

export function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -84, duration: 1.1 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function lockScroll(lock: boolean) {
    document.body.style.overflow = lock ? "hidden" : "";
    if (lock) lenis?.stop();
    else lenis?.start();
}

/* How this load happened:
   - "navigate" → a fresh entry (URL typed, or linked from outside) → honor #section deep links
   - "reload"   → a refresh → always start at the very top, and drop any stale hash
   - anything else (back/forward, prerender) → top as well — restored offsets are
     meaningless while the portfolio scene is pinned */
function isDeepLinkEntry(): boolean {
    try {
        const nav = performance.getEntriesByType("navigation")[0] as
            | PerformanceNavigationTiming
            | undefined;
        return nav?.type === "navigate" && window.location.hash.length > 1;
    } catch {
        return false;
    }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
    useEffect(() => {
        // The pinned portfolio scene makes restored offsets land mid-scene —
        // we own the scroll position, not the browser.
        if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

        const deepLink = isDeepLinkEntry();
        const hash = deepLink ? window.location.hash : "";

        // a hash left over from an in-page anchor before a refresh — strip it,
        // so reloads stop re-entering the pinned scene
        if (!deepLink && window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }

        if (prefersReducedMotion()) {
            if (deepLink) document.getElementById(hash.slice(1))?.scrollIntoView();
            else window.scrollTo(0, 0);
            return;
        }

        // kill any browser-restored position before Lenis adopts it
        if (!deepLink) window.scrollTo(0, 0);

        lenis = new Lenis({ lerp: 0.1 });
        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        if (!deepLink) lenis.scrollTo(0, { immediate: true });

        // a true deep link lands at its correct offset only after fonts settle
        // and the pin is laid out (the native hash jump fires too early — before
        // the pin exists — so it lands wrong; we redo it properly)
        document.fonts?.ready.then(() => {
            ScrollTrigger.refresh();
            if (hash) scrollToId(hash.slice(1));
        });

        return () => {
            gsap.ticker.remove(raf);
            lenis?.destroy();
            lenis = null;
        };
    }, []);

    return <>{children}</>;
}