import { clearAuthSession, readAuthSession } from "./authStore";

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    auth?: boolean;
};

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message = "请求失败"
    ) {
        super(message);
    }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
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

    if (options.auth) {
        const session = readAuthSession();
        if (session) {
            headers.Authorization = `Bearer ${session.token}`;
        }
    }

    const response = await fetch(path, init);

    if (response.status === 401 || response.status === 403) {
        clearAuthSession();
        throw new ApiError(response.status, "登录状态已失效");
    }

    if (!response.ok) {
        throw new ApiError(response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
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
