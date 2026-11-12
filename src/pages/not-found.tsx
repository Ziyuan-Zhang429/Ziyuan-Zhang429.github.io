import { ArrowLeft, Home03 } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { PageHeader } from "@/components/layout/page-header";
import { PageMeta } from "@/components/layout/page-meta";
import { TransmissionNetwork } from "@/components/shared-assets/transmission-network";

export const NotFoundPage = () => {
    const t = useTranslations("notFound");
    const navigate = useNavigate();

    return (
        <>
            <PageMeta title={t("title")} />
            <PageHeader eyebrow={t("eyebrow")} title={t("heading")} description={t("description")}>
                <div className="flex flex-wrap gap-3">
                    <Button size="lg" color="secondary" iconLeading={ArrowLeft} onClick={() => navigate(-1)}>
                        {t("goBack")}
                    </Button>
                    <Button size="lg" href="/" iconLeading={Home03}>
                        {t("home")}
                    </Button>
                </div>
            </PageHeader>
            <div className="-mx-5 mb-12 h-40 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] opacity-70 md:-mx-8">
                <TransmissionNetwork seed={404} />
            </div>
        </>
    );
};
