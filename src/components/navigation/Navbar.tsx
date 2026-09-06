"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { lockScroll, scrollToId } from "@/components/animation/SmoothScroll";

const LINKS: [string, string][] = [
    ["services", "SERVICES"],
    ["work", "WORK"],
    ["studio", "STUDIO"],
    ["contact", "CONTACT"],
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const ob = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: "-42% 0px -52% 0px" }
        );
        LINKS.forEach(([id]) => {
            const el = document.getElementById(id);
            if (el) ob.observe(el);
        });
        return () => ob.disconnect();
    }, []);

    useEffect(() => {
        lockScroll(open);
        return () => lockScroll(false);
    }, [open]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    function go(id: string) {
        setOpen(false);
        setTimeout(() => scrollToId(id), 450);
    }

    return (
        <>
            <header
                className={`glass-nav fixed left-1/2 top-4 z-50 flex h-[60px] w-[calc(100vw-2rem)] max-w-[1200px] -translate-x-1/2 items-center gap-7 rounded-full px-5 sm:gap-9 sm:px-7 ${
                    scrolled ? "sc" : ""
                }`}
            >
                <a
                    href="#hero"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId("hero");
                    }}
                    className="mr-auto"
                    aria-label="Wajjeha — back to top"
                >
                    <Image src="/brand/wajjeha-horizontal.png" alt="Wajjeha" width={344} height={80} priority className="h-8 w-auto" />
                </a>

                <nav className="hidden gap-7 lg:flex">
                    {LINKS.map(([id, label]) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToId(id);
                            }}
                            className={`relative py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] no-underline transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:bg-blued after:transition-[width] hover:after:w-full ${
                                active === id ? "text-blued after:w-full" : ""
                            }`}
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <button onClick={() => scrollToId("contact")} className="btn solid pill hidden lg:inline-flex">
                    Start a project
                </button>

                <button
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={open}
                    className="relative h-10 w-10 lg:hidden"
                >
                    <i className="absolute left-[9px] top-[14px] block h-[2px] w-[22px] bg-ink" />
                    <i className="absolute left-[9px] top-[19px] block h-[2px] w-[22px] bg-ink" />
                    <i className="absolute left-[9px] top-[24px] block h-[2px] w-[22px] bg-ink" />
                </button>
            </header>

            {/* mobile overlay menu — dark glass over the locked page */}
            <div
                className={`glass-veil fixed inset-0 z-[60] flex flex-col text-paper transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                    open ? "translate-y-0" : "pointer-events-none -translate-y-full"
                }`}
                aria-hidden={!open}
            >
                <div className="flex items-center justify-between px-5 pt-6 sm:px-10">
                    <Image src="/brand/wajjeha-icon.png" alt="" width={40} height={40} className="h-10 w-10" />
                    <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 font-mono text-[11px] tracking-[0.2em] text-mut">
                        CLOSE ×
                    </button>
                </div>
                <nav className="flex flex-1 flex-col justify-center gap-1 px-8 sm:px-12">
                    {LINKS.map(([id, label]) => (
                        <button key={id} onClick={() => go(id)} className="py-1.5 text-left font-serif text-[clamp(34px,8vw,52px)] capitalize transition-all hover:pl-3 hover:text-blue">
                            {label.toLowerCase()}
                        </button>
                    ))}
                    <button onClick={() => go("contact")} className="btn solid pill mt-8 self-start border-paper text-paper">
                        Start a project
                    </button>
                </nav>
                <p className="px-8 pb-10 font-mono text-[10px] tracking-[0.2em] text-mut sm:px-12">
                    WAJJJEHA.CLOUD — ONE ECOSYSTEM. EVERY PLATFORM.
                </p>
            </div>
        </>
    );
}