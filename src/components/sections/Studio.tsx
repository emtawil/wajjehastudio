import { Reveal } from "@/components/animation/Reveal";
import { Wrap } from "@/components/layout/Wrap";

const PRINCIPLES: [string, string, string, string][] = [
    ["01", "Design and engineering, one act", "The same hands sketch the interface and write the query. No hand-offs, no translation loss.", ""],
    ["02", "One stack, every platform", "Web, mobile and desktop share components, conventions and one way of thinking — so your product feels like one product.", "lg:ml-[44px]"],
    ["03", "Systems, not screens", "Reusable design systems on Tailwind and shadcn/ui — interfaces that scale by addition, not redesign.", "lg:ml-[88px]"],
    ["04", "Performance is a design decision", "Budgets for speed and weight are set with the first sketch, not discovered in production.", "lg:ml-[132px]"],
    ["05", "Product thinking", "Every surface is judged the way users judge it: in the half-second before the next click.", "lg:ml-[176px]"],
];

export function Studio() {
    return (
        <section id="studio" className="scroll-mt-24 py-[120px]">
            <Wrap>
                <Reveal>
                    <span className="mb-5 block font-mono text-[10.5px] font-medium tracking-[.26em] text-blued">03 — STUDIO</span>
                    <p className="max-w-[980px] font-serif text-[clamp(26px,3.4vw,46px)] leading-[1.32] tracking-[-.01em]">
                        Most software fails at the <em className="text-blued">point of contact</em> — the screen, the tap, the
                        half-second before the next click. Wajjeha exists for that half-second: engineers who design,
                        designers who ship, <em className="text-blued">one team</em> from the first sketch to the last deploy.
                    </p>
                </Reveal>

                <div className="mt-[84px]">
                    {PRINCIPLES.map(([n, t, d, ml], i) => (
                        <Reveal key={n} className={`border-t border-line py-6 pl-3 ${i === PRINCIPLES.length - 1 ? "border-b" : ""} ${ml}`}>
                            <div className="grid items-baseline gap-4 md:grid-cols-[64px_260px_1fr] md:gap-6">
                                <span className="font-mono text-[11px] font-medium text-blued">{n}</span>
                                <span className="text-base font-semibold uppercase tracking-[0.04em]">{t}</span>
                                <span className="max-w-[52ch] text-[14.5px] leading-[1.7] text-hold">{d}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Wrap>
        </section>
    );
}