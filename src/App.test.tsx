import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App routes", () => {
    it("renders the auth gateway at the root path", async () => {
        window.history.pushState({}, "", "/");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "登录或注册 zfeed" })).toBeInTheDocument();
        expect(screen.getByTitle("zfeed 首页雾化背景")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "登录" })).toHaveAttribute("href", "/login");
        expect(screen.getByRole("link", { name: "注册" })).toHaveAttribute("href", "/register");
    });

    it("renders the home recommend feed from the modern home path", async () => {
        window.history.pushState({}, "", "/home");

        render(<App />);

        expect(await screen.findByText("用 AI 构建产品：30 天从 0 到 1")).toBeInTheDocument();
    });

    it("renders the following feed from the modern following path", async () => {
        window.history.pushState({}, "", "/following");

        render(<App />);

        expect(await screen.findByText("我关注的创作者今天都在用 AI 重构工作流")).toBeInTheDocument();
    });

    it("renders the profile route with the user query", async () => {
        window.history.pushState({}, "", "/profile?user=me");

        render(<App />);

        await waitFor(() => {
            expect(document.title).toBe("zfeed - Mira Chen");
        });
        expect(screen.getByText("编辑资料")).toBeInTheDocument();
    });

    it("points the profile edit action at the edit profile route", async () => {
        window.history.pushState({}, "", "/profile?user=me");

        render(<App />);

        const editProfileLink = await screen.findByRole("link", { name: "编辑资料" });

        expect(editProfileLink).toHaveAttribute("href", "/edit-profile?user=me");
    });

    it("renders the login route with the required fields", async () => {
        window.history.pushState({}, "", "/login");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "登录 zfeed" })).toBeInTheDocument();
        expect(screen.getByLabelText("手机号")).toBeInTheDocument();
        expect(screen.getByLabelText("密码")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "去注册" })).toHaveAttribute("href", "/register");
    });

    it("renders the register route with profile fields", async () => {
        window.history.pushState({}, "", "/register");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "创建 zfeed 账号" })).toBeInTheDocument();
        expect(screen.getByLabelText("手机号")).toBeInTheDocument();
        expect(screen.getByLabelText("昵称")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "去登录" })).toHaveAttribute("href", "/login");
    });

    it("opens internal links inside the React app without a full page navigation", async () => {
        window.history.pushState({}, "", "/home");

        render(<App />);

        const profileLink = await screen.findByLabelText("进入我的主页");
        fireEvent.click(profileLink);

        await waitFor(() => {
            expect(window.location.pathname).toBe("/profile");
        });
        expect(window.location.search).toBe("?user=me");
        expect(await screen.findByText("编辑资料")).toBeInTheDocument();
    });

    it("shows not found for old .html URLs", async () => {
        window.history.pushState({}, "", "/following.html");

        render(<App />);

        expect(await screen.findByText("页面不存在")).toBeInTheDocument();
    });
});
