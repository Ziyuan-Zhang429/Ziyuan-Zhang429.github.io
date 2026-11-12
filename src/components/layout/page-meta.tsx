import { useTranslations } from "use-intl";

/** Per-route document metadata (React 19 hoists <title> and <meta> into <head>). */
export const PageMeta = ({ title, description }: { title?: string; description?: string }) => {
    const t = useTranslations();
    const name = t("profile.name");
    const fullTitle = title ? t("meta.pageTitle", { page: title, name }) : t("meta.defaultTitle", { name, field: t("profile.field") });

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description ?? t("meta.description")} />
        </>
    );
};
