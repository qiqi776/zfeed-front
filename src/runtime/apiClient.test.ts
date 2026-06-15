import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    ApiError,
    apiRequest,
    authorizedFetch,
    commentContent,
    deleteComment,
    favoriteContent,
    getApiBaseUrl,
    likeContent,
    unlikeContent,
    unfavoriteContent
} from "./apiClient";
import { saveAuthSession } from "./authStore";

function jsonResponse(body: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        status: 200,
        ...init
    });
}

describe("apiClient", () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it("uses a configurable API base URL for JSON requests", async () => {
        vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test");
        const fetchMock = vi.fn(async () => jsonResponse({ ok: true }));
        vi.stubGlobal("fetch", fetchMock);

        await apiRequest("/v1/feed/recommend", {
            method: "POST",
            body: { cursor: 0 }
        });

        expect(getApiBaseUrl()).toBe("https://api.example.test");
        expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/v1/feed/recommend", expect.objectContaining({
            body: JSON.stringify({ cursor: 0 }),
            method: "POST"
        }));
    });

    it("authorizedFetch adds Bearer token and clears it on auth failure", async () => {
        saveAuthSession({
            token: "secret-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600
        });
        const fetchMock = vi.fn(async () => jsonResponse({ message: "raw token failure" }, { status: 403 }));
        vi.stubGlobal("fetch", fetchMock);

        await expect(authorizedFetch("/v1/private", { method: "POST", body: { ok: true } })).rejects.toMatchObject({
            status: 403,
            message: "登录状态已失效"
        });

        expect(fetchMock).toHaveBeenCalledWith("/v1/private", expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: "Bearer secret-token"
            })
        }));
        expect(window.localStorage.getItem("zfeed.auth.session")).toBeNull();
    });

    it("blocks authenticated absolute URLs before sending the Bearer token", async () => {
        saveAuthSession({
            token: "secret-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600
        });
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        await expect(authorizedFetch("https://evil.example/v1/private")).rejects.toMatchObject({
            status: 400,
            message: "认证请求只能发送到站内 API"
        });

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("blocks authenticated write operations before fetch when there is no valid session", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        await expect(likeContent({ contentId: "article-1" })).rejects.toEqual(new ApiError(401, "请先登录后再操作"));
        await expect(favoriteContent({ contentId: "article-1" })).rejects.toMatchObject({
            status: 401,
            message: "请先登录后再操作"
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("serializes interaction write helpers with documented backend field names", async () => {
        saveAuthSession({
            token: "write-token",
            expiredAt: Math.floor(Date.now() / 1000) + 3600
        });
        const fetchMock = vi.fn(async () => jsonResponse({}));
        vi.stubGlobal("fetch", fetchMock);

        await likeContent({ contentId: "1001", contentUserId: "2001", scene: "content" });
        await unlikeContent({ contentId: "1001", scene: "content" });
        await favoriteContent({ contentId: "1001", scene: "content" });
        await unfavoriteContent({ contentId: "1001", scene: "content" });
        await commentContent({ content_id: "1001", scene: "content", comment: "hello", content_user_id: "2001" });
        await deleteComment({ comment_id: "3001", content_id: "1001", scene: "content" });

        expect(fetchMock).toHaveBeenNthCalledWith(1, "/v1/interaction/like", expect.objectContaining({
            body: JSON.stringify({ content_id: "1001", content_user_id: "2001", scene: "content" })
        }));
        expect(fetchMock).toHaveBeenNthCalledWith(2, "/v1/interaction/unlike", expect.objectContaining({
            body: JSON.stringify({ content_id: "1001", scene: "content" })
        }));
        expect(fetchMock).toHaveBeenNthCalledWith(3, "/v1/interaction/favorite", expect.objectContaining({
            body: JSON.stringify({ content_id: "1001", scene: "content" })
        }));
        expect(fetchMock).toHaveBeenNthCalledWith(4, "/v1/interaction/favorite", expect.objectContaining({
            method: "DELETE",
            body: JSON.stringify({ content_id: "1001", scene: "content" })
        }));
        expect(fetchMock).toHaveBeenNthCalledWith(5, "/v1/interaction/comment", expect.objectContaining({
            body: JSON.stringify({ content_id: "1001", scene: "content", comment: "hello", content_user_id: "2001" })
        }));
        expect(fetchMock).toHaveBeenNthCalledWith(6, "/v1/interaction/comment", expect.objectContaining({
            method: "DELETE",
            body: JSON.stringify({ comment_id: "3001", content_id: "1001", scene: "content" })
        }));
    });

    it("normalizes backend and network errors without exposing raw backend messages", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ message: "database password leaked" }, { status: 500 })));

        await expect(apiRequest("/v1/feed/recommend")).rejects.toMatchObject({
            status: 500,
            message: "请求失败，请稍后重试"
        });

        vi.stubGlobal("fetch", vi.fn(async () => {
            throw new Error("connect ECONNREFUSED 10.0.0.1");
        }));

        await expect(apiRequest("/v1/feed/recommend")).rejects.toMatchObject({
            status: 0,
            message: "网络连接失败，请稍后重试"
        });
    });
});
