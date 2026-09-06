export interface Service {
    idx: string;
    title: string;
    tags: string;
    body: string;
    deliverables: string[];
}

export const services: Service[] = [
    {
        idx: "01",
        title: "Web Platforms & Websites",
        tags: "NEXT.JS · VITE · SEO",
        body: "Sites engineered for the first five seconds — and the five hundred after that. Marketing sites, landing pages and portfolios that load in a blink, rank properly, and read like they were typeset by hand. Performance budgets are treated as design constraints.",
        deliverables: [
            "Next.js with SSR & static regeneration — or Vite when it's a lighter job",
            "A CMS your team actually enjoys editing",
            "SEO, analytics & Core Web Vitals done properly",
            "Sub-second loads on 3G networks",
        ],
    },
    {
        idx: "02",
        title: "Web Applications",
        tags: "LARAVEL · INERTIA · REACT",
        body: "The software your business runs on — portals, dashboards, internal tools, stores with products and services. We build Laravel + Inertia monoliths: modern single-page apps without an API tax, with React in the browser and Eloquent behind it.",
        deliverables: [
            "Products, services, checkout & order flows",
            "Roles, auth, billing & audit logs",
            "Queues, scheduled jobs & tests — the boring parts, done",
            "A shadcn/ui-based design system you keep",
        ],
    },
    {
        idx: "03",
        title: "Mobile Applications",
        tags: "REACT NATIVE · IOS · ANDROID",
        body: "One React Native codebase, two stores, zero compromises. From first design to App Store and Play Store submission — offline-first sync, push notifications, deep links and gestures that feel native, because they are.",
        deliverables: [
            "iOS & Android from a single codebase",
            "Offline-first data sync",
            "Push notifications & deep links",
            "Store assets, review & submission",
        ],
    },
    {
        idx: "04",
        title: "Desktop Applications",
        tags: "ELECTRON · WIN · MACOS · LINUX",
        body: "Electron applications that feel native on every desktop — ERP modules, inventory, POS and operations tools with local data, proper shortcuts, system tray and auto-updates. Built on React and Vite, packaged for Windows, macOS and Linux.",
        deliverables: [
            "Cross-platform builds & signed releases",
            "System tray, shortcuts & file access",
            "Auto-update pipeline",
            "Local database & offline operation",
        ],
    },
    {
        idx: "05",
        title: "UI & Design Systems",
        tags: "TAILWIND · SHADCN/UI · A11Y",
        body: "Interfaces as infrastructure — reusable component systems built on Tailwind CSS and shadcn/ui, documented, accessible and consistent across web, mobile and desktop. One system, every platform — that's the ecosystem in practice.",
        deliverables: [
            "Token-based Tailwind design systems",
            "Accessible shadcn/ui component libraries",
            "Documented patterns your team can extend",
            "One visual language across all platforms",
        ],
    },
];