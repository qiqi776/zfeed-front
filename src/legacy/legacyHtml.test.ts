import { describe, expect, it } from "vitest";
import { resolveLegacyRoute } from "./legacyHtml";

describe("resolveLegacyRoute", () => {
    it("maps legacy .html URLs to the intended source page", () => {
        expect(resolveLegacyRoute("/")).toBe("home");
        expect(resolveLegacyRoute("/pasted-html-original-copy.html")).toBe("home");
        expect(resolveLegacyRoute("/following.html")).toBe("following");
        expect(resolveLegacyRoute("/profile.html")).toBe("profile");
        expect(resolveLegacyRoute("/detail.html")).toBe("detail");
        expect(resolveLegacyRoute("/edit-profile.html")).toBe("edit-profile");
        expect(resolveLegacyRoute("/liquid-glass-feed.html")).toBe("liquid-glass-feed");
    });
});
