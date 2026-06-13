import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("React page structure", () => {
    it("does not render pages through raw legacy HTML injection", () => {
        const appSource = readFileSync(join(root, "src/App.tsx"), "utf8");

        expect(appSource).not.toContain("dangerouslySetInnerHTML");
        expect(appSource).not.toContain("import.meta.glob");
        expect(appSource).not.toContain("../legacy-html");
    });

    it("keeps every migrated page as a TSX component", async () => {
        const files = await readdir(join(root, "src/pages"));

        expect(files).toEqual(
            expect.arrayContaining([
                "HomePage.tsx",
                "FollowingPage.tsx",
                "ProfilePage.tsx",
                "DetailPage.tsx",
                "EditProfilePage.tsx",
                "LiquidGlassFeedPage.tsx"
            ])
        );
    });

    it("keeps migrated page components free of legacy HTML execution", async () => {
        const pageFiles = await readdir(join(root, "src/pages"));
        const sources = [
            ...pageFiles.map((file) => readFileSync(join(root, "src/pages", file), "utf8")),
            readFileSync(join(root, "src/runtime/PageShell.tsx"), "utf8")
        ];

        for (const source of sources) {
            expect(source).not.toContain("dangerouslySetInnerHTML");
            expect(source).not.toContain("new Function");
            expect(source).not.toContain("legacy-html");
        }
    });
});
