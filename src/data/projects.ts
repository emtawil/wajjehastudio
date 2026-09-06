export type FrameKind = "browser" | "mac" | "phone";

export interface Project {
    slug: string;
    name: string;
    category: string;
    blurb: string;
    tech: string[];
    frame: FrameKind;
    url: string;
    title?: string;
    meta?: string;
    w: number; // preview base width, px
    h: number; // preview base height, px
}

export const projects: Project[] = [
    {
        slug: "wassel",
        name: "Wassel",
        category: "STUDIO CONCEPT — RIDE-HAIL & DELIVERY",
        blurb:
            "Rider and driver apps, real-time dispatch map, zones, fares and payouts — the complete ecosystem a ride-hailing or delivery service needs to launch in a new market.",
        tech: ["React Native", "Laravel", "Inertia", "WebSockets"],
        frame: "browser",
        url: "dispatch.wajjeha.cloud",
        w: 1280,
        h: 700,
    },
    {
        slug: "fathom",
        name: "Fathom",
        category: "STUDIO CONCEPT — LANDING PAGE",
        blurb:
            "Positioning, features, pricing and proof — a B2B landing page engineered to turn attention into a booked demo.",
        tech: ["Next.js", "React", "Tailwind CSS"],
        frame: "browser",
        url: "fathom.wajjeha.cloud",
        w: 1280,
        h: 820,
    },
    {
        slug: "rif",
        name: "Rif",
        category: "STUDIO CONCEPT — ONLINE STORE",
        blurb:
            "A store with category filtering, a working cart and bookable services — commerce designed like an editorial, not a spreadsheet.",
        tech: ["Next.js", "React", "Tailwind CSS"],
        frame: "browser",
        url: "rif.wajjeha.cloud",
        w: 1280,
        h: 1600,
    },
    {
        slug: "mizan",
        name: "Mizan",
        category: "STUDIO CONCEPT — DESKTOP ERP",
        blurb:
            "An Electron ERP for inventory, sales, purchasing and payroll — modules, live search and reporting in a desktop app that feels native.",
        tech: ["Electron", "React", "Vite"],
        frame: "mac",
        url: "erp.wajjeha.cloud",
        title: "Mizan ERP — Inventory",
        meta: "V2.4.1",
        w: 1280,
        h: 880,
    },
    {
        slug: "haraka",
        name: "Haraka",
        category: "STUDIO CONCEPT — MOBILE APP",
        blurb:
            "A daily-movement app for iOS and Android — a ring, sessions and streaks, offline-first, shipping over-the-air updates.",
        tech: ["React Native", "iOS", "Android"],
        frame: "phone",
        url: "haraka.wajjeha.cloud",
        w: 390,
        h: 720,
    },
];