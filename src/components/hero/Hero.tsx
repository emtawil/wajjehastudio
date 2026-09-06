"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToId } from "@/components/animation/SmoothScroll";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const WORDS: { t: string; em?: boolean }[] = [
    { t: "One" },
    { t: "ecosystem.", em: true },
    { t: "Every" },
    { t: "platform.", em: true },
];

const PLATFORMS: [string, string, string][] = [
    ["01", "Web", "WEBSITES · PLATFORMS · WEB APPS"],
    ["02", "Mobile", "IOS · ANDROID"],
    ["03", "Desktop", "WINDOWS · MACOS · LINUX"],
];

const CHARS = "واجيهتملكبرس0123456789{}<>/=+#*;";
type Glyph = { ch: string; ar: boolean; hx: number; hy: number; x: number; y: number; ph: number; sp: number; sz: number };

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    /* entrance timeline + scroll parallax */
    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section || prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-word",
                { y: 56, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.09, delay: 0.15, ease: "power4.out" }
            );
            gsap.fromTo(
                "[data-hero-fade]",
                { y: 26, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, delay: 0.55, ease: "power3.out" }
            );
            gsap.to(contentRef.current, {
                y: -80,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
            });
        }, section);
        return () => ctx.revert();
    }, []);

    /* mouse-reactive glyph field — sprite-cached for cheap frames */
    useLayoutEffect(() => {
        // 1 — read the refs and guard them…
        const heroNode = sectionRef.current;
        const canvasNode = canvasRef.current;
        if (!heroNode || !canvasNode || prefersReducedMotion()) return;
        const ctxNode = canvasNode.getContext("2d");
        if (!ctxNode) return;

        // 2 — …then re-bind to consts whose declared type is non-null.
        const hero = heroNode;
        const cvs = canvasNode;
        const ctx = ctxNode;

        // next/font renames families — read the real computed names from a probe
        const probe = document.createElement("span");
        probe.style.cssText = "position:absolute;opacity:0;pointer-events:none";
        document.body.appendChild(probe);
        probe.className = "font-ar";
        const arFam = getComputedStyle(probe).fontFamily;
        probe.className = "font-mono";
        const monoFam = getComputedStyle(probe).fontFamily;
        probe.remove();

        let W = 0, H = 0, raf = 0, visible = true;
        let glyphs: Glyph[] = [];
        const mouse = { x: -9999, y: -9999 };
        let lastMove = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        // --- sprite cache --------------------------------------------------
        type Sprite = { c: HTMLCanvasElement; ax: number; ay: number; w: number; h: number };
        const sprites = new Map<string, Sprite>();

        function getSprite(ch: string, ar: boolean, sz: number, accent: boolean): Sprite {
            const key = ch + (ar ? "|a" : "|m") + "|" + sz + (accent ? "|+" : "|-");
            const hit = sprites.get(key);
            if (hit) return hit;
            const fam = ar ? arFam : monoFam;
            const px = sz * dpr;
            const c = document.createElement("canvas");
            const m = c.getContext("2d");
            if (!m) return { c, ax: 0, ay: 0, w: 1, h: 1 };
            m.font = `400 ${px}px ${fam}`;
            const tm = m.measureText(ch);
            const asc = Math.ceil(tm.actualBoundingBoxAscent ?? px * 0.8) + 1;
            const desc = Math.ceil(tm.actualBoundingBoxDescent ?? px * 0.25) + 1;
            c.width = Math.max(1, Math.ceil(tm.width) + 2);
            c.height = Math.max(1, asc + desc);
            m.font = `400 ${px}px ${fam}`; // resizing a canvas resets its state
            m.textBaseline = "alphabetic";
            m.fillStyle = accent ? "#4fb3ff" : "rgba(11,14,19,0.16)";
            m.fillText(ch, 1, asc);
            const s: Sprite = { c, ax: 1 / dpr, ay: asc / dpr, w: c.width / dpr, h: c.height / dpr };
            sprites.set(key, s);
            return s;
        }

        function build() {
            W = hero.clientWidth;
            H = hero.clientHeight;
            const next = Math.min(window.devicePixelRatio || 1, 2);
            if (next !== dpr) { dpr = next; sprites.clear(); }
            cvs.width = W * dpr;
            cvs.height = H * dpr;
            cvs.style.width = `${W}px`;
            cvs.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            glyphs = [];
            let gap = W < 720 ? 34 : 46;
            if ((W / gap) * (H / gap) > 1500) gap = Math.ceil(Math.sqrt((W * H) / 1500));
            for (let y = gap * 0.5; y < H; y += gap) {
                for (let x = gap * 0.5; x < W; x += gap) {
                    const g: Glyph = {
                        ch: CHARS[Math.floor(Math.random() * CHARS.length)],
                        ar: Math.random() < 0.38,
                        hx: x + (Math.random() - 0.5) * 14,
                        hy: y + (Math.random() - 0.5) * 14,
                        x: 0, y: 0,
                        ph: Math.random() * 6.28,
                        sp: 0.5 + Math.random(),
                        sz: Math.round(11 + Math.random() * 4),
                    };
                    g.x = g.hx;
                    g.y = g.hy;
                    glyphs.push(g);
                }
            }
        }

        function frame(t: number) {
            if (visible) {
                let tx = mouse.x, ty = mouse.y;
                if (t - lastMove > 3500) {
                    // phantom cursor keeps the field alive when idle / on touch
                    tx = W * 0.5 + Math.cos(t * 0.00042) * W * 0.3;
                    ty = H * 0.45 + Math.sin(t * 0.00061) * H * 0.28;
                }
                ctx.clearRect(0, 0, W, H);
                for (const g of glyphs) {
                    let nx = g.hx + Math.sin(t * 0.0005 * g.sp + g.ph) * 4;
                    let ny = g.hy + Math.cos(t * 0.0004 * g.sp + g.ph) * 3;
                    const dx = nx - tx, dy = ny - ty;
                    const d = Math.hypot(dx, dy);
                    if (d < 150 && d > 0.01) {
                        const f = Math.pow(1 - d / 150, 2) * 42;
                        nx += (dx / d) * f;
                        ny += (dy / d) * f;
                    }
                    g.x += (nx - g.x) * 0.085;
                    g.y += (ny - g.y) * 0.085;
                    const dm = Math.hypot(g.x - tx, g.y - ty);
                    if (dm < 130) {
                        const s = getSprite(g.ch, g.ar, g.sz, true);
                        ctx.globalAlpha = 0.35 + 0.55 * (1 - dm / 130);
                        ctx.drawImage(s.c, g.x - s.ax, g.y - s.ay, s.w, s.h);
                    } else {
                        const s = getSprite(g.ch, g.ar, g.sz, false);
                        ctx.globalAlpha = 0.16;
                        ctx.drawImage(s.c, g.x - s.ax, g.y - s.ay, s.w, s.h);
                    }
                }
                ctx.globalAlpha = 1;
            }
            raf = requestAnimationFrame(frame);
        }

        const onMove = (e: PointerEvent) => {
            const r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
            lastMove = performance.now();
        };
        const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
        const io = new IntersectionObserver((en) => (visible = en[0].isIntersecting));
        let rz: ReturnType<typeof setTimeout>;
        const onResize = () => { clearTimeout(rz); rz = setTimeout(build, 200); };

        build();
        raf = requestAnimationFrame(frame);
        io.observe(hero);
        hero.addEventListener("pointermove", onMove);
        hero.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            hero.removeEventListener("pointermove", onMove);
            hero.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("resize", onResize);
            clearTimeout(rz);
        };
    }, []);

    return (
        <section ref={sectionRef} id="hero" className="relative flex min-h-svh flex-col justify-center overflow-hidden pb-14 pt-[120px]">
            <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />

            <div ref={contentRef} className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-10 lg:px-12">
                <div data-hero-fade className="mb-9 flex items-center justify-between font-mono text-[10px] font-medium tracking-[0.22em] text-mut">
          <span className="flex items-center gap-2.5">
            <span className="h-2 w-2 bg-blue" />
            SOFTWARE STUDIO
          </span>
                    <span>WAJJJEHA.CLOUD</span>
                </div>

                <div className="grid items-end gap-14 lg:grid-cols-[1fr_340px]">
                    <div>
                        <h1 className="font-serif text-[clamp(50px,8.4vw,124px)] font-[380] leading-[0.98] tracking-[-0.02em] [font-variation-settings:'opsz'_144]">
                            {WORDS.map((w) => (
                                <span key={w.t} className="hero-word mr-[0.24em] inline-block whitespace-nowrap">
                  {Array.from(w.t).map((ch, i) => (
                      <span key={i} className={`L ${w.em ? "italic" : ""}`}>
                      {ch}
                    </span>
                  ))}
                </span>
                            ))}
                        </h1>
                        <p data-hero-fade className="mt-9 max-w-[560px] text-base leading-[1.75] text-hold">
                            Wajjeha is a software studio building modern software for web, mobile and desktop —
                            designed and engineered as one ecosystem, from database to last pixel.
                        </p>
                        <div data-hero-fade className="mt-9 flex flex-wrap gap-3.5">
                            <button className="btn solid" onClick={() => scrollToId("work")}>See our work</button>
                            <button className="btn" onClick={() => scrollToId("contact")}>Start a project</button>
                        </div>
                    </div>

                    <div data-hero-fade className="relative pb-2">
                        <div className="relative mb-7 hidden h-[148px] w-[148px] md:block">
                            <svg className="absolute inset-0" viewBox="0 0 140 140" aria-hidden="true">
                                <defs>
                                    <path id="ring" d="M70 70 m-52 0 a52 52 0 1 1 104 0 a52 52 0 1 1 -104 0" />
                                </defs>
                                <circle cx="70" cy="70" r="66" fill="none" stroke="rgb(11 14 19 / 0.25)" strokeWidth="1" />
                                <g className="spin">
                                    <text className="font-mono" fill="#0b0e13" fontSize="9.5" letterSpacing="1.4">
                                        <textPath href="#ring" textLength="320" lengthAdjust="spacingAndGlyphs">
                                            WAJJJEHA.CLOUD · ONE ECOSYSTEM · EVERY PLATFORM ·
                                        </textPath>
                                    </text>
                                </g>
                            </svg>
                            <Image src="/brand/wajjeha-icon.png" alt="Wajjeha" width={44} height={44} className="absolute inset-0 m-auto h-11 w-11" />
                        </div>
                        <div>
                            {/* keep the pixel numbers you got from the sips step for wajjeha-ar.png */}
                            <Image
                                src="/brand/wajjeha-ar.png"
                                alt="واجهة — the Wajjeha wordmark"
                                width={1400}
                                height={404}
                                className="h-auto w-full max-w-[340px]"
                            />
                            <p className="mt-3.5 max-w-[300px] font-mono text-[10.5px] leading-[1.9] tracking-[0.06em] text-mut">
                                <span className="font-ar text-ink">واجهة</span> — waj·je·ha — noun, Arabic:{" "}
                                <em>interface</em>; the surface where people meet the machine.
                            </p>
                        </div>
                    </div>
                </div>

                <div data-hero-fade className="mt-[72px] flex flex-wrap items-end gap-x-12 gap-y-6 border-t border-line pt-6">
                    {PLATFORMS.map(([n, t, m]) => (
                        <div key={n} className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] font-medium text-blued">{n}</span>
                            <b className="font-serif text-[26px] font-semibold leading-none">{t}</b>
                            <span className="font-mono text-[9.5px] tracking-[0.18em] text-mut">{m}</span>
                        </div>
                    ))}
                    <span className="ml-auto hidden items-center gap-2.5 self-center font-mono text-[10px] tracking-[0.24em] text-mut md:flex">
            SCROLL
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="animate-bounce">
              <path d="M5 1v11M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
                </div>
            </div>
        </section>
    );
}