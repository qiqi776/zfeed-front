export type PageId =
    | "home"
    | "following"
    | "profile"
    | "detail"
    | "edit-profile"
    | "liquid-glass-feed"
    | "not-found";

const routeMap: Record<string, PageId> = {
    "/": "home",
    "/following": "following",
    "/profile": "profile",
    "/detail": "detail",
    "/edit-profile": "edit-profile",
    "/liquid-glass-feed": "liquid-glass-feed"
};

export function resolvePageRoute(pathname: string): PageId {
    return routeMap[pathname] ?? "not-found";
}
