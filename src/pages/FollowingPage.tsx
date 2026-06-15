import { createElement, useEffect, useState } from "react";
import { getFollowFeed } from "../runtime/apiClient";
import { readAuthSession } from "../runtime/authStore";
import { PageShell } from "../runtime/PageShell";
import { PageState } from "./PageState";

type FollowFeedItem = {
    content_id: string | number;
    content_type?: number;
    author_id: string | number;
    author_name: string;
    author_avatar?: string;
    title: string;
    description?: string;
    cover_url?: string;
    published_at?: number;
    like_count?: number;
    favorite_count?: number;
    comment_count?: number;
    is_liked?: boolean;
    is_favorited?: boolean;
};

type FollowFeedResponse = {
    items?: FollowFeedItem[];
};

type FollowFeedState =
    | { status: "auth-required" }
    | { status: "loading" }
    | { status: "ready"; items: FollowFeedItem[] }
    | { status: "empty" }
    | { status: "error" };

const followFeedPageSize = 20;

const styles = "/* Liquid Glass Utility Classes */\r\n        .glass-panel {\r\n            background: rgba(255, 255, 255, 0.4);\r\n            backdrop-filter: blur(40px);\r\n            -webkit-backdrop-filter: blur(40px);\r\n            border: 1px solid rgba(255, 255, 255, 0.6);\r\n            border-top: 1px solid rgba(255, 255, 255, 0.8); /* Specular highlight */\r\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), \r\n                        0 4px 20px rgba(0, 0, 0, 0.05);\r\n        }\r\n        \r\n        .glass-input {\r\n            background: rgba(255, 255, 255, 0.5);\r\n            backdrop-filter: blur(20px);\r\n            border: 1px solid rgba(255, 255, 255, 0.7);\r\n            box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n        \r\n        .glass-input:focus {\n            outline: none;\n            border-color: var(--color-primary, #1f53c9);\n            box-shadow: 0 0 0 2px rgba(31, 83, 201, 0.2), inset 0 1px 3px rgba(0,0,0,0.02);\n        }\n\n        .search-shell {\n            border-radius: 9999px;\n            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-out;\n        }\n\n        .search-shell:hover,\n        .search-shell:focus-within {\n            transform: translateY(-2px);\n            filter: drop-shadow(0 10px 22px rgba(31, 83, 201, 0.14));\n        }\n\n        .search-shell .glass-input {\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.75), 0 4px 16px rgba(0, 0, 0, 0.04);\n        }\n\n        .search-shell:hover .glass-input {\n            background: rgba(255, 255, 255, 0.62);\n            border-color: rgba(255, 255, 255, 0.9);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .search-shell:focus-within .glass-input {\n            background: rgba(255, 255, 255, 0.72);\n            border-color: rgba(31, 83, 201, 0.55);\n            box-shadow: 0 0 0 3px rgba(31, 83, 201, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 10px 28px rgba(31, 83, 201, 0.16);\n        }\n\n        .search-shell::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n            z-index: 10;\n        }\n\n        .search-shell:hover::after,\n        .search-shell:focus-within::after {\n            left: 160%;\n        }\n\n        .composer-shell {\n            position: relative;\n            flex: 1;\n            overflow: hidden;\n            border-radius: 1.25rem;\n            background: rgba(255, 255, 255, 0.34);\n            backdrop-filter: blur(18px);\n            -webkit-backdrop-filter: blur(18px);\n            border: 1px solid rgba(255, 255, 255, 0.62);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.72), 0 4px 16px rgba(0, 0, 0, 0.035);\n            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out;\n        }\n\n        .composer-shell:hover,\n        .composer-shell:focus-within {\n            transform: translateY(-2px);\n            background: rgba(255, 255, 255, 0.58);\n            border-color: rgba(255, 255, 255, 0.9);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 10px 28px rgba(31, 83, 201, 0.12);\n        }\n\n        .composer-shell:focus-within {\n            border-color: rgba(31, 83, 201, 0.50);\n            box-shadow: 0 0 0 3px rgba(31, 83, 201, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 12px 30px rgba(31, 83, 201, 0.16);\n        }\n\n        .composer-shell::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n            z-index: 10;\n        }\n\n        .composer-shell:hover::after,\n        .composer-shell:focus-within::after {\n            left: 160%;\n        }\n\n        .composer-shell input {\n            position: relative;\n            z-index: 20;\n            min-height: 44px;\n            padding: 0.65rem 0.95rem;\n        }\n\n        .composer-shell input:focus {\n            outline: none;\n            box-shadow: none;\n        }\n\n        .top-channel {\n            position: relative;\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            overflow: hidden;\n            min-height: 34px;\n            padding: 0 12px;\n            border-radius: 9999px;\n            color: var(--color-on-surface-variant, #434654);\n            font-weight: 600;\n            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease-out, background 0.25s ease-out, box-shadow 0.25s ease-out;\n        }\n\n        .top-channel::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n        }\n\n        .top-channel:hover {\n            transform: translateY(-2px);\n            color: var(--color-primary, #1f53c9);\n            background: rgba(255, 255, 255, 0.62);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .top-channel.active {\n            color: var(--color-primary, #1f53c9);\n            background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(236, 244, 255, 0.62));\n            backdrop-filter: blur(20px) saturate(1.25);\n            -webkit-backdrop-filter: blur(20px) saturate(1.25);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(31, 83, 201, 0.12), 0 10px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .top-channel:hover::after,\n        .top-channel.active::after {\n            left: 160%;\n        }\n\n        .top-channel:active {\n            transform: translateY(-1px) scale(0.97);\n        }\n\n        .top-icon-btn {\n            width: 40px;\n            height: 40px;\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            transform: translateY(2px);\n            background: rgba(255, 255, 255, 0.16);\n            border: 1px solid rgba(255, 255, 255, 0.22);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.45);\n        }\n\n        .top-icon-btn:hover {\n            transform: translateY(0);\n            background: rgba(255, 255, 255, 0.42);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.70), 0 8px 18px rgba(31, 83, 201, 0.10);\n        }\n\n        .glass-button-primary {\n            background: linear-gradient(135deg, rgba(64, 109, 228, 0.9) 0%, rgba(31, 83, 201, 0.9) 100%);\r\n            backdrop-filter: blur(10px);\r\n            box-shadow: 0 4px 15px rgba(31, 83, 201, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);\r\n            border: 1px solid rgba(255, 255, 255, 0.2);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n        \r\n        .glass-button-primary:hover {\r\n            transform: translateY(-1px);\r\n            box-shadow: 0 6px 20px rgba(31, 83, 201, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5);\r\n        }\r\n\r\n        .glass-button-ghost {\r\n            background: rgba(255, 255, 255, 0.3);\r\n            backdrop-filter: blur(10px);\r\n            border: 1px solid rgba(255, 255, 255, 0.6);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n\r\n        .glass-button-ghost:hover {\r\n            background: rgba(255, 255, 255, 0.5);\r\n            border-color: rgba(255, 255, 255, 0.8);\r\n        }\r\n\r\n        /* Hover Lift and Shine Effects */\r\n        .hover-lift {\r\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n        }\r\n        .hover-lift:hover {\r\n            transform: translateY(-4px);\r\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 12px 30px rgba(0, 0, 0, 0.08);\r\n            border-color: rgba(255, 255, 255, 0.9);\r\n        }\r\n\r\n        .shine-effect {\r\n            position: relative;\r\n            overflow: hidden;\r\n        }\r\n        .shine-effect::after {\r\n            content: '';\r\n            position: absolute;\r\n            top: 0;\r\n            left: -150%;\r\n            width: 50%;\r\n            height: 100%;\r\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);\r\n            transform: skewX(-25deg);\r\n            transition: left 0.7s ease;\r\n            z-index: 10;\r\n            pointer-events: none;\r\n        }\r\n        .shine-effect:hover::after {\r\n            left: 200%;\r\n        }\r\n\r\n        /* Ambient Background */\r\n        body {\n            background-color: #eef2f6;\n            background-image: \n                radial-gradient(circle at 15% 50%, rgba(180, 197, 255, 0.4) 0%, transparent 50%),\n                radial-gradient(circle at 85% 30%, rgba(219, 226, 250, 0.5) 0%, transparent 50%);\n            background-attachment: fixed;\n            min-height: 100vh;\n        }\n\n        .feed-transition {\n            opacity: 0;\n            transform: translateY(8px) scale(0.995);\n            filter: blur(8px);\n            transition:\n                opacity 0.28s ease,\n                transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),\n                filter 0.34s ease;\n        }\n\n        .feed-transition.feed-ready {\n            opacity: 1;\n            transform: none;\n            filter: none;\n        }\n\n        .feed-transition.feed-leaving {\n            opacity: 0;\n            transform: translateY(6px) scale(0.996);\n            filter: blur(7px);\n            pointer-events: none;\n        }\n\n        @media (prefers-reduced-motion: reduce) {\n            .feed-transition,\n            .feed-transition.feed-ready,\n            .feed-transition.feed-leaving {\n                opacity: 1;\n                transform: none;\n                filter: none;\n                transition: none;\n            }\n        }\n\n        .chart-glow-line {\n            filter: drop-shadow(0 4px 6px rgba(31, 83, 201, 0.2));\n        }\n\r\n        .nav-link-hover {\r\n            transition: all 0.2s ease-out;\r\n        }\r\n        .nav-link-hover:hover {\n            background: rgba(255, 255, 255, 0.4);\n            border-radius: 0.75rem;\n        }";

