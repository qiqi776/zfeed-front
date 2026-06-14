import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        ...init
    });
}

describe("App routes", () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.unstubAllGlobals();
    });

    it("renders the auth gateway at the root path", async () => {
        window.history.pushState({}, "", "/");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "登录或注册 zfeed" })).toBeInTheDocument();
        expect(screen.getByTitle("zfeed 首页雾化背景")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "登录" })).toHaveAttribute("href", "/login");
        expect(screen.getByRole("link", { name: "注册" })).toHaveAttribute("href", "/register");
    });

    it("restores a valid session at the root path and enters the home feed", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "valid-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({
            user_info: {
                user_id: 7,
                mobile: "13800138000",
                nickname: "Mira Chen",
                avatar: "https://example.com/avatar.png",
                bio: "",
                gender: 0,
                status: 1,
                email: "",
                birthday: 0
            },
            followee_count: 1,
            follower_count: 2,
            like_received_count: 3,
            favorite_received_count: 4,
            content_count: 5
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/");

        render(<App />);

        await waitFor(() => expect(window.location.pathname).toBe("/home"));
        expect(fetchMock).toHaveBeenCalledWith("/v1/users/me", expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: "Bearer valid-token"
            })
        }));
        expect(await screen.findByText("用 AI 构建产品：30 天从 0 到 1")).toBeInTheDocument();
    });

    it("clears an invalid restored session and enters the guest home feed", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "expired-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ message: "expired" }, { status: 401 })));
        window.history.pushState({}, "", "/");

        render(<App />);

        await waitFor(() => expect(window.location.pathname).toBe("/home"));
        expect(window.localStorage.getItem("zfeed.auth.session")).toBeNull();
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

    it("validates login fields before submitting", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/login");

        render(<App />);

        fireEvent.click(await screen.findByRole("button", { name: "登录" }));

        expect(await screen.findByText("请输入手机号")).toBeInTheDocument();
        expect(screen.getByText("请输入密码")).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("submits login, stores the session, and enters the home feed", async () => {
        const fetchMock = vi.fn(async () => jsonResponse({
            user_id: 7,
            token: "login-token",
            expired_at: Math.floor(Date.now() / 1000) + 3600,
            nickname: "Mira Chen",
            avatar: "https://example.com/avatar.png"
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/login");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "13800138000" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: "登录" }));

        expect(await screen.findByRole("button", { name: "登录中" })).toBeDisabled();
        await waitFor(() => expect(window.location.pathname).toBe("/home"));
        expect(fetchMock).toHaveBeenCalledWith("/v1/login", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ mobile: "13800138000", password: "password123" })
        }));
        expect(JSON.parse(window.localStorage.getItem("zfeed.auth.session") ?? "{}")).toMatchObject({
            token: "login-token",
            user: { userId: 7, nickname: "Mira Chen" }
        });
    });

    it("shows a sanitized login error without storing a session", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ message: "raw backend failure" }, { status: 401 })));
        window.history.pushState({}, "", "/login");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "13800138000" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "bad-password" } });
        fireEvent.click(screen.getByRole("button", { name: "登录" }));

        expect(await screen.findByText("手机号或密码不正确")).toBeInTheDocument();
        expect(screen.queryByText("raw backend failure")).not.toBeInTheDocument();
        expect(window.localStorage.getItem("zfeed.auth.session")).toBeNull();
    });

    it("renders the register route with profile fields", async () => {
        window.history.pushState({}, "", "/register");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "创建 zfeed 账号" })).toBeInTheDocument();
        expect(screen.getByLabelText("手机号")).toBeInTheDocument();
        expect(screen.getByLabelText("昵称")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "去登录" })).toHaveAttribute("href", "/login");
    });

    it("validates register fields before submitting", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/register");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("昵称"), { target: { value: "a".repeat(65) } });
        fireEvent.change(screen.getByLabelText("邮箱"), { target: { value: "bad-email" } });
        fireEvent.change(screen.getByLabelText("简介"), { target: { value: "b".repeat(256) } });
        fireEvent.click(screen.getByRole("button", { name: "注册" }));

        expect(await screen.findByText("请输入手机号")).toBeInTheDocument();
        expect(screen.getByText("请输入密码")).toBeInTheDocument();
        expect(screen.getByText("昵称最多 64 字")).toBeInTheDocument();
        expect(screen.getByText("请输入有效邮箱")).toBeInTheDocument();
        expect(screen.getByText("简介最多 255 字")).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("submits register, stores the session, and enters me", async () => {
        const fetchMock = vi.fn(async () => jsonResponse({
            user_id: 9,
            token: "register-token",
            expired_at: Math.floor(Date.now() / 1000) + 3600
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/register");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "13900139000" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText("昵称"), { target: { value: "New User" } });
        fireEvent.change(screen.getByLabelText("头像 URL"), { target: { value: "https://example.com/a.png" } });
        fireEvent.change(screen.getByLabelText("邮箱"), { target: { value: "new@example.com" } });
        fireEvent.change(screen.getByLabelText("简介"), { target: { value: "hello" } });
        fireEvent.click(screen.getByRole("button", { name: "注册" }));

        expect(await screen.findByRole("button", { name: "注册中" })).toBeDisabled();
        await waitFor(() => expect(window.location.pathname).toBe("/me"));
        expect(fetchMock).toHaveBeenCalledWith("/v1/users", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
                mobile: "13900139000",
                password: "password123",
                nickname: "New User",
                avatar: "https://example.com/a.png",
                email: "new@example.com",
                bio: "hello"
            })
        }));
        expect(JSON.parse(window.localStorage.getItem("zfeed.auth.session") ?? "{}")).toMatchObject({
            token: "register-token",
            user: { userId: 9, nickname: "New User" }
        });
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
