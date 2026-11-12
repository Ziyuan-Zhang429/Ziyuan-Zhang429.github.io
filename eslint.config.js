import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

/**
 * Lints only the Rules of React. The react-hooks preset includes the React Compiler's checks, which flag code
 * the compiler would otherwise skip silently (such as reading a ref or mutating a value during render).
 */
export default defineConfig([
    globalIgnores(["dist", "coverage", "playwright-report", "test-results"]),
    {
        files: ["**/*.{ts,tsx}"],
        // Vendor files carry disable comments for rules this config doesn't run.
        linterOptions: { reportUnusedDisableDirectives: "off" },
        languageOptions: { parser: tseslint.parser },
        // Registered (not enabled) so vendor `eslint-disable @typescript-eslint/...` comments resolve.
        plugins: { "@typescript-eslint": tseslint.plugin },
        extends: [reactHooks.configs.flat.recommended],
    },
]);
