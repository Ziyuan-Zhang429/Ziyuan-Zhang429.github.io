import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import path from "node:path";
import { type Plugin, defineConfig } from "vite";

/**
 * GitHub Pages has no SPA fallback. After the build, copy index.html to:
 * - `<route>.html`, so `/research` (served from research.html) and the old static-site URLs both load the app;
 * - `404.html`, as a catch-all for anything else.
 */
const githubPagesFallback = (routes: string[]): Plugin => ({
    name: "github-pages-fallback",
    apply: "build",
    closeBundle() {
        const outDir = path.resolve(import.meta.dirname, "dist");
        const index = path.join(outDir, "index.html");
        for (const name of [...routes, "404"]) copyFileSync(index, path.join(outDir, `${name}.html`));
    },
});

export default defineConfig({
    plugins: [
        react(),
        // React Compiler: memoizes components and hooks automatically, so unchanged parts of the tree skip re-rendering.
        babel({ presets: [reactCompilerPreset()] }),
        tailwindcss(),
        githubPagesFallback(["research", "publications", "teaching", "contact", "design-system"]),
    ],
    build: {
        rolldownOptions: {
            output: {
                // Big, rarely-changing libraries get their own chunks so they stay cached across deploys.
                codeSplitting: {
                    groups: [
                        { name: "react", test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/ },
                        {
                            name: "react-aria",
                            test: /node_modules[\\/](react-aria|react-aria-components|react-stately|@react-aria|@react-stately|@react-types|@internationalized)[\\/]/,
                        },
                        { name: "intl", test: /node_modules[\\/](use-intl|intl-messageformat|@formatjs)[\\/]/ },
                    ],
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./src"),
        },
    },
});
