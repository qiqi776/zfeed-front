export type PageId =
    | "auth-gateway"
    | "home"
    | "following"
    | "profile"
    | "detail"
    | "edit-profile"
    | "login"
    | "register"
    | "liquid-glass-feed"
    | "not-found";

const routeMap: Record<string, PageId> = {
    "/": "auth-gateway",
    "/home": "home",
    "/me": "profile",
    "/following": "following",
    "/profile": "profile",
    "/detail": "detail",
    "/edit-profile": "edit-profile",
    "/login": "login",
    "/register": "register",
    "/liquid-glass-feed": "liquid-glass-feed"
};

export function resolvePageRoute(pathname: string): PageId {
    return routeMap[pathname] ?? "not-found";
}
