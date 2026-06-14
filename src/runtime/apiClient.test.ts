import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    ApiError,
    apiRequest,
    authorizedFetch,
    favoriteContent,
    getApiBaseUrl,
    likeContent
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
