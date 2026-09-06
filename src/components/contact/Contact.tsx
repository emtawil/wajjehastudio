"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/animation/Reveal";
import { Wrap } from "@/components/layout/Wrap";

const MAIL = "hello@wajjeha.cloud";
const NEEDS = [
    "A website or landing page",
    "An online store",
    "A web application",
    "A desktop / ERP app",
    "A mobile app (iOS + Android)",
    "A ride-hail or delivery platform",
    "Not sure yet — help me",
];
const BUDGETS = ["Under $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Let's talk"];

const labelCls = "mb-1.5 block font-mono text-[9.5px] font-medium tracking-[0.22em] text-mut";
const fieldCls = (bad: boolean) =>
    `w-full appearance-none rounded-none border-0 border-b ${bad ? "border-blued" : "border-ink"} bg-transparent py-2.5 font-sans text-base outline-none transition-colors focus:border-blue`;

export function Contact() {
    const [copied, setCopied] = useState(false);
    const [bad, setBad] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function copyEmail() {
        try {
            await navigator.clipboard.writeText(MAIL);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = MAIL;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch { /* give up gracefully */ }
            ta.remove();
        }
        setCopied(true);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 2000);
    }

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name") ?? "").trim();
        const email = String(fd.get("email") ?? "").trim();
        const message = String(fd.get("message") ?? "").trim();
        const need = String(fd.get("need") ?? "");
        const budget = String(fd.get("budget") ?? "");

        const errs: typeof bad = {};
        if (!name) errs.name = true;
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = true;
        if (!message) errs.message = true;
        setBad(errs);
        if (Object.keys(errs).length) return;

        const subject = `Project brief — ${need}`;
        const body = `Name: ${name}\nEmail: ${email}\nNeed: ${need}\nBudget: ${budget}\n\n${message}`;
        window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    return (
        <section id="contact" className="scroll-mt-24 py-[130px]">
            <Wrap>
                <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <Reveal>
                            <span className="mb-5 block font-mono text-[10.5px] font-medium tracking-[0.26em] text-blued">05 — CONTACT</span>
                            <h2 className="font-serif text-[clamp(40px,5.6vw,84px)] leading-[1] tracking-[-0.02em]">
                                Have an <em className="text-blued">interface</em> in mind?
                            </h2>
                        </Reveal>

                        <Reveal className="mt-10 flex flex-wrap items-center gap-5" delay={80}>
                            <a
                                href={`mailto:${MAIL}`}
                                className="border-b-2 border-ink font-serif text-[clamp(22px,3.4vw,40px)] italic transition-colors hover:border-blue hover:text-blued"
                            >
                                {MAIL}
                            </a>
                            <button
                                onClick={copyEmail}
                                aria-label="Copy email address"
                                className="grid h-[46px] w-[46px] -translate-y-1 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-paper"
                            >
                                {copied ? (
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                        <path d="M2 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.6" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <rect x="5" y="5" width="9" height="9" stroke="currentColor" strokeWidth="1.3" />
                                        <path d="M11 5V2H2v9h3" stroke="currentColor" strokeWidth="1.3" />
                                    </svg>
                                )}
                            </button>
                        </Reveal>

                        <Reveal className="mt-14 flex flex-col gap-4" delay={140}>
                            {[
                                "DIRECT CONTACT — NO ACCOUNT MANAGERS",
                                "REMOTE-FIRST · WORKS WORLDWIDE",
                                "WE REPLY TO EVERY BRIEF PERSONALLY",
                            ].map((m) => (
                                <span key={m} className="flex items-center gap-3 font-mono text-[9.5px] font-medium tracking-[0.2em] text-mut">
                  <span className="h-[5px] w-[5px] flex-none bg-blue" />
                                    {m}
                </span>
                            ))}
                        </Reveal>
                    </div>

                    <Reveal delay={120} className="relative">
                        {/* soft blue aura behind the card — gives the glass something to refract */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-10 -z-10"
                            style={{
                                background:
                                    "radial-gradient(55% 55% at 30% 25%, rgba(79,179,255,0.35), transparent 70%), radial-gradient(45% 45% at 78% 80%, rgba(79,179,255,0.22), transparent 70%)",
                            }}
                        />
                        <form onSubmit={onSubmit} noValidate className="glass p-7 sm:p-10">
                            <p className="mb-8 font-mono text-[10px] font-medium tracking-[0.26em] text-blued">PROJECT BRIEF — 60 SECONDS</p>
                            <div className="grid gap-7 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="c-name" className={labelCls}>YOUR NAME</label>
                                    <input id="c-name" name="name" autoComplete="name" className={fieldCls(!!bad.name)} />
                                </div>
                                <div>
                                    <label htmlFor="c-mail" className={labelCls}>EMAIL</label>
                                    <input id="c-mail" name="email" type="email" autoComplete="email" className={fieldCls(!!bad.email)} />
                                </div>
                                <div>
                                    <label htmlFor="c-need" className={labelCls}>WHAT DO YOU NEED?</label>
                                    <div className="relative">
                                        <select id="c-need" name="need" className={`${fieldCls(false)} pr-8`} defaultValue={NEEDS[0]}>
                                            {NEEDS.map((n) => <option key={n}>{n}</option>)}
                                        </select>
                                        <svg className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" /></svg>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="c-bud" className={labelCls}>BUDGET</label>
                                    <div className="relative">
                                        <select id="c-bud" name="budget" className={`${fieldCls(false)} pr-8`} defaultValue={BUDGETS[4]}>
                                            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                                        </select>
                                        <svg className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" /></svg>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="c-msg" className={labelCls}>TELL US ABOUT IT</label>
                                    <textarea
                                        id="c-msg"
                                        name="message"
                                        rows={4}
                                        placeholder="What are you building, who is it for, when does it need to exist?"
                                        className={`${fieldCls(!!bad.message)} min-h-24 resize-y`}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn solid mt-9 w-full justify-center">Send the brief</button>
                            <p className="mt-5 text-center font-mono text-[9px] tracking-[0.16em] text-mut">
                                OPENS YOUR MAIL APP — NO DATA LEAVES THIS PAGE
                            </p>
                        </form>
                    </Reveal>
                </div>
            </Wrap>
        </section>
    );
}