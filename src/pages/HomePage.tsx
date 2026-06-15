import { createElement, useEffect, useState } from "react";
import { getRecommendFeed } from "../runtime/apiClient";
import { PageShell } from "../runtime/PageShell";
import { PageState } from "./PageState";
import { sharedGlassBodyClass, sharedGlassStyles } from "./sharedGlassStyles";

type RecommendFeedItem = {
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

type RecommendFeedResponse = {
    items?: RecommendFeedItem[];
    snapshot_id?: string;
};

type RecommendFeedState =
    | { status: "loading" }
    | { status: "ready"; items: RecommendFeedItem[]; snapshotId?: string }
    | { status: "empty" }
    | { status: "error" };

const recommendFeedPageSize = 20;

const homeStyles = `${sharedGlassStyles}
.search-shell {
    border-radius: 9999px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-out;
}

.search-shell:hover,
.search-shell:focus-within {
    transform: translateY(-2px);
    filter: drop-shadow(0 10px 22px rgba(31, 83, 201, 0.14));
}

.composer-shell {
    position: relative;
    flex: 1;
    overflow: hidden;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.34);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.62);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.72), 0 4px 16px rgba(0, 0, 0, 0.035);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out;
}

.composer-shell:hover,
.composer-shell:focus-within {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.58);
    border-color: rgba(255, 255, 255, 0.9);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 10px 28px rgba(31, 83, 201, 0.12);
}

.top-channel {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 9999px;
    color: #434654;
    font-weight: 600;
    transition: transform 0.25s ease, color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.top-channel:hover,
.top-channel.active {
    transform: translateY(-2px);
    color: #1f53c9;
    background: rgba(255, 255, 255, 0.62);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(31, 83, 201, 0.1);
}

.nav-link-hover {
    transition: all 0.2s ease-out;
}

.nav-link-hover:hover {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 0.75rem;
}

.article-anchor {
    color: inherit;
    text-decoration: none;
}
`;

export function HomePage() {
    const [state, setState] = useState<RecommendFeedState>({ status: "loading" });

    useEffect(() => {
        let isCurrent = true;

        getRecommendFeed<RecommendFeedResponse>({ cursor: "", page_size: recommendFeedPageSize })
            .then((response) => {
                if (!isCurrent) {
                    return;
                }

                const items = response.items ?? [];
                setState(items.length > 0
                    ? { status: "ready", items, snapshotId: response.snapshot_id }
                    : { status: "empty" });
            })
            .catch(() => {
                if (isCurrent) {
                    setState({ status: "error" });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    return createElement(
        PageShell,
        { title: "zfeed - 推荐信息流", htmlClass: "light", bodyClass: sharedGlassBodyClass, styles: homeStyles },
        createElement("div", { className: "page-root" },
            renderHomeHeader(),
            createElement("div", { className: "pt-24 px-4 md:px-6 max-w-[1600px] mx-auto pb-safe" },
                createElement("div", { className: "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5" },
                    renderLeftRail(),
                    createElement("main", { className: "feed-transition col-span-4 md:col-span-8 lg:col-span-7 flex flex-col gap-6 pb-24 feed-ready" },
                        renderComposer(),
                        renderRecommendState(state)
                    ),
                    renderRightRail(state)
                )
            )
        )
    );
}

function renderHomeHeader() {
    return createElement("header", { className: "fixed top-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-[50px] border-b border-white/20 saturate-[180%] shadow-sm border-white/30 shadow-md" },
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
            createElement("a", { className: "top-channel active text-label-sm tracking-wide", href: "/home" }, "推荐"),
            createElement("a", { className: "top-channel text-label-sm tracking-wide", href: "/following" }, "关注"),
            createElement("a", { className: "top-channel text-label-sm tracking-wide", href: "/home" }, "趋势"),
            createElement("a", { className: "top-channel text-label-sm tracking-wide", href: "/home" }, "最新")
        ),
        createElement("div", { className: "flex items-center gap-5 pr-2 md:pr-12" },
            createElement("button", { className: "hidden sm:flex glass-button-primary text-white font-label-sm py-2 rounded-full items-center gap-2 active:scale-95 px-6", type: "button" },
                createElement("span", { className: "material-symbols-outlined text-[18px]" }, "add"),
                "发布"
            ),
            createElement("a", { "aria-label": "进入我的主页", href: "/me" },
                createElement("div", { className: "w-8 h-8 rounded-full border-2 border-white bg-white/55 shadow-sm" })
            )
        )
    );
}

function renderLeftRail() {
    return createElement("aside", { className: "hidden lg:block lg:col-span-2 relative" },
        createElement("div", { className: "sticky top-24 w-full flex flex-col gap-8" },
            createElement("nav", { className: "flex flex-col gap-1" },
                renderRailLink("/home", "home", "推荐", true),
                renderRailLink("/following", "person_add", "关注"),
                renderRailLink("/search", "search", "搜索"),
                renderRailLink("/settings", "settings", "设置")
            ),
            createElement("div", { className: "flex flex-col gap-2" },
                createElement("span", { className: "font-meta-xs text-on-surface-variant/70 uppercase tracking-wider px-3 mb-1" }, "频道"),
                createElement("a", { className: "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", href: "/search?q=AI" },
                    createElement("div", { className: "w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-label-sm" }, "A"),
                    createElement("span", { className: "font-body-md text-[13px]" }, "AI 与机器学习")
                ),
                createElement("a", { className: "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", href: "/search?q=设计" },
                    createElement("div", { className: "w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 font-label-sm" }, "D"),
                    createElement("span", { className: "font-body-md text-[13px]" }, "设计与灵感")
                )
            )
        )
    );
}

function renderRailLink(href: string, icon: string, label: string, active = false) {
    return createElement("a", {
        className: active
            ? "flex items-center gap-3 bg-white/60 dark:bg-black/60 text-primary font-bold rounded-lg p-2 shadow-sm ring-1 ring-inset ring-white/40 active:scale-95 transition-all duration-300 ease-out"
            : "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95",
        href
    },
        createElement("span", { className: "material-symbols-outlined" }, icon),
        createElement("span", { className: "font-label-sm text-[13px]" }, label)
    );
}

function renderComposer() {
    return createElement("div", { className: "glass-panel rounded-2xl p-5 hover-lift shine-effect" },
        createElement("div", { className: "flex gap-4 items-start mb-4" },
            createElement("div", { className: "w-10 h-10 rounded-full border border-white bg-white/55 shadow-sm" }),
            createElement("div", { className: "composer-shell" },
                createElement("input", { className: "w-full min-h-11 bg-transparent border-none text-body-lg focus:ring-0 placeholder:text-on-surface-variant/60 transition-all duration-300", placeholder: "分享你的想法、灵感或最新动态...", type: "text" })
            )
        ),
        createElement("div", { className: "flex items-center justify-between mt-2 pt-4 border-t border-white/30" },
            createElement("div", { className: "flex flex-wrap gap-2" },
                renderComposerButton("article", "文字", "text-primary"),
                renderComposerButton("image", "图片", "text-emerald-600"),
                renderComposerButton("link", "链接", "text-on-surface-variant"),
                renderComposerButton("play_circle", "视频", "text-purple-600")
            )
        )
    );
}

function renderComposerButton(icon: string, label: string, colorClass: string) {
    return createElement("button", { className: `glass-button-ghost rounded-full px-4 py-2 flex items-center gap-2 ${colorClass} font-label-sm active:scale-95`, type: "button" },
        createElement("span", { className: "material-symbols-outlined text-[18px]" }, icon),
        label
    );
}

function renderRecommendState(state: RecommendFeedState) {
    if (state.status === "loading") {
        return createElement(PageState, {
            state: "loading",
            title: "正在加载推荐流",
            description: "正在获取最新推荐内容。"
        });
    }

    if (state.status === "empty") {
        return createElement(PageState, {
            state: "empty",
            title: "暂时没有内容",
            description: "稍后刷新，或去搜索页看看大家正在讨论什么。",
            actionHref: "/search",
            actionLabel: "去搜索"
        });
    }

    if (state.status === "error") {
        return createElement(PageState, {
            state: "error",
            title: "推荐流加载失败",
            description: "请稍后重试。"
        });
    }

    return createElement("div", { className: "flex flex-col gap-6", "data-snapshot-id": state.snapshotId ?? "" },
        ...state.items.map(renderFeedCard)
    );
}

function renderFeedCard(item: RecommendFeedItem) {
    const contentId = String(item.content_id);
    const authorId = String(item.author_id);

    return createElement("article", { className: "glass-panel rounded-3xl p-6 hover:bg-white/50 hover-lift shine-effect", key: contentId },
        createElement("div", { className: "relative z-20 flex items-center justify-between mb-4" },
            createElement("div", { className: "flex min-w-0 items-center gap-3" },
                item.author_avatar
                    ? createElement("img", { alt: item.author_name, className: "w-10 h-10 rounded-full border border-white shadow-sm object-cover", src: item.author_avatar })
                    : createElement("div", { className: "flex w-10 h-10 rounded-full border border-white bg-primary text-white items-center justify-center font-headline-md shadow-sm" }, getAvatarFallback(item.author_name)),
                createElement("div", { className: "min-w-0" },
                    createElement("a", { className: "block truncate font-headline-md text-[16px] hover:text-primary transition-colors", href: `/user/${authorId}` }, item.author_name),
                    createElement("div", { className: "text-meta-xs text-on-surface-variant flex items-center gap-2" },
                        createElement("span", null, formatPublishedAt(item.published_at))
                    )
                )
            ),
            createElement("button", { className: "text-on-surface-variant hover:bg-white/50 hover:text-primary active:scale-95 p-2 rounded-full transition-all duration-300 ease-out", type: "button" },
                createElement("span", { className: "material-symbols-outlined" }, "more_horiz")
            )
        ),
        createElement("a", { className: "article-anchor", href: `/content/${contentId}` },
            createElement("h2", { className: "break-words font-headline-md text-on-surface mb-2 relative z-20 hover:text-primary transition-colors cursor-pointer" }, item.title),
            item.description
                ? createElement("p", { className: "break-words font-body-md text-on-surface-variant mb-4 line-clamp-3 relative z-20" }, item.description)
                : null
        ),
        item.cover_url
            ? createElement("a", { href: `/content/${contentId}` },
                createElement("img", { alt: "", className: "relative z-20 mt-4 aspect-[16/9] w-full rounded-2xl border border-white/45 object-cover shadow-sm", src: item.cover_url })
            )
            : null,
        createElement("div", { className: "mt-5 flex flex-wrap items-center gap-4 relative z-20" },
            createElement("button", {
                "aria-label": item.is_liked ? "取消点赞" : "点赞",
                className: `flex items-center gap-1 ${item.is_liked ? "text-error" : "text-on-surface-variant"} hover:text-error active:scale-95 transition-colors`,
                "data-content-id": contentId,
                "data-content-user-id": authorId,
                type: "button"
            },
                createElement("span", { className: "material-symbols-outlined text-[20px]" }, "favorite"),
                createElement("span", { className: "font-meta-xs" }, formatCount(item.like_count))
            ),
            createElement("button", {
                "aria-label": item.is_favorited ? "取消收藏" : "收藏",
                className: `flex items-center gap-1 ${item.is_favorited ? "text-primary" : "text-on-surface-variant"} hover:text-primary active:scale-95 transition-colors`,
                "data-content-id": contentId,
                type: "button"
            },
                createElement("span", { className: "material-symbols-outlined text-[20px]" }, "bookmark"),
                createElement("span", { className: "font-meta-xs" }, item.is_favorited ? "已保存" : "收藏")
            ),
            createElement("a", { className: "flex items-center gap-1 text-on-surface-variant hover:text-primary active:scale-95 transition-colors", href: `/content/${contentId}` },
                createElement("span", { className: "material-symbols-outlined text-[20px]" }, "chat_bubble"),
                createElement("span", { className: "font-meta-xs" }, formatCount(item.comment_count))
            )
        )
    );
}

function renderRightRail(state: RecommendFeedState) {
    const count = state.status === "ready" ? state.items.length : 0;

    return createElement("aside", { className: "hidden lg:block lg:col-span-3 relative" },
        createElement("div", { className: "sticky top-24 flex flex-col gap-5" },
            createElement("div", { className: "glass-panel rounded-3xl p-5 hover-lift shine-effect" },
                createElement("h3", { className: "font-headline-md text-[16px] text-on-surface mb-3" }, "今日数据"),
                createElement("div", { className: "grid grid-cols-3 gap-3 text-center" },
                    renderMetric("推荐", String(count)),
                    renderMetric("趋势", "12"),
                    renderMetric("作者", "3")
                )
            ),
            createElement("div", { className: "glass-panel rounded-3xl p-5 hover-lift shine-effect" },
                createElement("h3", { className: "font-headline-md text-[16px] text-on-surface mb-4" }, "为你推荐"),
                createElement("div", { className: "flex flex-col gap-3" },
                    renderSuggestedUser("2001", "Zhang Xiaolong", "产品经理"),
                    renderSuggestedUser("2002", "Chen Zhiyuan", "界面设计师"),
                    renderSuggestedUser("2003", "AI 前线", "科技媒体")
                )
            )
        )
    );
}

function renderMetric(label: string, value: string) {
    return createElement("div", { className: "rounded-2xl bg-white/35 px-3 py-3" },
        createElement("div", { className: "font-display text-[20px] font-bold text-on-surface" }, value),
        createElement("div", { className: "font-meta-xs text-on-surface-variant" }, label)
    );
}

function renderSuggestedUser(userId: string, name: string, role: string) {
    return createElement("div", { className: "flex items-center justify-between gap-3" },
        createElement("div", { className: "min-w-0" },
            createElement("div", { className: "truncate font-headline-md text-[14px]" }, name),
            createElement("div", { className: "font-meta-xs text-on-surface-variant" }, role)
        ),
        createElement("button", {
            className: "glass-button-ghost px-4 py-1.5 rounded-full font-label-sm text-primary border-primary/20 hover:border-primary active:scale-95 transition-all duration-300",
            "data-user-id": userId,
            type: "button"
        }, "关注")
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
