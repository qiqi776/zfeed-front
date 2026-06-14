import { clearAuthSession, readAuthSession } from "./authStore";

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    auth?: boolean;
};

type ContentActionBody = {
    contentId: string;
};

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message = "请求失败，请稍后重试"
    ) {
        super(message);
    }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const request = options.auth ? authorizedFetch : rawFetch;
    const response = await request(path, options);

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export function authorizedFetch(path: string, options: RequestOptions = {}) {
    const session = readAuthSession();
    if (!session) {
        return Promise.reject(new ApiError(401, "请先登录后再操作"));
    }

    return rawFetch(path, {
        ...options,
        auth: true
    });
}

async function rawFetch(path: string, options: RequestOptions = {}) {
    const headers: Record<string, string> = {
        Accept: "application/json"
    };
    const init: RequestInit = {
        method: options.method ?? "GET",
        headers
    };

    if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(options.body);
    }

    const session = options.auth ? readAuthSession() : null;
    if (session) {
        headers.Authorization = `Bearer ${session.token}`;
    }

    let response: Response;
    try {
        response = await fetch(resolveApiUrl(path), init);
    } catch {
        throw new ApiError(0, "网络连接失败，请稍后重试");
    }

    if (response.status === 401 || response.status === 403) {
        clearAuthSession();
        throw new ApiError(response.status, "登录状态已失效");
    }

    if (!response.ok) {
        throw new ApiError(response.status);
    }

    return response;
}

export function getApiBaseUrl() {
    return (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
}

function resolveApiUrl(path: string) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl || /^https?:\/\//.test(path)) {
        return path;
    }

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getMe<T>() {
    return apiRequest<T>("/v1/users/me", { auth: true });
}

export function login<T>(body: { mobile: string; password: string }) {
    return apiRequest<T>("/v1/login", { method: "POST", body });
}

export function register<T>(body: Record<string, string | undefined>) {
    return apiRequest<T>("/v1/users", { method: "POST", body });
}

export function likeContent<T = unknown>(body: ContentActionBody) {
    return apiRequest<T>("/v1/interaction/like", { method: "POST", body, auth: true });
}

export function unlikeContent<T = unknown>(body: ContentActionBody) {
    return apiRequest<T>("/v1/interaction/unlike", { method: "POST", body, auth: true });
}

export function favoriteContent<T = unknown>(body: ContentActionBody) {
    return apiRequest<T>("/v1/interaction/favorite", { method: "POST", body, auth: true });
}

export function unfavoriteContent<T = unknown>(body: ContentActionBody) {
    return apiRequest<T>("/v1/interaction/favorite", { method: "DELETE", body, auth: true });
}
