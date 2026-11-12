import { Mail01 } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { CopyButton } from "@/components/base/copy-button/copy-button";
import { TransmissionNetwork } from "@/components/shared-assets/transmission-network";
import { PROFILE } from "@/content/profile";

/** Closing call to action: a dark spruce panel with the network motif bleeding in from the right. */
export const CtaBanner = () => {
    const t = useTranslations();

    return (
        <section aria-labelledby="cta-title" className="relative isolate my-12 overflow-hidden rounded-3xl bg-brand-950 px-6 py-12 md:px-12 md:py-16">
            <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,transparent_30%,black)] opacity-40 [--color-sir-edge:rgb(255_255_255/0.08)] [--color-sir-r:rgb(42_168_132)] [--color-sir-s-muted:rgb(255_255_255/0.18)]">
                <TransmissionNetwork seed={4} />
            </div>
            <h2 id="cta-title" className="max-w-xl font-serif text-4xl leading-tight text-white md:text-5xl">
                {t("home.cta.title")}
            </h2>
            <p className="mt-4 max-w-lg text-lg text-brand-100/80">{t("home.cta.description")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={`mailto:${PROFILE.email}`} size="lg" color="secondary" iconLeading={Mail01}>
                    {t("common.sendEmail")}
                </Button>
                <span className="inline-flex items-center gap-1 font-mono text-sm text-brand-100/80">
                    {PROFILE.email}
                    <CopyButton
                        value={PROFILE.email}
                        label={t("common.copyEmail")}
                        size="xs"
                        className="text-brand-100/70 hover:bg-white/10 hover:text-white"
                    />
                </span>
            </div>
        </section>
    );
};
