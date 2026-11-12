import type { ReactNode } from "react";
import { IntlProvider } from "use-intl";
import { DEFAULT_LOCALE, MESSAGES_BY_LOCALE, TIME_ZONE } from "./config";

export const AppIntlProvider = ({ children }: { children: ReactNode }) => (
    <IntlProvider locale={DEFAULT_LOCALE} messages={MESSAGES_BY_LOCALE[DEFAULT_LOCALE]} timeZone={TIME_ZONE}>
        {children}
    </IntlProvider>
);
