import { useEffect, useId, useState } from "react";
import { Download01, Mail01, Menu02, XClose } from "@untitledui/icons";
import { NavLink, useLocation } from "react-router";
import { useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { LogoMark } from "@/components/foundations/logo/logo-mark";
import { PROFILE } from "@/content/profile";
import { cx } from "@/utils/cx";
import { Container } from "./container";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

const useScrolled = (offset = 8) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > offset);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [offset]);

    return scrolled;
};

export const SiteHeader = () => {
    const t = useTranslations();
    const { pathname } = useLocation();
    const scrolled = useScrolled();
    // The menu remembers the page it was opened on, so navigating anywhere closes it.
    const [menuPath, setMenuPath] = useState<string | null>(null);
    const menuOpen = menuPath === pathname;
    const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);
    const menuId = useId();

    // Close the mobile menu on Escape.
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMenuPath(null);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    return (
        <header
            className={cx(
                "sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-200",
                scrolled || menuOpen ? "border-secondary bg-page/85" : "border-transparent bg-page/60",
            )}
        >
            <Container className="flex h-16 items-center justify-between gap-4">
                <NavLink
                    to="/"
                    aria-label={t("layout.homeLink", { name: t("profile.name") })}
                    className="flex items-center gap-2.5 rounded-lg outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                    <LogoMark />
                    <span className="text-sm font-semibold tracking-tight text-primary">{t("profile.name")}</span>
                </NavLink>

                <nav aria-label={t("layout.primaryNavigation")} className="hidden md:block">
                    <ul className="flex items-center gap-0.5 rounded-full bg-surface-muted/70 p-1 ring-1 ring-secondary ring-inset">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.key}>
                                <NavLink
                                    to={item.href}
                                    end={item.href === "/"}
                                    className={({ isActive }) =>
                                        cx(
                                            "block rounded-full px-3.5 py-1.5 text-sm font-medium outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2",
                                            isActive ? "bg-surface text-primary shadow-xs ring-1 ring-secondary" : "text-tertiary hover:text-primary",
                                        )
                                    }
                                >
                                    {t(`nav.${item.key}`)}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Button
                        href={PROFILE.cvUrl}
                        target="_blank"
                        rel="noopener"
                        size="sm"
                        color="secondary"
                        iconLeading={Download01}
                        className="hidden sm:inline-flex"
                    >
                        {t("common.cv")}
                    </Button>
                    <Button
                        size="sm"
                        color="tertiary"
                        className="md:hidden"
                        aria-label={menuOpen ? t("layout.closeMenu") : t("layout.openMenu")}
                        aria-expanded={menuOpen}
                        aria-controls={menuId}
                        iconLeading={menuOpen ? XClose : Menu02}
                        onClick={() => setMenuOpen(!menuOpen)}
                    />
                </div>
            </Container>

            <nav id={menuId} aria-label={t("layout.primaryNavigation")} hidden={!menuOpen} className="border-t border-secondary md:hidden">
                <Container className="animate-fade-up py-4">
                    <ul className="flex flex-col">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.key}>
                                <NavLink
                                    to={item.href}
                                    end={item.href === "/"}
                                    className={({ isActive }) =>
                                        cx(
                                            "flex items-center justify-between border-b border-secondary py-3.5 font-serif text-2xl outline-focus-ring focus-visible:outline-2",
                                            isActive ? "text-primary" : "text-tertiary",
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {t(`nav.${item.key}`)}
                                            {isActive && <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-solid" />}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <Button href={PROFILE.cvUrl} target="_blank" rel="noopener" size="md" color="secondary" iconLeading={Download01}>
                            {t("common.cv")}
                        </Button>
                        <Button href={`mailto:${PROFILE.email}`} size="md" color="primary" iconLeading={Mail01}>
                            {t("common.email")}
                        </Button>
                    </div>
                </Container>
            </nav>
        </header>
    );
};
