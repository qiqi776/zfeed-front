import { lazy, Suspense, useEffect, useState } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { resolvePageRoute } from "./routes/pageRoutes";
import type { PageId } from "./routes/pageRoutes";
import "./styles/index.css";

const pageComponents: Record<PageId, LazyExoticComponent<ComponentType>> = {
    "auth-gateway": lazy(() => import("./pages/AuthGatewayPage").then((module) => ({ default: module.AuthGatewayPage }))),
    home: lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage }))),
    following: lazy(() => import("./pages/FollowingPage").then((module) => ({ default: module.FollowingPage }))),
    profile: lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage }))),
    detail: lazy(() => import("./pages/DetailPage").then((module) => ({ default: module.DetailPage }))),
    "edit-profile": lazy(() => import("./pages/EditProfilePage").then((module) => ({ default: module.EditProfilePage }))),
    search: lazy(() => import("./pages/SearchPage").then((module) => ({ default: module.SearchPage }))),
    compose: lazy(() => import("./pages/ComposePage").then((module) => ({ default: module.ComposePage }))),
    settings: lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage }))),
    login: lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage }))),
    register: lazy(() => import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage }))),
    "liquid-glass-feed": lazy(() => import("./pages/LiquidGlassFeedPage").then((module) => ({ default: module.LiquidGlassFeedPage }))),
    "not-found": lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })))
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

    return (
        <Suspense fallback={<RouteLoading />}>
            <Page key={pageKey} />
        </Suspense>
    );
}

function RouteLoading() {
    return <div className="min-h-screen bg-[#eef2f6] px-6 py-8 text-[14px] text-slate-500">正在加载...</div>;
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
            url.pathname === "/me" ||
            url.pathname === "/me/edit" ||
            url.pathname === "/following" ||
            url.pathname.startsWith("/user/") ||
            url.pathname.startsWith("/content/") ||
            url.pathname === "/search" ||
            url.pathname === "/compose" ||
            url.pathname === "/settings" ||
            url.pathname === "/login" ||
            url.pathname === "/register" ||
            url.pathname === "/liquid-glass-feed")
    );
}
