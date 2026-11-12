import { StrictMode, lazy } from "react";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/instrument-serif/400.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { SiteLayout } from "@/components/layout/site-layout";
import { AppIntlProvider } from "@/i18n/intl-provider";
import { HomePage } from "@/pages/home";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

// The home page ships in the main bundle; the other pages load when first visited.
const ResearchPage = lazy(() => import("@/pages/research").then((module) => ({ default: module.ResearchPage })));
const PublicationsPage = lazy(() => import("@/pages/publications").then((module) => ({ default: module.PublicationsPage })));
const TeachingPage = lazy(() => import("@/pages/teaching").then((module) => ({ default: module.TeachingPage })));
const ContactPage = lazy(() => import("@/pages/contact").then((module) => ({ default: module.ContactPage })));
const DesignSystemPage = lazy(() => import("@/pages/design-system").then((module) => ({ default: module.DesignSystemPage })));
const NotFoundPage = lazy(() => import("@/pages/not-found").then((module) => ({ default: module.NotFoundPage })));

/** Old static-site URLs (e.g. /research.html) redirect to their new routes. */
const LEGACY_PAGES = ["index", "research", "publications", "teaching", "contact"] as const;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppIntlProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <RouteProvider>
                        <Routes>
                            <Route element={<SiteLayout />}>
                                <Route index element={<HomePage />} />
                                <Route path="research" element={<ResearchPage />} />
                                <Route path="publications" element={<PublicationsPage />} />
                                <Route path="teaching" element={<TeachingPage />} />
                                <Route path="contact" element={<ContactPage />} />
                                <Route path="design-system" element={<DesignSystemPage />} />
                                {LEGACY_PAGES.map((page) => (
                                    <Route key={page} path={`${page}.html`} element={<Navigate to={page === "index" ? "/" : `/${page}`} replace />} />
                                ))}
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                    </RouteProvider>
                </BrowserRouter>
            </ThemeProvider>
        </AppIntlProvider>
    </StrictMode>,
);
