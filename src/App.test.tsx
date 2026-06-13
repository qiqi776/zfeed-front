import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App legacy routes", () => {
    it("renders the following feed from the old following.html path", async () => {
        window.history.pushState({}, "", "/following.html");

        render(<App />);

        expect(await screen.findByText("我关注的创作者今天都在用 AI 重构工作流")).toBeInTheDocument();
    });

    it("renders the profile route with the legacy user query", async () => {
        window.history.pushState({}, "", "/profile.html?user=me");

        render(<App />);

        await waitFor(() => {
            expect(document.title).toBe("zfeed - Mira Chen");
        });
        expect(screen.getByText("编辑资料")).toBeInTheDocument();
    });

    it("opens legacy internal links inside the React app without a full page navigation", async () => {
        window.history.pushState({}, "", "/");

        render(<App />);

        const profileLink = await screen.findByLabelText("进入我的主页");
        fireEvent.click(profileLink);

        await waitFor(() => {
            expect(window.location.pathname).toBe("/profile.html");
        });
        expect(window.location.search).toBe("?user=me");
        expect(await screen.findByText("编辑资料")).toBeInTheDocument();
    });
});
