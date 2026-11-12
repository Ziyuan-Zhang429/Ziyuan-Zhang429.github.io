import { ArrowUp } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { TextLink } from "@/components/base/text-link/text-link";
import { LogoMark } from "@/components/foundations/logo/logo-mark";
import { PROFILE } from "@/content/profile";
import { Container } from "./container";
import { NAV_ITEMS } from "./nav-items";

export const SiteFooter = () => {
    const t = useTranslations();
    const year = new Date().getFullYear();

    return (
        <footer className="mt-12 border-t border-secondary">
            <Container className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-3">
                    <LogoMark />
                    <div>
                        <p className="text-sm font-semibold text-primary">{t("profile.name")}</p>
                        <p className="mt-0.5 text-sm text-tertiary">{t("profile.headline")}</p>
                    </div>
                </div>

                <nav aria-label={t("layout.footerNavigation")}>
                    <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                        {NAV_ITEMS.slice(1).map((item) => (
                            <li key={item.key}>
                                <TextLink href={item.href} tone="neutral" className="no-underline hover:underline">
                                    {t(`nav.${item.key}`)}
                                </TextLink>
                            </li>
                        ))}
                        <li>
                            <TextLink href={`mailto:${PROFILE.email}`} tone="neutral" className="no-underline hover:underline">
                                {t("common.email")}
                            </TextLink>
                        </li>
                        <li>
                            <TextLink href={PROFILE.cvUrl} external tone="neutral" className="no-underline hover:underline">
                                {t("common.cv")}
                            </TextLink>
                        </li>
                    </ul>
                </nav>
            </Container>
            <Container className="flex items-center justify-between border-t border-secondary py-5">
                <p className="font-mono text-xs text-quaternary">{t("layout.copyright", { year, name: t("profile.name") })}</p>
                <Button size="sm" color="link-gray" iconTrailing={ArrowUp} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    {t("layout.backToTop")}
                </Button>
            </Container>
        </footer>
    );
};
