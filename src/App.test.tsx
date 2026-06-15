import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        ...init
    });
}

function recommendFeedPayload(items: unknown[] = [defaultRecommendFeedItem()]) {
    return {
        items,
        next_cursor: "",
        has_more: false,
        snapshot_id: "recommend-snapshot"
    };
}

function defaultRecommendFeedItem(overrides: Record<string, unknown> = {}) {
    return {
        content_id: 1001,
        content_type: 1,
        author_id: 1001,
        author_name: "Jax Lee",
        author_avatar: "https://example.com/jax.png",
        title: "用 AI 构建产品：30 天从 0 到 1",
        description: "记录从 0 到 1 的完整过程，包括技术栈选择、产品思考和踩坑经验。",
        cover_url: "https://example.com/cover.png",
        published_at: 1765670400,
        like_count: 128,
        favorite_count: 36,
        comment_count: 12,
        is_liked: true,
        is_favorited: false,
        ...overrides
    };
}

function isRecommendFeedRequest(input: RequestInfo | URL) {
    return input === "/v1/feed/recommend";
}

function meProfilePayload(overrides: Record<string, unknown> = {}) {
    return {
        user_info: {
            user_id: 7,
            mobile: "13800138000",
            nickname: "Mira Chen",
            avatar: "https://example.com/avatar.png",
            bio: "关注创作者工具、液态玻璃界面和高质量信息流体验。",
            gender: 0,
            status: 1,
            email: "mira@example.com",
            birthday: 0,
            ...(overrides.user_info as Record<string, unknown> | undefined)
        },
        followee_count: 346,
        follower_count: 18600,
        like_received_count: 9200,
        favorite_received_count: 912,
        content_count: 128,
        ...overrides
    };
}

function userProfilePayload(overrides: Record<string, unknown> = {}) {
    return {
        user_info: {
            user_id: 1001,
            nickname: "Jax Lee",
            avatar: "https://example.com/jax.png",
            bio: "AI 产品作者",
            mobile: "",
            email: "",
            ...(overrides.user_info as Record<string, unknown> | undefined)
        },
        followee_count: 18,
        follower_count: 2400,
        like_received_count: 1200,
        favorite_received_count: 300,
        content_count: 16,
        is_following: false,
        ...overrides
    };
}

