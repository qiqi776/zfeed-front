import { describe, expect, it } from "vitest";
import { resolvePageRoute } from "./pageRoutes";

describe("resolvePageRoute", () => {
    it("maps modern URLs to the intended source page", () => {
        expect(resolvePageRoute("/")).toBe("auth-gateway");
        expect(resolvePageRoute("/home")).toBe("home");
        expect(resolvePageRoute("/following")).toBe("following");
        expect(resolvePageRoute("/profile")).toBe("profile");
        expect(resolvePageRoute("/detail")).toBe("detail");
        expect(resolvePageRoute("/edit-profile")).toBe("edit-profile");
        expect(resolvePageRoute("/login")).toBe("login");
        expect(resolvePageRoute("/register")).toBe("register");
        expect(resolvePageRoute("/liquid-glass-feed")).toBe("liquid-glass-feed");
    });

    it("does not map old .html URLs", () => {
        expect(resolvePageRoute("/pasted-html-original-copy.html")).toBe("not-found");
        expect(resolvePageRoute("/following.html")).toBe("not-found");
        expect(resolvePageRoute("/profile.html")).toBe("not-found");
        expect(resolvePageRoute("/detail.html")).toBe("not-found");
        expect(resolvePageRoute("/edit-profile.html")).toBe("not-found");
        expect(resolvePageRoute("/liquid-glass-feed.html")).toBe("not-found");
        expect(resolvePageRoute("/unknown")).toBe("not-found");
    });
});
