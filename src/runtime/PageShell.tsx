import type { ReactNode } from "react";
import { useEffect } from "react";

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
            handleActionClick(event);
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
        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pageshow", onPageShow);
            document.removeEventListener("click", onClick);
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
    const button = target?.closest<HTMLElement>(".action");
    if (!button) {
        return;
    }

    if (button.querySelector('[data-lucide="heart"]')) {
        button.classList.toggle("selected");
    }

    if (button.querySelector('[data-lucide="bookmark"]')) {
        button.classList.toggle("bookmarked");
        const label = button.querySelector("span");
        if (label) {
            label.textContent = button.classList.contains("bookmarked") ? "已收藏" : "收藏";
        }
    }
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
