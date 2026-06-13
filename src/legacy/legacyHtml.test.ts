import { describe, expect, it } from "vitest";
import { parseLegacyDocument, resolveLegacyRoute } from "./legacyHtml";

describe("parseLegacyDocument", () => {
    it("keeps inline styles while removing non-rendering document wrappers and scripts", () => {
        const parsed = parseLegacyDocument(`
            <!doctype html>
            <html lang="zh-CN">
                <head>
                    <title>zfeed - sample</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>.glass-panel { backdrop-filter: blur(40px); }</style>
                </head>
                <body><main class="feed-transition">Hello</main><script>window.__ran = true</script></body>
            </html>
        `);

        expect(parsed.title).toBe("zfeed - sample");
        expect(parsed.styles).toContain("backdrop-filter: blur(40px)");
        expect(parsed.markup).toContain('<main class="feed-transition">Hello</main>');
        expect(parsed.markup).not.toContain("<script");
        expect(parsed.markup).not.toContain("<html");
        expect(parsed.scripts).toEqual(["window.__ran = true"]);
    });
});

describe("resolveLegacyRoute", () => {
    it("maps legacy .html URLs to the intended source page", () => {
        expect(resolveLegacyRoute("/")).toBe("pasted-html-original-copy");
        expect(resolveLegacyRoute("/following.html")).toBe("following");
        expect(resolveLegacyRoute("/profile.html")).toBe("profile");
        expect(resolveLegacyRoute("/detail.html")).toBe("detail");
        expect(resolveLegacyRoute("/edit-profile.html")).toBe("edit-profile");
        expect(resolveLegacyRoute("/liquid-glass-feed.html")).toBe("liquid-glass-feed");
    });
});
