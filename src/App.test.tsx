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

    it("renders the me route", async () => {
        window.history.pushState({}, "", "/me");

        render(<App />);

        await waitFor(() => {
            expect(document.title).toBe("zfeed - Mira Chen");
        });
        expect(screen.getByText("编辑资料")).toBeInTheDocument();
    });

    it("points the profile edit action at the modern edit profile route", async () => {
        window.history.pushState({}, "", "/me");

        render(<App />);

        const editProfileLink = await screen.findByRole("link", { name: "编辑资料" });

        expect(editProfileLink).toHaveAttribute("href", "/me/edit");
    });

    it("renders user, content, search, compose, settings, and edit routes", async () => {
        window.history.pushState({}, "", "/user/jax");
        const { unmount } = render(<App />);
        expect(await screen.findByRole("heading", { name: "Jax Lee" })).toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/content/article-1");
        render(<App />);
        expect(await screen.findByRole("heading", { name: "用 AI 构建产品：30 天从 0 到 1" })).toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/search");
        render(<App />);
        expect(await screen.findByRole("heading", { name: "搜索" })).toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/compose");
        render(<App />);
        expect(await screen.findByRole("heading", { name: "发布" })).toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/settings");
        render(<App />);
        expect(await screen.findByRole("heading", { name: "设置" })).toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/me/edit");
        render(<App />);
        expect(await screen.findByRole("heading", { name: "编辑资料" })).toBeInTheDocument();
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

    it("opens compose from the primary publish button", async () => {
        window.history.pushState({}, "", "/home");

        render(<App />);

        fireEvent.click(await screen.findByRole("button", { name: /发布/ }));

        await waitFor(() => expect(window.location.pathname).toBe("/compose"));
        expect(await screen.findByRole("heading", { name: "发布" })).toBeInTheDocument();
    });

    it("opens search from the global search box", async () => {
        window.history.pushState({}, "", "/home");

        render(<App />);

        const searchBox = await screen.findByPlaceholderText("搜索内容、创作者或话题");
        fireEvent.change(searchBox, { target: { value: "AI 创作" } });
        fireEvent.keyDown(searchBox, { key: "Enter" });

        await waitFor(() => expect(window.location.pathname).toBe("/search"));
        expect(window.location.search).toBe("?q=AI+%E5%88%9B%E4%BD%9C");
    });

    it("guides unauthenticated write actions to login without calling the API", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/home");

        render(<App />);

        const likeButton = (await screen.findAllByText("favorite"))[0].closest("button");
        expect(likeButton).not.toBeNull();
        fireEvent.click(likeButton!);

        await waitFor(() => expect(window.location.pathname).toBe("/login"));
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("uses Bearer writes for liked content and rolls back when the API fails", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "write-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({ message: "raw failure" }, { status: 500 }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/home");

        render(<App />);

        const likeButton = (await screen.findAllByText("favorite"))[0].closest("button");
        expect(likeButton).not.toBeNull();
        expect(likeButton).toHaveClass("text-error");

        fireEvent.click(likeButton!);

        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/interaction/unlike", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer write-token"
            }),
            body: JSON.stringify({ contentId: "article-1" })
        })));
        await waitFor(() => expect(likeButton).toHaveClass("text-error"));
        expect(screen.queryByText("raw failure")).not.toBeInTheDocument();
    });

    it("follows a profile author with Bearer auth and optimistic feedback", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "follow-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({ is_followed: true }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        const followButton = (await screen.findAllByRole("button", { name: /关注/ }))[0];
        fireEvent.click(followButton);

        expect(await screen.findByRole("button", { name: "已关注" })).toBeInTheDocument();
        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/interaction/followings", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer follow-token"
            }),
            body: JSON.stringify({ target_user_id: "1001" })
        })));
    });

    it("posts a content comment with optimistic insertion and clears the composer", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "comment-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7, nickname: "Mira Chen" }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({ comment_id: "5001" }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/content/article-1");

        render(<App />);

        const composer = await screen.findByPlaceholderText("写下你的观点，补充或提问...");
        fireEvent.change(composer, { target: { value: "这条评论来自真实接口" } });
        fireEvent.click(screen.getByRole("button", { name: "发送" }));

        expect(await screen.findByText("这条评论来自真实接口")).toBeInTheDocument();
        await waitFor(() => expect(composer).toHaveValue(""));
        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/interaction/comment", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer comment-token"
            }),
            body: JSON.stringify({
                content_id: "1001",
                scene: "content",
                comment: "这条评论来自真实接口",
                content_user_id: "1001"
            })
        })));
    });

    it("saves edited profile fields with validation and Bearer auth", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "profile-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({
            user_info: {
                user_id: 7,
                mobile: "13800138000",
                nickname: "Mira Updated",
                avatar: "",
                bio: "新的简介",
                gender: 0,
                status: 1,
                email: "mira.updated@example.com",
                birthday: 0
            }
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/me/edit");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("昵称"), { target: { value: "Mira Updated" } });
        fireEvent.change(screen.getByLabelText("简介"), { target: { value: "新的简介" } });
        fireEvent.change(screen.getByLabelText("邮箱"), { target: { value: "mira.updated@example.com" } });
        fireEvent.click(screen.getByRole("button", { name: /保存/ }));

        expect(await screen.findByText("资料已保存")).toBeInTheDocument();
        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/users/me/profile", expect.objectContaining({
            method: "PUT",
            headers: expect.objectContaining({
                Authorization: "Bearer profile-token"
            }),
            body: JSON.stringify({
                nickname: "Mira Updated",
                bio: "新的简介",
                email: "mira.updated@example.com"
            })
        })));
    });

    it("publishes an article from compose and routes to the new content", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "publish-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({ content_id: 6789 }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/compose");

        render(<App />);

        fireEvent.change(await screen.findByPlaceholderText("标题"), { target: { value: "一篇真实发布的文章" } });
        fireEvent.change(screen.getByPlaceholderText("写下你的想法..."), { target: { value: "这是正文内容" } });
        fireEvent.click(screen.getByRole("button", { name: "发布" }));

        expect(await screen.findByRole("button", { name: "发布中" })).toBeDisabled();
        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/content/article/publish", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer publish-token"
            }),
            body: JSON.stringify({
                title: "一篇真实发布的文章",
                description: "这是正文内容",
                content: "这是正文内容",
                visibility: 1
            })
        })));
        await waitFor(() => expect(window.location.pathname).toBe("/content/6789"));
    });

    it("opens internal links inside the React app without a full page navigation", async () => {
        window.history.pushState({}, "", "/home");

        render(<App />);

        const profileLink = await screen.findByLabelText("进入我的主页");
        fireEvent.click(profileLink);

        await waitFor(() => {
            expect(window.location.pathname).toBe("/me");
        });
        expect(window.location.search).toBe("");
        expect(await screen.findByText("编辑资料")).toBeInTheDocument();
    });

    it("shows not found for old .html URLs", async () => {
        window.history.pushState({}, "", "/following.html");

        render(<App />);

        expect(await screen.findByText("页面不存在")).toBeInTheDocument();
    });
});
