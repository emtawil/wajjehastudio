const ITEMS = [
    "WEB PLATFORMS", "WEB APPLICATIONS", "MOBILE APPS", "DESKTOP APPS", "UI & DESIGN SYSTEMS",
    "LARAVEL", "INERTIA.JS", "REACT", "NEXT.JS", "VITE", "REACT NATIVE", "ELECTRON",
    "TAILWIND CSS", "SHADCN/UI",
];

export function Marquee() {
    const seq = [...ITEMS, ...ITEMS];
    return (
        <div className="marquee overflow-hidden bg-ink py-[13px] text-paper" aria-hidden="true">
            <div className="mq">
                {seq.map((item, i) => (
                    <span key={i} className="flex items-center whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.24em]">
            <span className="px-[26px]">{item}</span>
            <em className="not-italic text-blue">/</em>
          </span>
                ))}
            </div>
        </div>
    );
}