const bodyClass = "text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container";

export function FollowingPage() {
    const [state, setState] = useState<FollowFeedState>(() => readAuthSession() ? { status: "loading" } : { status: "auth-required" });

    useEffect(() => {
        if (!readAuthSession()) {
            return;
        }

        let isCurrent = true;

        getFollowFeed<FollowFeedResponse>({ cursor: "", page_size: followFeedPageSize })
            .then((response) => {
                if (!isCurrent) {
                    return;
                }

                const items = response.items ?? [];
                setState(items.length > 0 ? { status: "ready", items } : { status: "empty" });
            })
            .catch(() => {
                if (!isCurrent) {
                    return;
                }

                setState(readAuthSession() ? { status: "error" } : { status: "auth-required" });
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    if (state.status !== "ready") {
        return renderFollowingStatePage(state);
    }

    return renderDynamicFollowingPage(state.items);
}

function renderFollowingStatePage(state: Exclude<FollowFeedState, { status: "ready" }>) {
    const stateView = getFollowingStateView(state.status);

    return createElement(
        PageShell,
        { title: "zfeed - 关注信息流", htmlClass: "light", bodyClass, styles },
        createElement("div", { className: "page-root" },
            createElement("main", { className: "min-h-screen px-4 py-6 md:px-6 md:py-10" },
                createElement("section", { className: "glass-panel feed-transition feed-ready mx-auto w-full max-w-3xl rounded-[28px] p-6 md:p-8" },
                    createElement("a", { className: "text-label-sm text-primary", href: "/home" }, "返回首页"),
                    createElement("h1", { className: "mt-5 font-display text-[34px] leading-tight text-on-surface" }, "关注流"),
                    createElement(PageState, stateView)
                )
            )
        )
    );
}

function renderDynamicFollowingPage(items: FollowFeedItem[]) {
    return createElement(
        PageShell,
        { title: "zfeed - 关注信息流", htmlClass: "light", bodyClass, styles },
        createElement("div", { className: "page-root" },
            createElement("header", { className: "fixed top-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-[50px] border-b border-white/20 saturate-[180%] shadow-sm border-white/30 shadow-md" },
                createElement("div", { className: "flex items-center gap-4" },
                    createElement("a", { className: "flex items-center gap-3 hover:opacity-80 transition-opacity duration-300", href: "/home" },
                        createElement("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center shadow-md" },
                            createElement("div", { className: "w-3 h-3 bg-white rounded-full" })
                        ),
                        createElement("span", { className: "font-display text-[24px] tracking-tight font-bold text-primary dark:text-primary-fixed" }, "zfeed")
                    ),
                    createElement("div", { className: "hidden md:flex ml-8 relative w-96 group md:ml-16 search-shell overflow-hidden" },
                        createElement("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300" }, "search"),
                        createElement("input", { className: "glass-input w-full pl-10 pr-4 rounded-full font-body-md text-on-surface placeholder:text-on-surface-variant/70 border-white/40 bg-white/30 backdrop-blur-md focus:bg-white/60 transition-colors py-2.5", placeholder: "搜索内容、创作者或话题", type: "text" })
                    )
                ),
                createElement("nav", { className: "hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-5" },
                    createElement("a", { className: "top-channel active text-label-sm tracking-wide", href: "/following" }, "关注"),
                    createElement("a", { className: "top-channel text-label-sm tracking-wide", href: "/home" }, "趋势"),
                    createElement("a", { className: "top-channel text-label-sm tracking-wide", href: "/home" }, "最新")
                ),
                createElement("div", { className: "flex items-center gap-5 pr-2 md:pr-12" },
                    createElement("button", { className: "hidden sm:flex glass-button-primary text-white font-label-sm py-2 rounded-full items-center gap-2 active:scale-95 px-6", type: "button" },
                        createElement("span", { className: "material-symbols-outlined text-[18px]" }, "add"),
                        "发布"
                    ),
                    createElement("a", { "aria-label": "进入我的主页", href: "/me" },
                        createElement("div", { className: "w-8 h-8 rounded-full border-2 border-white bg-white/50 shadow-sm" })
                    )
                )
            ),
            createElement("div", { className: "pt-24 px-4 md:px-6 max-w-[980px] mx-auto pb-safe" },
                createElement("main", { className: "feed-transition feed-ready flex flex-col gap-6 pb-24" },
                    createElement("div", { className: "glass-panel rounded-2xl p-5" },
                        createElement("div", { className: "flex flex-wrap items-end justify-between gap-3" },
                            createElement("div", null,
                                createElement("p", { className: "font-meta-xs uppercase tracking-wider text-on-surface-variant/70" }, "Following"),
                                createElement("h1", { className: "mt-1 font-display text-[30px] leading-tight text-on-surface" }, "关注流")
                            ),
                            createElement("a", { className: "glass-button-ghost rounded-full px-4 py-2 text-primary font-label-sm active:scale-95", href: "/search" }, "发现作者")
                        )
                    ),
                    ...items.map(renderFollowFeedCard)
                )
            )
        )
    );
}

function getFollowingStateView(status: Exclude<FollowFeedState["status"], "ready">) {
    if (status === "auth-required") {
        return {
            state: "auth-required" as const,
            description: "登录后才能查看关注流。",
            actionHref: `/login?next=${encodeURIComponent("/following")}`,
            actionLabel: "去登录"
        };
    }

    if (status === "loading") {
        return {
            state: "loading" as const,
            title: "正在加载关注流",
            description: "正在获取你关注作者的新内容。"
        };
    }

    if (status === "empty") {
        return {
            state: "empty" as const,
            title: "关注一些作者后，这里会出现他们的新内容",
            description: "去搜索页发现值得关注的创作者。",
            actionHref: "/search",
            actionLabel: "去搜索"
        };
    }

    return {
        state: "error" as const,
        title: "关注流加载失败",
        description: "请稍后重试。"
    };
}

function renderFollowFeedCard(item: FollowFeedItem) {
    const contentId = String(item.content_id);
    const authorId = String(item.author_id);

    return createElement("article", {
        className: "glass-panel hover-lift shine-effect rounded-3xl p-5 md:p-6",
        key: contentId
    },
        createElement("div", { className: "relative z-20 flex min-w-0 items-start gap-3" },
            item.author_avatar
                ? createElement("img", {
                    alt: item.author_name,
                    className: "h-11 w-11 shrink-0 rounded-full border border-white object-cover shadow-sm",
                    src: item.author_avatar
                })
                : createElement("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white font-headline-md shadow-sm" },
                    getAvatarFallback(item.author_name)
                ),
            createElement("div", { className: "min-w-0 flex-1" },
                createElement("div", { className: "flex min-w-0 flex-wrap items-center gap-2" },
                    createElement("a", { className: "truncate font-headline-md text-[15px] text-on-surface hover:text-primary", href: `/user/${authorId}` }, item.author_name),
                    createElement("span", { className: "font-meta-xs text-on-surface-variant" }, "·"),
                    createElement("span", { className: "font-meta-xs text-on-surface-variant" }, formatPublishedAt(item.published_at))
                ),
                createElement("a", { className: "mt-3 block", href: `/content/${contentId}` },
                    createElement("h2", { className: "break-words font-display text-[22px] font-bold leading-tight text-on-surface md:text-[26px]" }, item.title),
                    item.description
                        ? createElement("p", { className: "mt-3 break-words text-[15px] leading-7 text-on-surface-variant" }, item.description)
                        : null
                ),
                item.cover_url
                    ? createElement("a", { href: `/content/${contentId}` },
                        createElement("img", {
                            alt: "",
                            className: "mt-4 aspect-[16/9] w-full rounded-2xl border border-white/45 object-cover shadow-sm",
                            src: item.cover_url
                        })
                    )
                    : null,
                createElement("div", { className: "mt-5 flex flex-wrap items-center gap-3" },
                    createElement("button", {
                        className: `glass-button-ghost rounded-full px-4 py-2 flex items-center gap-2 font-label-sm active:scale-95 transition-all duration-300 ${item.is_liked ? "text-error" : "text-on-surface-variant"}`,
                        "data-content-id": contentId,
                        "data-content-user-id": authorId,
                        type: "button"
                    },
                        createElement("span", { className: "material-symbols-outlined text-[18px]" }, "favorite"),
                        createElement("span", null, formatCount(item.like_count))
                    ),
                    createElement("button", {
                        className: `glass-button-ghost rounded-full px-4 py-2 flex items-center gap-2 font-label-sm active:scale-95 transition-all duration-300 ${item.is_favorited ? "text-primary" : "text-on-surface-variant"}`,
                        "data-content-id": contentId,
                        type: "button"
                    },
                        createElement("span", { className: "material-symbols-outlined text-[18px]" }, "bookmark"),
                        createElement("span", null, item.is_favorited ? "已保存" : "收藏")
                    ),
                    createElement("a", {
                        className: "glass-button-ghost rounded-full px-4 py-2 flex items-center gap-2 font-label-sm text-on-surface-variant active:scale-95 transition-all duration-300",
                        href: `/content/${contentId}`
                    },
                        createElement("span", { className: "material-symbols-outlined text-[18px]" }, "chat_bubble"),
                        createElement("span", null, formatCount(item.comment_count))
                    )
                )
            )
        )
    );
}

function formatPublishedAt(publishedAt?: number) {
    if (!publishedAt) {
        return "刚刚";
    }

    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date(publishedAt * 1000));
}

function formatCount(count?: number) {
    return String(count ?? 0);
}

function getAvatarFallback(authorName: string) {
    return authorName.trim().charAt(0).toUpperCase() || "Z";
}
