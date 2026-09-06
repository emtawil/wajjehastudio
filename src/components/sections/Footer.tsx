"use client";

import { useState } from "react";
import Image from "next/image";
import { Wrap } from "@/components/layout/Wrap";
import { scrollToId } from "@/components/animation/SmoothScroll";

const FOOTER_LINKS: [string, string][] = [
    ["services", "SERVICES"],
    ["work", "WORK"],
    ["studio", "STUDIO"],
    ["contact", "CONTACT"],
];

export function Footer() {
    const [failed, setFailed] = useState(false);

    return (
        <footer className="bg-ink pb-8 pt-20 text-paper">
            <Wrap>
                {failed ? (
                    <div className="font-serif text-[clamp(64px,11vw,180px)] font-[550] leading-[0.85] tracking-[-0.02em]">
                        WAJJJEHA<span className="text-blue">.</span>
                    </div>
                ) : (
                    <Image
                        src="/brand/wajjeha-text-light.png"
                        alt="Wajjeha"
                        width={1400}
                        height={300}
                        onError={() => setFailed(true)}
                        className="h-auto w-full"
                    />
                )}

                <p className="mt-6 font-mono text-[10px] tracking-[0.22em] text-mut">
                    ONE ECOSYSTEM. EVERY PLATFORM. — <span className="font-ar text-[12px]">واجهة</span>
                </p>

                <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-linep pt-7 font-mono text-[9.5px] tracking-[0.18em] text-mut">
                    <span>© {new Date().getFullYear()} WAJJJEHA — WAJJJEHA.CLOUD</span>
                    <nav className="flex gap-7">
                        {FOOTER_LINKS.map(([id, label]) => (
                            <button
                                key={id}
                                onClick={() => scrollToId(id)}
                                className="text-paper no-underline transition-colors hover:text-blue"
                            >
                                {label}
                            </button>
                        ))}
                    </nav>
                    <span>BUILT WITH OUR OWN STACK</span>
                </div>
            </Wrap>
        </footer>
    );
}