export type AuthUser = {
    userId: number;
    nickname?: string;
    avatar?: string;
};

export type AuthSession = {
    token: string;
    expiredAt: number;
    user?: AuthUser;
};

const storageKey = "zfeed.auth.session";

export function readAuthSession(): AuthSession | null {
    const rawSession = window.localStorage.getItem(storageKey);
    if (!rawSession) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawSession) as Partial<AuthSession>;
        if (!isValidToken(parsed.token) || !isValidExpiry(parsed.expiredAt) || isExpired(parsed.expiredAt)) {
            clearAuthSession();
            return null;
        }

        return {
            token: parsed.token,
            expiredAt: parsed.expiredAt,
            user: parsed.user
        };
    } catch {
        clearAuthSession();
        return null;
    }
}

export function saveAuthSession(session: AuthSession) {
    window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export function clearAuthSession() {
    window.localStorage.removeItem(storageKey);
}

function isExpired(expiredAt: number) {
    return expiredAt <= Math.floor(Date.now() / 1000);
}

function isValidToken(token: unknown): token is string {
    return typeof token === "string" && token.trim().length > 0;
}

function isValidExpiry(expiredAt: unknown): expiredAt is number {
    return typeof expiredAt === "number" && Number.isFinite(expiredAt);
}
