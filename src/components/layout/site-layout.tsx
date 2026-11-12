import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useTranslations } from "use-intl";
import { Container } from "./container";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Scroll to the top on route changes (but not on query-string changes such as filters), or to the hash target. */
const useScrollReset = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // Smooth for in-page anchors, unless the visitor prefers reduced motion. The target's scroll-margin sets the offset.
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
            return;
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);
};

export const SiteLayout = () => {
    const t = useTranslations("layout");
    useScrollReset();

    return (
        <div className="flex min-h-dvh flex-col bg-page">
            <a
                href="#main"
                className="sr-only z-50 rounded-lg bg-brand-solid px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                {t("skipToContent")}
            </a>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
                <Container>
                    {/* Lazy pages: hold the viewport's height while one loads so the footer doesn't jump up. */}
                    <Suspense fallback={<div className="min-h-dvh" aria-hidden="true" />}>
                        <Outlet />
                    </Suspense>
                </Container>
            </main>
            <SiteFooter />
        </div>
    );
};
