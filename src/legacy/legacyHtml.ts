export type LegacyPageId =
    | "home"
    | "following"
    | "profile"
    | "detail"
    | "edit-profile"
    | "liquid-glass-feed";

const routeMap: Record<string, LegacyPageId> = {
    "/": "home",
    "/index.html": "home",
    "/pasted-html-original-copy.html": "home",
    "/following.html": "following",
    "/profile.html": "profile",
    "/detail.html": "detail",
    "/edit-profile.html": "edit-profile",
    "/liquid-glass-feed.html": "liquid-glass-feed"
};

export function resolveLegacyRoute(pathname: string): LegacyPageId {
    return routeMap[pathname] ?? "home";
}