function userPublishedFeedPayload(items: unknown[] = [defaultRecommendFeedItem({
    content_id: 9101,
    author_id: 1001,
    author_name: "Jax Lee",
    title: "用户主页真实发布内容",
    description: "这条内容来自用户发布流接口。",
    like_count: 9,
    favorite_count: 4,
    comment_count: 2
})]) {
    return {
        items,
        cursor: "",
        has_more: false
    };
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

    it("redirects unauthenticated root visits to the login entry", async () => {
        window.history.pushState({}, "", "/");

        render(<App />);

        await waitFor(() => expect(window.location.pathname).toBe("/login"));
        expect(await screen.findByRole("heading", { name: "登录 zfeed" })).toBeInTheDocument();
        expect(screen.getByTitle("zfeed 首页雾化背景")).toBeInTheDocument();
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

    it("falls back to the guest home feed when session restore never resolves", async () => {
        vi.useFakeTimers();
        try {
            window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
                token: "hanging-token",
                expiredAt: Math.floor(Date.now() / 1000) + 3600
            }));
            vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)));
            window.history.pushState({}, "", "/");

            render(<App />);

            const routeLoading = screen.queryByText("正在加载...");
            if (routeLoading) {
                expect(routeLoading).toHaveAttribute("data-page-state", "loading");
            }

            await act(async () => {
                await vi.dynamicImportSettled();
            });
            const restoreState = screen.getByRole("heading", { name: "正在恢复 zfeed 会话" });
            expect(restoreState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "loading");

            await act(async () => {
                vi.advanceTimersByTime(5_000);
            });

            expect(window.location.pathname).toBe("/home");
            expect(window.localStorage.getItem("zfeed.auth.session")).toBeNull();
        } finally {
            vi.useRealTimers();
        }
    });

    it("loads the home recommend feed from the API without executing user content", async () => {
        const fetchMock = vi.fn(async () => jsonResponse(recommendFeedPayload([
            defaultRecommendFeedItem({
                author_name: "Jax <owner>",
                title: "接口推荐内容 <script>alert(1)</script>",
                description: "接口返回的推荐流摘要"
            })
        ])));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/home");

        render(<App />);

        expect(await screen.findByText("接口推荐内容 <script>alert(1)</script>")).toBeInTheDocument();
        expect(screen.getByText("Jax <owner>")).toBeInTheDocument();
        expect(screen.getByText("接口返回的推荐流摘要")).toBeInTheDocument();
        expect(document.querySelector("script")).toBeNull();
        expect(fetchMock).toHaveBeenCalledWith("/v1/feed/recommend", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ cursor: "", page_size: 20 })
        }));
    });

    it("shows an empty state when the home recommend feed has no items", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(recommendFeedPayload([]))));
        window.history.pushState({}, "", "/home");

        render(<App />);

        const emptyState = await screen.findByText("暂时没有内容");
        expect(emptyState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "empty");
    });

    it("shows an error state when the home recommend feed cannot be loaded", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, { status: 500 })));
        window.history.pushState({}, "", "/home");

        render(<App />);

        const errorState = await screen.findByText("推荐流加载失败");
        expect(errorState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
        expect(screen.queryByText("用 AI 构建产品：30 天从 0 到 1")).not.toBeInTheDocument();
    });

    it("loads the signed-in following feed from the API", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "following-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({
            items: [{
                content_id: 1001,
                content_type: 1,
                author_id: 1002,
                author_name: "关注作者 <safe>",
                author_avatar: "https://example.com/author.png",
                title: "接口关注内容 <script>alert(1)</script>",
                description: "来自关注作者的新内容",
                cover_url: "https://example.com/follow-cover.png",
                published_at: 1765670400,
                like_count: 6,
                favorite_count: 2,
                comment_count: 1,
                is_liked: false,
                is_favorited: false
            }],
            next_cursor: "",
            has_more: false,
            snapshot_id: "follow-snapshot"
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/following");

        render(<App />);

        expect(await screen.findByText("接口关注内容 <script>alert(1)</script>")).toBeInTheDocument();
        expect(screen.getByText("关注作者 <safe>")).toBeInTheDocument();
        expect(screen.getByText("来自关注作者的新内容")).toBeInTheDocument();
        expect(document.querySelector("script")).toBeNull();
        expect(fetchMock).toHaveBeenCalledWith("/v1/feed/follow", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer following-token"
            }),
            body: JSON.stringify({ cursor: "", page_size: 20 })
        }));
    });

    it("shows an empty state when the following feed has no items", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "following-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({
            items: [],
            next_cursor: "",
            has_more: false
        })));
        window.history.pushState({}, "", "/following");

        render(<App />);

        const emptyState = await screen.findByText("关注一些作者后，这里会出现他们的新内容");
        expect(emptyState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "empty");
        expect(screen.getByRole("link", { name: "去搜索" })).toHaveAttribute("href", "/search");
    });

    it("shows an error state when the following feed cannot be loaded", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "following-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, { status: 500 })));
        window.history.pushState({}, "", "/following");

        render(<App />);

        const errorState = await screen.findByText("关注流加载失败");
        expect(errorState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
        expect(screen.queryByText("我关注的创作者今天都在用 AI 重构工作流")).not.toBeInTheDocument();
    });

    it("returns the following feed to auth-required when the token is rejected", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "following-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, { status: 401 })));
        window.history.pushState({}, "", "/following");

        render(<App />);

        const authState = await screen.findByText("登录后才能查看关注流。");
        expect(authState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "auth-required");
        expect(window.localStorage.getItem("zfeed.auth.session")).toBeNull();
    });

    it("shows an auth-required state on following when signed out", async () => {
        window.history.pushState({}, "", "/following");

        render(<App />);

        const authState = await screen.findByText("登录后才能查看关注流。");
        expect(authState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "auth-required");
        expect(screen.getByRole("link", { name: "去登录" })).toHaveAttribute("href", "/login?next=%2Ffollowing");
        expect(screen.queryByText("我关注的创作者今天都在用 AI 重构工作流")).not.toBeInTheDocument();
    });

    it("loads the me profile from the API without executing user content", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "me-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse(meProfilePayload({
            user_info: {
                nickname: "接口用户 <script>alert(1)</script>",
                avatar: "https://example.com/me.png",
                bio: "接口返回的个人简介"
            },
            followee_count: 3,
            follower_count: 9,
            like_received_count: 12,
            favorite_received_count: 4,
            content_count: 42
        })));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/me");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "接口用户 <script>alert(1)</script>" })).toBeInTheDocument();
        expect(screen.getByText("接口返回的个人简介")).toBeInTheDocument();
        expect(screen.getAllByText("42").length).toBeGreaterThan(0);
        expect(screen.getAllByText("3").length).toBeGreaterThan(0);
        expect(screen.getAllByText("9").length).toBeGreaterThan(0);
        expect(screen.getAllByText("12").length).toBeGreaterThan(0);
        expect(document.querySelector("script")).toBeNull();
        expect(fetchMock).toHaveBeenCalledWith("/v1/users/me", expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: "Bearer me-token"
            })
        }));
        expect(screen.getByText("编辑资料")).toBeInTheDocument();
    });

    it("shows an auth-required state on me when signed out", async () => {
        window.history.pushState({}, "", "/me");

        render(<App />);

        const authState = await screen.findByText("登录后才能查看我的主页。");
        expect(authState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "auth-required");
        expect(screen.getByRole("link", { name: "去登录" })).toHaveAttribute("href", "/login?next=%2Fme");
        expect(screen.queryByText("编辑资料")).not.toBeInTheDocument();
    });

    it("shows an error state when the me profile cannot be loaded", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "me-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ message: "raw user failure" }, { status: 500 })));
        window.history.pushState({}, "", "/me");

        render(<App />);

        const errorState = await screen.findByText("我的主页加载失败");
        expect(errorState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
        expect(screen.queryByText("raw user failure")).not.toBeInTheDocument();
        expect(screen.queryByText("Mira Chen")).not.toBeInTheDocument();
    });

    it("returns the me profile to auth-required when the token is rejected", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "me-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, { status: 401 })));
        window.history.pushState({}, "", "/me");

        render(<App />);

        const authState = await screen.findByText("登录后才能查看我的主页。");
        expect(authState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "auth-required");
        expect(window.localStorage.getItem("zfeed.auth.session")).toBeNull();
    });

    it("points the profile edit action at the modern edit profile route", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "me-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(meProfilePayload())));
        window.history.pushState({}, "", "/me");

        render(<App />);

        const editProfileLink = await screen.findByRole("link", { name: "编辑资料" });

        expect(editProfileLink).toHaveAttribute("href", "/me/edit");
    });

    it("renders user, content, search, compose, settings, and edit routes", async () => {
        vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
            if (input === "/v1/user/profile/jax") {
                return jsonResponse(userProfilePayload());
            }

            return jsonResponse({});
        }));
        window.history.pushState({}, "", "/user/jax");
        const { unmount } = render(<App />);
        expect(await screen.findByRole("heading", { name: "Jax Lee" })).toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/user/unknown");
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, { status: 404 })));
        render(<App />);
        const unknownUserState = await screen.findByText("用户不存在");
        expect(unknownUserState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
        expect(screen.queryByText("编辑资料")).not.toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/content/article-1");
        render(<App />);
        expect(await screen.findByRole("heading", { name: "用 AI 构建产品：30 天从 0 到 1" })).toBeInTheDocument();
        unmount();

        window.history.pushState({}, "", "/search");
        render(<App />);
        expect(await screen.findByRole("heading", { name: "搜索" })).toBeInTheDocument();
        expect(screen.getByText("输入关键词开始搜索")).toBeInTheDocument();
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

    it("loads a user profile from the API without executing user content", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "reader-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async () => jsonResponse(userProfilePayload({
            user_info: {
                user_id: 1001,
                nickname: "接口作者 <script>alert(1)</script>",
                avatar: "https://example.com/author.png",
                bio: "接口返回的作者简介"
            },
            followee_count: 5,
            follower_count: 21,
            like_received_count: 34,
            favorite_received_count: 8,
            content_count: 13,
            is_following: true
        })));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "接口作者 <script>alert(1)</script>" })).toBeInTheDocument();
        expect(screen.getByText("接口返回的作者简介")).toBeInTheDocument();
        expect(screen.getAllByText("13").length).toBeGreaterThan(0);
        expect(screen.getAllByText("5").length).toBeGreaterThan(0);
        expect(screen.getAllByText("21").length).toBeGreaterThan(0);
        expect(screen.getByRole("button", { name: "已关注" })).toHaveAttribute("data-user-id", "1001");
        expect(document.querySelector("script")).toBeNull();
        expect(fetchMock).toHaveBeenCalledWith("/v1/user/profile/jax", expect.objectContaining({
            method: "GET",
            headers: expect.objectContaining({
                Authorization: "Bearer reader-token"
            })
        }));
    });

    it("loads a user published feed after the user profile", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "reader-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            if (input === "/v1/user/profile/jax") {
                return jsonResponse(userProfilePayload());
            }

            return jsonResponse(userPublishedFeedPayload());
        });
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "用户主页真实发布内容" })).toBeInTheDocument();
        expect(screen.getByText("这条内容来自用户发布流接口。")).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith("/v1/feed/user/publish", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer reader-token"
            }),
            body: JSON.stringify({ user_id: "1001", cursor: "", page_size: 20 })
        }));
    });

    it("shows an empty state when a user has no published content", async () => {
        vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
            if (input === "/v1/user/profile/jax") {
                return jsonResponse(userProfilePayload());
            }

            return jsonResponse(userPublishedFeedPayload([]));
        }));
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        expect(await screen.findByText("还没有公开发布内容")).toBeInTheDocument();
    });

    it("shows a contained error state when the user published feed fails", async () => {
        vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
            if (input === "/v1/user/profile/jax") {
                return jsonResponse(userProfilePayload());
            }

            return jsonResponse({ message: "raw feed failure" }, { status: 500 });
        }));
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "Jax Lee" })).toBeInTheDocument();
        const errorState = await screen.findByText("发布内容加载失败");
        expect(errorState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
        expect(screen.queryByText("raw feed failure")).not.toBeInTheDocument();
    });

    it("renders user published content as safe text", async () => {
        vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
            if (input === "/v1/user/profile/jax") {
                return jsonResponse(userProfilePayload());
            }

            return jsonResponse(userPublishedFeedPayload([
                defaultRecommendFeedItem({
                    content_id: 9102,
                    author_id: 1001,
                    author_name: "Jax Lee",
                    title: "发布 <script>alert(1)</script>",
                    description: "摘要 <img src=x onerror=alert(1)>"
                })
            ]));
        }));
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "发布 <script>alert(1)</script>" })).toBeInTheDocument();
        expect(screen.getByText("摘要 <img src=x onerror=alert(1)>")).toBeInTheDocument();
        expect(document.querySelector("script")).toBeNull();
    });

    it("shows an error state when a user profile cannot be loaded", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ message: "raw profile failure" }, { status: 500 })));
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        const errorState = await screen.findByText("用户主页加载失败");
        expect(errorState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
        expect(screen.queryByText("raw profile failure")).not.toBeInTheDocument();
        expect(screen.queryByText("Jax Lee")).not.toBeInTheDocument();
    });

    it("loads numeric content detail from the API without executing user content", async () => {
        const fetchMock = vi.fn(async () => jsonResponse({
            detail: {
                content_id: "1001",
                content_type: 1,
                author_id: "1002",
                author_name: "Nora <admin>",
                author_avatar: "https://example.com/nora.png",
                title: "真实详情 <script>alert(1)</script>",
                description: "接口返回的正文摘要",
                cover_url: "https://example.com/cover.png",
                article_content: "第一段真实正文。\n第二段保持安全文本。",
                video_url: "",
                video_duration: 0,
                published_at: 1765670400,
                like_count: 12,
                favorite_count: 5,
                comment_count: 3,
                is_liked: false,
                is_favorited: true,
                is_following_author: false
            }
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/content/1001");

        render(<App />);

        expect(await screen.findByText("真实详情 <script>alert(1)</script>")).toBeInTheDocument();
        expect(screen.getByText("Nora <admin>")).toBeInTheDocument();
        expect(screen.getByText("第一段真实正文。")).toBeInTheDocument();
        expect(screen.getByText("第二段保持安全文本。")).toBeInTheDocument();
        expect(document.querySelector("script")).toBeNull();
        expect(fetchMock).toHaveBeenCalledWith("/v1/content/detail", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ content_id: "1001" })
        }));
    });

    it("shows an error state when numeric content detail cannot be loaded", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, { status: 500 })));
        window.history.pushState({}, "", "/content/1001");

        render(<App />);

        const errorState = await screen.findByText("内容加载失败");
        expect(errorState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
        expect(screen.queryByText("用 AI 构建产品：30 天从 0 到 1")).not.toBeInTheDocument();
    });

    it("shows an auth-required state on edit profile when signed out", async () => {
        window.history.pushState({}, "", "/me/edit");

        render(<App />);

        const authState = await screen.findByText("登录后才能编辑资料。");
        expect(authState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "auth-required");
        expect(screen.getByRole("link", { name: "去登录" })).toHaveAttribute("href", "/login?next=%2Fme%2Fedit");
        expect(screen.queryByLabelText("昵称")).not.toBeInTheDocument();
    });

    it("renders the login route with the required fields", async () => {
        window.history.pushState({}, "", "/login");

        render(<App />);

        expect(await screen.findByRole("heading", { name: "登录 zfeed" })).toBeInTheDocument();
        expect(screen.getByTitle("zfeed 首页雾化背景")).toBeInTheDocument();
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

    it("validates login phone format and password length before submitting", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/login");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "12345" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "12345" } });
        fireEvent.click(screen.getByRole("button", { name: "登录" }));

        expect(await screen.findByText("请输入有效手机号")).toBeInTheDocument();
        expect(screen.getByText("密码至少 6 位")).toBeInTheDocument();
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

    it("prevents duplicate login submissions while the request is pending", async () => {
        let resolveLogin!: (response: Response) => void;
        const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
            resolveLogin = resolve;
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/login");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "13800138000" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "password123" } });
        const form = screen.getByRole("button", { name: "登录" }).closest("form");
        expect(form).not.toBeNull();

        fireEvent.submit(form!);
        expect(await screen.findByRole("button", { name: "登录中" })).toBeDisabled();
        fireEvent.submit(form!);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        resolveLogin(jsonResponse({
            user_id: 7,
            token: "login-token",
            expired_at: Math.floor(Date.now() / 1000) + 3600,
            nickname: "Mira Chen",
            avatar: "https://example.com/avatar.png"
        }));
        await waitFor(() => expect(window.location.pathname).toBe("/home"));
    });

    it("returns to a safe next path after login", async () => {
        const fetchMock = vi.fn(async () => jsonResponse({
            user_id: 7,
            token: "login-token",
            expired_at: Math.floor(Date.now() / 1000) + 3600,
            nickname: "Mira Chen",
            avatar: "https://example.com/avatar.png"
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/login?next=%2Fcompose");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "13800138000" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: "登录" }));

        await waitFor(() => expect(window.location.pathname).toBe("/compose"));
    });

    it("ignores unsafe external next paths after login", async () => {
        const fetchMock = vi.fn(async () => jsonResponse({
            user_id: 7,
            token: "login-token",
            expired_at: Math.floor(Date.now() / 1000) + 3600,
            nickname: "Mira Chen",
            avatar: "https://example.com/avatar.png"
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/login?next=https%3A%2F%2Fevil.example%2Fsteal");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "13800138000" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: "登录" }));

        await waitFor(() => expect(window.location.pathname).toBe("/home"));
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
        expect(screen.getByTitle("zfeed 首页雾化背景")).toBeInTheDocument();
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
        fireEvent.change(screen.getByLabelText("头像 URL"), { target: { value: "javascript:alert(1)" } });
        fireEvent.change(screen.getByLabelText("邮箱"), { target: { value: "bad-email" } });
        fireEvent.change(screen.getByLabelText("简介"), { target: { value: "b".repeat(256) } });
        fireEvent.click(screen.getByRole("button", { name: "注册" }));

        expect(await screen.findByText("请输入手机号")).toBeInTheDocument();
        expect(screen.getByText("请输入密码")).toBeInTheDocument();
        expect(screen.getByText("昵称最多 64 字")).toBeInTheDocument();
        expect(screen.getByText("请输入有效头像链接")).toBeInTheDocument();
        expect(screen.getByText("请输入有效邮箱")).toBeInTheDocument();
        expect(screen.getByText("简介最多 255 字")).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("validates register phone format and password length before submitting", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/register");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "12345" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "12345" } });
        fireEvent.click(screen.getByRole("button", { name: "注册" }));

        expect(await screen.findByText("请输入有效手机号")).toBeInTheDocument();
        expect(screen.getByText("密码至少 6 位")).toBeInTheDocument();
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

    it("prevents duplicate register submissions while the request is pending", async () => {
        let resolveRegister!: (response: Response) => void;
        const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
            resolveRegister = resolve;
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/register");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("手机号"), { target: { value: "13900139000" } });
        fireEvent.change(screen.getByLabelText("密码"), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText("昵称"), { target: { value: "New User" } });
        const form = screen.getByRole("button", { name: "注册" }).closest("form");
        expect(form).not.toBeNull();

        fireEvent.submit(form!);
        expect(await screen.findByRole("button", { name: "注册中" })).toBeDisabled();
        fireEvent.submit(form!);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        resolveRegister(jsonResponse({
            user_id: 9,
            token: "register-token",
            expired_at: Math.floor(Date.now() / 1000) + 3600
        }));
        await waitFor(() => expect(window.location.pathname).toBe("/me"));
    });

    it("opens compose from the primary publish button", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(recommendFeedPayload())));
        window.history.pushState({}, "", "/home");

        render(<App />);

        fireEvent.click(await screen.findByRole("button", { name: /发布/ }));

        await waitFor(() => expect(window.location.pathname).toBe("/compose"));
        expect(await screen.findByRole("heading", { name: "发布" })).toBeInTheDocument();
    });

    it("opens compose from the home composer input instead of treating it as search", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(recommendFeedPayload())));
        window.history.pushState({}, "", "/home");

        render(<App />);

        const composer = await screen.findByPlaceholderText("分享你的想法、灵感或最新动态...");
        fireEvent.change(composer, { target: { value: "准备发布一条动态" } });
        fireEvent.keyDown(composer, { key: "Enter" });

        await waitFor(() => expect(window.location.pathname).toBe("/compose"));
        expect(window.location.search).toBe("");
    });

    it("shows an auth-required state on compose with a next-aware login link", async () => {
        window.history.pushState({}, "", "/compose");

        render(<App />);

        const authState = await screen.findByText("发布需要登录。");
        expect(authState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "auth-required");
        expect(screen.getByRole("link", { name: "去登录" })).toHaveAttribute("href", "/login?next=%2Fcompose");
        expect(screen.queryByPlaceholderText("标题")).not.toBeInTheDocument();
    });

    it("shows an auth-required state on settings when signed out", async () => {
        window.history.pushState({}, "", "/settings");

        render(<App />);

        const authState = await screen.findByText("登录后才能管理设置。");
        expect(authState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "auth-required");
        expect(screen.getByRole("link", { name: "去登录" })).toHaveAttribute("href", "/login?next=%2Fsettings");
        expect(screen.queryByText("账号与安全")).not.toBeInTheDocument();
    });

    it("opens search from the global search box", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(recommendFeedPayload())));
        window.history.pushState({}, "", "/home");

        render(<App />);

        const searchBox = await screen.findByPlaceholderText("搜索内容、创作者或话题");
        fireEvent.change(searchBox, { target: { value: "AI 创作" } });
        fireEvent.keyDown(searchBox, { key: "Enter" });

        await waitFor(() => expect(window.location.pathname).toBe("/search"));
        expect(window.location.search).toBe("?q=AI+%E5%88%9B%E4%BD%9C");
    });

    it("loads content and user results from the search query", async () => {
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            if (input === "/v1/search/contents") {
                return jsonResponse({
                    items: [{
                        content_id: 1001,
                        content_type: 1,
                        author_id: 1001,
                        author_name: "Jax Lee",
                        author_avatar: "https://example.com/jax.png",
                        title: "AI 搜索结果 <script>alert(1)</script>",
                        cover_url: "https://example.com/cover.png",
                        published_at: 1765670400
                    }],
                    next_cursor: 0,
                    has_more: false,
                    next_page_token: "",
                    snapshot_id: "content-snapshot"
                });
            }

            if (input === "/v1/search/users") {
                return jsonResponse({
                    items: [{
                        user_id: 1002,
                        nickname: "Nora <admin>",
                        avatar: "https://example.com/nora.png",
                        bio: "研究 AI 工具",
                        is_following: false
                    }],
                    next_cursor: 0,
                    has_more: false,
                    next_page_token: "",
                    snapshot_id: "user-snapshot"
                });
            }

            return jsonResponse({});
        });
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/search?q=AI+%E5%88%9B%E4%BD%9C");

        render(<App />);

        expect(await screen.findByText("AI 搜索结果 <script>alert(1)</script>")).toBeInTheDocument();
        expect(screen.getByText("Nora <admin>")).toBeInTheDocument();
        expect(screen.queryByText("输入关键词开始搜索")).not.toBeInTheDocument();
        expect(document.querySelector("script")).toBeNull();
        expect(fetchMock).toHaveBeenCalledWith("/v1/search/contents", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ query: "AI 创作", page_size: 10, mode: "hybrid" })
        }));
        expect(fetchMock).toHaveBeenCalledWith("/v1/search/users", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ query: "AI 创作", page_size: 10, mode: "hybrid" })
        }));
    });

    it("validates search query length before requesting results", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", `/search?q=${"a".repeat(51)}`);

        render(<App />);

        expect(await screen.findByText("关键词最多 50 字")).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("guides unauthenticated write actions to login without calling the API", async () => {
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            if (isRecommendFeedRequest(input)) {
                return jsonResponse(recommendFeedPayload());
            }

            return jsonResponse({});
        });
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/home");

        render(<App />);

        const likeButton = (await screen.findAllByText("favorite"))[0].closest("button");
        expect(likeButton).not.toBeNull();
        fireEvent.click(likeButton!);

        await waitFor(() => expect(window.location.pathname).toBe("/login"));
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith("/v1/feed/recommend", expect.any(Object));
    });

    it("uses Bearer writes for liked content and rolls back when the API fails", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "write-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            if (isRecommendFeedRequest(input)) {
                return jsonResponse(recommendFeedPayload());
            }

            return jsonResponse({ message: "raw failure" }, { status: 500 });
        });
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
            body: JSON.stringify({ content_id: "1001", scene: "content" })
        })));
        await waitFor(() => expect(likeButton).toHaveClass("text-error"));
        expect(screen.queryByText("raw failure")).not.toBeInTheDocument();
    });

    it("disables content action buttons while the write request is pending", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "write-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        let resolveWrite!: (response: Response) => void;
        const fetchMock = vi.fn((input: RequestInfo | URL) => {
            if (isRecommendFeedRequest(input)) {
                return Promise.resolve(jsonResponse(recommendFeedPayload()));
            }

            return new Promise<Response>((resolve) => {
                resolveWrite = resolve;
            });
        });
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/home");

        render(<App />);

        const likeButton = (await screen.findAllByText("favorite"))[0].closest("button");
        expect(likeButton).not.toBeNull();
        fireEvent.click(likeButton!);

        expect(likeButton).toBeDisabled();
        expect(fetchMock).toHaveBeenCalledTimes(2);

        resolveWrite(jsonResponse({}));
        await waitFor(() => expect(likeButton).not.toBeDisabled());
    });

    it("uses Bearer writes for favorite content and rolls back when the API fails", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "favorite-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            if (isRecommendFeedRequest(input)) {
                return jsonResponse(recommendFeedPayload());
            }

            return jsonResponse({ message: "raw favorite failure" }, { status: 500 });
        });
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/home");

        render(<App />);

        const favoriteButton = await screen.findByRole("button", { name: "收藏" });
        expect(favoriteButton).toHaveClass("text-on-surface-variant");

        fireEvent.click(favoriteButton);

        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/interaction/favorite", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer favorite-token"
            }),
            body: JSON.stringify({ content_id: "1001", scene: "content" })
        })));
        await waitFor(() => expect(favoriteButton).toHaveClass("text-on-surface-variant"));
        expect(screen.queryByText("raw favorite failure")).not.toBeInTheDocument();
    });

    it("follows a profile author with Bearer auth and optimistic feedback", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "follow-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            if (input === "/v1/user/profile/jax") {
                return jsonResponse(userProfilePayload());
            }

            return jsonResponse({ is_followed: true });
        });
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        const followButton = (await screen.findAllByRole("button", { name: /关注/ }))[0];
        fireEvent.click(followButton);

        expect(await screen.findByRole("button", { name: "已关注" })).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith("/v1/user/profile/jax", expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: "Bearer follow-token"
            })
        }));
        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/interaction/followings", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer follow-token"
            }),
            body: JSON.stringify({ target_user_id: "1001" })
        })));
    });

    it("disables follow buttons while the request is pending", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "follow-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        let resolveFollow!: (response: Response) => void;
        const fetchMock = vi.fn((input: RequestInfo | URL) => {
            if (input === "/v1/user/profile/jax") {
                return Promise.resolve(jsonResponse(userProfilePayload()));
            }
            if (input === "/v1/feed/user/publish") {
                return Promise.resolve(jsonResponse(userPublishedFeedPayload()));
            }

            return new Promise<Response>((resolve) => {
                resolveFollow = resolve;
            });
        });
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/user/jax");

        render(<App />);

        const followButton = (await screen.findAllByRole("button", { name: /关注/ }))[0];
        fireEvent.click(followButton);

        expect(await screen.findByRole("button", { name: "已关注" })).toBeDisabled();
        expect(fetchMock).toHaveBeenCalledTimes(3);

        resolveFollow(jsonResponse({ is_followed: true }));
        await waitFor(() => expect(followButton).not.toBeDisabled());
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

    it("validates content comment length before calling the API", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "comment-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7, nickname: "Mira Chen" }
        }));
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/content/article-1");

        render(<App />);

        const composer = await screen.findByPlaceholderText("写下你的观点，补充或提问...");
        fireEvent.change(composer, { target: { value: "评".repeat(256) } });
        fireEvent.click(screen.getByRole("button", { name: "发送" }));

        expect(await screen.findByText("评论最多 255 字")).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("disables the comment submit button while the request is pending", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "comment-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7, nickname: "Mira Chen" }
        }));
        let resolveComment!: (response: Response) => void;
        const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
            resolveComment = resolve;
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/content/article-1");

        render(<App />);

        const composer = await screen.findByPlaceholderText("写下你的观点，补充或提问...");
        fireEvent.change(composer, { target: { value: "请求中禁用评论按钮" } });
        fireEvent.click(screen.getByRole("button", { name: "发送" }));

        expect(await screen.findByRole("button", { name: "发送中" })).toBeDisabled();
        expect(fetchMock).toHaveBeenCalledTimes(1);

        resolveComment(jsonResponse({ comment_id: "5003" }));
        await waitFor(() => expect(screen.getByRole("button", { name: "发送" })).not.toBeDisabled());
    });

    it("posts a reply from an inline reply composer with Bearer auth", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "reply-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7, nickname: "Mira Chen" }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({ comment_id: "5002" }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/content/article-1");

        render(<App />);

        const replyButtons = await screen.findAllByRole("button", { name: "回复" });
        fireEvent.click(replyButtons[0]);

        const replyInput = await screen.findByPlaceholderText("回复 Chen Zhiyuan...");
        fireEvent.change(replyInput, { target: { value: "补充一下这条回复" } });
        const replyComposer = replyInput.closest("[data-reply-composer]");
        expect(replyComposer).not.toBeNull();
        fireEvent.click(within(replyComposer as HTMLElement).getByRole("button", { name: "发送" }));

        expect(await screen.findByText("补充一下这条回复")).toBeInTheDocument();
        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/interaction/comment", expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                Authorization: "Bearer reply-token"
            }),
            body: JSON.stringify({
                content_id: "1001",
                scene: "content",
                comment: "补充一下这条回复",
                parent_id: "3001",
                root_id: "3001",
                reply_to_user_id: "2001",
                content_user_id: "1001"
            })
        })));
    });

    it("disables the reply submit button while the request is pending", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "reply-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7, nickname: "Mira Chen" }
        }));
        let resolveReply!: (response: Response) => void;
        const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
            resolveReply = resolve;
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/content/article-1");

        render(<App />);

        const replyButtons = await screen.findAllByRole("button", { name: "回复" });
        fireEvent.click(replyButtons[0]);

        const replyInput = await screen.findByPlaceholderText("回复 Chen Zhiyuan...");
        fireEvent.change(replyInput, { target: { value: "请求中禁用回复按钮" } });
        const replyComposer = replyInput.closest("[data-reply-composer]");
        expect(replyComposer).not.toBeNull();
        fireEvent.click(within(replyComposer as HTMLElement).getByRole("button", { name: "发送" }));

        expect(await within(replyComposer as HTMLElement).findByRole("button", { name: "发送中" })).toBeDisabled();
        expect(fetchMock).toHaveBeenCalledTimes(1);

        resolveReply(jsonResponse({ comment_id: "5004" }));
        await waitFor(() => expect(within(replyComposer as HTMLElement).getByRole("button", { name: "发送" })).not.toBeDisabled());
    });

    it("deletes my own comment optimistically with Bearer auth", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "delete-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7, nickname: "Mira Chen" }
        }));
        const fetchMock = vi.fn(async () => jsonResponse({}));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/content/article-1");

        render(<App />);

        expect(await screen.findByText("评论区也需要保持阅读节奏，信息密度不能太吵。喜欢这种评论卡片和正文之间的层级。")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "删除评论" }));

        await waitFor(() => expect(screen.queryByText("评论区也需要保持阅读节奏，信息密度不能太吵。喜欢这种评论卡片和正文之间的层级。")).not.toBeInTheDocument());
        await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/v1/interaction/comment", expect.objectContaining({
            method: "DELETE",
            headers: expect.objectContaining({
                Authorization: "Bearer delete-token"
            }),
            body: JSON.stringify({
                comment_id: "3003",
                content_id: "1001",
                scene: "content",
                root_id: "3003"
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

    it("disables the edit profile save button while the request is pending", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "profile-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        let resolveProfileSave!: (response: Response) => void;
        const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
            resolveProfileSave = resolve;
        }));
        vi.stubGlobal("fetch", fetchMock);
        window.history.pushState({}, "", "/me/edit");

        render(<App />);

        fireEvent.change(await screen.findByLabelText("昵称"), { target: { value: "Mira Pending" } });
        fireEvent.click(screen.getByRole("button", { name: /保存/ }));

        expect(await screen.findByRole("button", { name: /保存中/ })).toBeDisabled();
        expect(fetchMock).toHaveBeenCalledTimes(1);

        resolveProfileSave(jsonResponse({}));
        expect(await screen.findByText("资料已保存")).toBeInTheDocument();
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

    it("submits the search page input back into the product search route", async () => {
        window.history.pushState({}, "", "/search");

        render(<App />);

        const searchInput = await screen.findByPlaceholderText("搜索内容、创作者或话题");
        expect(screen.getByText("输入关键词开始搜索").closest("[data-page-state]")).toHaveAttribute("data-page-state", "empty");
        fireEvent.change(searchInput, { target: { value: "设计 系统" } });
        fireEvent.keyDown(searchInput, { key: "Enter" });

        await waitFor(() => expect(window.location.pathname).toBe("/search"));
        expect(window.location.search).toBe("?q=%E8%AE%BE%E8%AE%A1+%E7%B3%BB%E7%BB%9F");
    });

    it("opens internal links inside the React app without a full page navigation", async () => {
        window.localStorage.setItem("zfeed.auth.session", JSON.stringify({
            token: "me-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600,
            user: { userId: 7 }
        }));
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(recommendFeedPayload())));
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

        const errorState = await screen.findByText("页面不存在");
        expect(errorState.closest("[data-page-state]")).toHaveAttribute("data-page-state", "error");
    });
});
