import type { Metadata } from "next";
import { SiteShell } from "@/components/redesign/site-shell";
import { buildNoIndexMetadata } from "@/lib/seo";
export const metadata: Metadata = buildNoIndexMetadata({ description: "Sign in, sign up, and manage account access." });
export default function AuthLayout({ children }: {
    children: React.ReactNode;
}) { return <SiteShell><div className="oe-auth-layout"><div className="oe-auth-card">{children}</div></div></SiteShell>; }
