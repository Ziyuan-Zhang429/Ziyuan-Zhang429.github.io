import { useSyncExternalStore } from "react";
import { Moon01, Sun } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { useTheme } from "@/providers/theme-provider";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const subscribe = (callback: () => void) => {
    const media = window.matchMedia(DARK_QUERY);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
};

const useSystemPrefersDark = () =>
    useSyncExternalStore(
        subscribe,
        () => window.matchMedia(DARK_QUERY).matches,
        () => false,
    );

export const ThemeToggle = ({ className }: { className?: string }) => {
    const t = useTranslations("layout");
    const { theme, setTheme } = useTheme();
    const systemPrefersDark = useSystemPrefersDark();
    const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);

    return (
        <ButtonUtility
            color="tertiary"
            size="sm"
            className={className}
            icon={isDark ? Sun : Moon01}
            tooltip={isDark ? t("switchToLight") : t("switchToDark")}
            tooltipPlacement="bottom"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        />
    );
};
