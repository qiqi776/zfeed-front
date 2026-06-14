import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { AuthGatewayPage } from "./pages/AuthGatewayPage";
import { DetailPage } from "./pages/DetailPage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { FollowingPage } from "./pages/FollowingPage";
import { HomePage } from "./pages/HomePage";
import { LiquidGlassFeedPage } from "./pages/LiquidGlassFeedPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { resolvePageRoute } from "./routes/pageRoutes";
import type { PageId } from "./routes/pageRoutes";
import "./styles/index.css";

const pageComponents: Record<PageId, ComponentType> = {
    "auth-gateway": AuthGatewayPage,
    home: HomePage,
    following: FollowingPage,
    profile: ProfilePage,
    detail: DetailPage,
    "edit-profile": EditProfilePage,
    login: LoginPage,
    register: RegisterPage,
    "liquid-glass-feed": LiquidGlassFeedPage,
    "not-found": NotFoundPage
};

export function App() {
    const [revision, setRevision] = useState(0);
    const route = resolvePageRoute(window.location.pathname);
    const Page = pageComponents[route];
    const pageKey = `${route}-${window.location.search}-${revision}`;

    useEffect(() => {
        const onPopState = () => setRevision((current) => current + 1);
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const link = findClosestLink(event.target);
            if (!link || !shouldHandleInternalNavigation(event, link)) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            const nextUrl = new URL(link.href);
            if (nextUrl.href !== window.location.href) {
                window.history.pushState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
            }
        };

        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, []);

    return <Page key={pageKey} />;
}

function findClosestLink(target: EventTarget | null) {
    return target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
}

function shouldHandleInternalNavigation(event: MouseEvent, link: HTMLAnchorElement) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return false;
    }

    if (link.target === "_blank" || link.hasAttribute("download")) {
        return false;
    }

    const href = link.getAttribute("href");
    if (!href || href === "#" || href.startsWith("#")) {
        return false;
    }

    const url = new URL(link.href);
    return (
        url.origin === window.location.origin &&
        (url.pathname === "/" ||
            url.pathname === "/home" ||
            url.pathname === "/following" ||
            url.pathname === "/profile" ||
            url.pathname === "/detail" ||
            url.pathname === "/edit-profile" ||
            url.pathname === "/login" ||
            url.pathname === "/register" ||
            url.pathname === "/liquid-glass-feed")
    );
}
