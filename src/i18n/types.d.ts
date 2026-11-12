import type { Locale } from "./config";
import type en from "./messages/en.json";

declare module "use-intl" {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof en;
    }
}
