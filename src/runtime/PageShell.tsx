import type { ReactNode } from "react";
import { useEffect } from "react";
import { favoriteContent, likeContent, unfavoriteContent, unlikeContent } from "./apiClient";
import { readAuthSession } from "./authStore";
import { navigateTo } from "./navigation";

type PageShellProps = {
    title: string;
    htmlClass: string;
    bodyClass: string;
    styles: string;
    children?: ReactNode;
};

export function PageShell({ title, htmlClass, bodyClass, styles, children }: PageShellProps) {
    useEffect(() => {
        document.title = title;
        document.documentElement.lang = "zh-CN";
        document.documentElement.className = htmlClass || "light";
        document.body.className = bodyClass;

        const styleElement = document.createElement("style");
        styleElement.dataset.pageStyle = "true";
        styleElement.textContent = styles;
        document.head.append(styleElement);

        ensureLegacyBrowserApis();

        return () => {
            styleElement.remove();
        };
    }, [bodyClass, htmlClass, styles, title]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            document.querySelector(".feed-transition")?.classList.add("feed-ready");
        });

        const onPageShow = () => {
            document.querySelector(".feed-transition")?.classList.remove("feed-leaving");
            document.querySelector(".feed-transition")?.classList.add("feed-ready");
        };

        const onClick = (event: MouseEvent) => {
            handleSelectableClick(event);
            handleComposeClick(event);
            handleActionClick(event);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            handleSearchSubmit(event);
        };

        const onFocusIn = (event: FocusEvent) => {
            if (event.target instanceof Element && event.target.matches(".search-box input")) {
                event.target.closest(".search-wrap")?.classList.add("focused");
            }
        };

        const onFocusOut = (event: FocusEvent) => {
            if (!(event.target instanceof Element) || !event.target.matches(".search-box input")) {
                return;
            }

            const wrapper = event.target.closest(".search-wrap");
            window.setTimeout(() => wrapper?.classList.remove("focused"), 160);
        };

        window.addEventListener("pageshow", onPageShow);
        document.addEventListener("click", onClick);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pageshow", onPageShow);
            document.removeEventListener("click", onClick);
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("focusin", onFocusIn);
            document.removeEventListener("focusout", onFocusOut);
        };
    }, []);

    return children;
}

function handleSelectableClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLElement>(".channel, .segment, .tab, .top-channel");
    if (!button) {
        return;
    }

    const link = button.closest<HTMLAnchorElement>("a[href]");
    const href = link?.getAttribute("href");
    if (href && href !== "#") {
        return;
    }

    event.preventDefault();
    const group = button.parentElement?.querySelectorAll<HTMLElement>(".active");
    group?.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
}

function handleActionClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button) {
        return;
    }

    const action = resolveContentAction(button);
    if (!action) {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    const contentId = resolveContentId(button);
    if (!contentId) {
        return;
    }

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const snapshot = captureButtonState(button);
    button.dataset.pending = "true";
    applyOptimisticState(button, action);

    const request = action.kind === "like"
        ? action.nextActive ? likeContent({ contentId }) : unlikeContent({ contentId })
        : action.nextActive ? favoriteContent({ contentId }) : unfavoriteContent({ contentId });

    request.catch((error: unknown) => {
        restoreButtonState(button, snapshot);
        if (isAuthError(error)) {
            navigateToLogin();
        }
    }).finally(() => {
        delete button.dataset.pending;
    });
}

function handleComposeClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button || button.closest("form")) {
        return;
    }

    const icon = button.querySelector(".material-symbols-outlined")?.textContent?.trim();
    if (icon !== "add" || !button.textContent?.includes("发布")) {
        return;
    }

    event.preventDefault();
    navigateTo("/compose");
}

function handleSearchSubmit(event: KeyboardEvent) {
    if (event.key !== "Enter" || !(event.target instanceof HTMLInputElement)) {
        return;
    }

    if (!event.target.closest(".search-shell, .search-box, .composer-shell")) {
        return;
    }

    const query = event.target.value.trim();
    if (!query) {
        navigateTo("/search");
        return;
    }

    navigateTo(`/search?${new URLSearchParams({ q: query }).toString()}`);
}

function resolveContentAction(button: HTMLElement) {
    const iconNames = Array.from(button.querySelectorAll(".material-symbols-outlined, [data-lucide]"))
        .map((icon) => icon.getAttribute("data-lucide") ?? icon.textContent?.trim() ?? "");

    if (iconNames.includes("favorite") || iconNames.includes("heart")) {
        return { kind: "like" as const, nextActive: !isLikeActive(button) };
    }

    if (iconNames.includes("bookmark")) {
        return { kind: "favorite" as const, nextActive: !isFavoriteActive(button) };
    }

    return null;
}

function resolveContentId(button: HTMLElement) {
    const explicitId = button.dataset.contentId;
    if (explicitId) {
        return explicitId;
    }

    if (window.location.pathname.startsWith("/content/")) {
        return window.location.pathname.split("/")[2] ?? "";
    }

    const container = button.closest("article, section, main") ?? document;
    const contentLink = container.querySelector<HTMLAnchorElement>('a[href^="/content/"]');
    return contentLink?.getAttribute("href")?.split("/")[2] ?? "";
}

function captureButtonState(button: HTMLElement) {
    return {
        className: button.className,
        text: button.textContent ?? ""
    };
}

function restoreButtonState(button: HTMLElement, snapshot: { className: string; text: string }) {
    button.className = snapshot.className;
    const label = findActionLabel(button);
    if (label && snapshot.text.includes("已保存")) {
        label.textContent = "已保存";
    } else if (label && snapshot.text.includes("收藏")) {
        label.textContent = "收藏";
    }
}

function applyOptimisticState(button: HTMLElement, action: { kind: "like" | "favorite"; nextActive: boolean }) {
    if (action.kind === "like") {
        setClassToken(button, "text-error", action.nextActive);
        setClassToken(button, "text-on-surface-variant", !action.nextActive);
        return;
    }

    setClassToken(button, "text-primary", action.nextActive);
    setClassToken(button, "text-on-surface-variant", !action.nextActive);
    const label = findActionLabel(button);
    if (label) {
        label.textContent = action.nextActive ? "已保存" : "收藏";
    }
}

function setClassToken(element: HTMLElement, token: string, enabled: boolean) {
    if (enabled) {
        element.classList.add(token);
    } else {
        element.classList.remove(token);
    }
}

function isLikeActive(button: HTMLElement) {
    return button.classList.contains("text-error") || button.classList.contains("selected");
}

function isFavoriteActive(button: HTMLElement) {
    return button.classList.contains("text-primary") || button.classList.contains("bookmarked") || (button.textContent ?? "").includes("已保存");
}

function findActionLabel(button: HTMLElement) {
    return Array.from(button.querySelectorAll("span")).find((item) => {
        const text = item.textContent?.trim();
        return text === "收藏" || text === "已保存";
    });
}

function navigateToLogin() {
    const next = `${window.location.pathname}${window.location.search}`;
    navigateTo(`/login?next=${encodeURIComponent(next)}`);
}

function isAuthError(error: unknown) {
    return typeof error === "object" && error !== null && "status" in error && (error.status === 401 || error.status === 403);
}

function ensureLegacyBrowserApis() {
    if (typeof window.matchMedia !== "function") {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => undefined,
                removeListener: () => undefined,
                addEventListener: () => undefined,
                removeEventListener: () => undefined,
                dispatchEvent: () => false
            })
        });
    }
}
