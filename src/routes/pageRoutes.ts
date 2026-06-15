export type PageId =
    | "auth-gateway"
    | "home"
    | "following"
    | "profile"
    | "detail"
    | "edit-content"
    | "edit-profile"
    | "search"
    | "compose"
    | "settings"
    | "login"
    | "register"
    | "liquid-glass-feed"
    | "not-found";

const routeMap: Record<string, PageId> = {
    "/": "auth-gateway",
    "/home": "home",
    "/me": "profile",
    "/following": "following",
    "/me/edit": "edit-profile",
    "/search": "search",
    "/compose": "compose",
    "/settings": "settings",
    "/login": "login",
    "/register": "register",
    "/liquid-glass-feed": "liquid-glass-feed"
};

export function resolvePageRoute(pathname: string): PageId {
    if (/^\/user\/[^/]+$/.test(pathname)) {
        return "profile";
    }

    if (/^\/content\/[^/]+\/edit$/.test(pathname)) {
        return "edit-content";
    }

    if (/^\/content\/[^/]+$/.test(pathname)) {
        return "detail";
    }

    return routeMap[pathname] ?? "not-found";
}
