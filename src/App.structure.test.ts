import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("React page structure", () => {
    it("does not render pages through raw HTML injection", () => {
        const appSource = readFileSync(join(root, "src/App.tsx"), "utf8");

        expect(appSource).not.toContain("dangerouslySetInnerHTML");
        expect(appSource).not.toContain("import.meta.glob");
    });

    it("keeps route pages lazy-loaded instead of statically bundled", () => {
        const appSource = readFileSync(join(root, "src/App.tsx"), "utf8");

        expect(appSource).toContain("lazy(");
        expect(appSource).not.toMatch(/import \{ \w+Page \} from "\.\/pages\//);
    });

    it("keeps every migrated page as a TSX component", async () => {
        const files = await readdir(join(root, "src/pages"));

        expect(files).toEqual(
            expect.arrayContaining([
                "AuthGatewayPage.tsx",
                "LoginPage.tsx",
                "RegisterPage.tsx",
                "HomePage.tsx",
                "FollowingPage.tsx",
                "ProfilePage.tsx",
                "DetailPage.tsx",
                "EditProfilePage.tsx",
                "SearchPage.tsx",
                "ComposePage.tsx",
                "SettingsPage.tsx",
                "LiquidGlassFeedPage.tsx"
            ])
        );
    });

    it("keeps page components free of raw HTML execution", async () => {
        const pageFiles = await readdir(join(root, "src/pages"));
        const sources = [
            ...pageFiles.map((file) => readFileSync(join(root, "src/pages", file), "utf8")),
            readFileSync(join(root, "src/runtime/PageShell.tsx"), "utf8")
        ];

        for (const source of sources) {
            expect(source).not.toContain("dangerouslySetInnerHTML");
            expect(source).not.toContain("new Function");
        }
    });

    it("does not keep placeholder hash links in migrated pages", async () => {
        const pageFiles = await readdir(join(root, "src/pages"));
        const sources = pageFiles.map((file) => ({
            file,
            source: readFileSync(join(root, "src/pages", file), "utf8")
        }));

        const offenders = sources
            .filter(({ file }) => file !== "LiquidGlassFeedPage.tsx")
            .filter(({ source }) => source.includes('"href": "#"') || source.includes('href: "#"'))
            .map(({ file }) => file);

        expect(offenders).toEqual([]);
    });
});
