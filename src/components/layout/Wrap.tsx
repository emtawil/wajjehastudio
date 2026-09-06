import type { ReactNode } from "react";

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`mx-auto w-full max-w-[1280px] px-5 sm:px-10 lg:px-12 ${className}`}>{children}</div>;
}