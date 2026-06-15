import { createElement, useEffect, useState } from "react";
import { searchContents, searchUsers } from "../runtime/apiClient";
import { PageShell } from "../runtime/PageShell";
import { PageState } from "./PageState";
import { sharedGlassBodyClass, sharedGlassStyles } from "./sharedGlassStyles";

type SearchContentItem = {
    content_id: number;
    content_type: number;
    author_id: number;
    author_name: string;
    author_avatar: string;
    title: string;
    cover_url: string;
    published_at: number;
};

type SearchUserItem = {
    user_id: number;
    nickname: string;
    avatar: string;
    bio: string;
    is_following: boolean;
};

type SearchContentsResponse = {
    items: SearchContentItem[];
};

type SearchUsersResponse = {
    items: SearchUserItem[];
};

type SearchViewState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "invalid" }
    | { status: "error" }
    | { status: "ready"; contents: SearchContentItem[]; users: SearchUserItem[] };

const maxSearchQueryLength = 50;
const searchPageSize = 10;

export function SearchPage() {
    const query = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    const [viewState, setViewState] = useState<SearchViewState>(() => getInitialSearchState(query));

    useEffect(() => {
        if (!query || query.length > maxSearchQueryLength) {
            return;
        }

        let isCurrent = true;

        Promise.all([
            searchContents<SearchContentsResponse>({ query, page_size: searchPageSize, mode: "hybrid" }),
            searchUsers<SearchUsersResponse>({ query, page_size: searchPageSize, mode: "hybrid" })
        ]).then(([contentResults, userResults]) => {
            if (!isCurrent) {
                return;
            }

            setViewState({
                status: "ready",
                contents: contentResults.items ?? [],
                users: userResults.items ?? []
            });
        }).catch(() => {
            if (isCurrent) {
                setViewState({ status: "error" });
            }
        });

        return () => {
            isCurrent = false;
        };
    }, [query]);

    return createElement(
        PageShell,
        {
            title: "zfeed - 搜索",
            htmlClass: "light",
            bodyClass: sharedGlassBodyClass,
            styles: sharedGlassStyles
        },
        createElement("div", { className: "page-root" },
            createElement("main", { className: "min-h-screen px-4 py-6 md:px-6 md:py-10" },
                createElement("section", { className: "auth-sheet feed-transition feed-ready mx-auto w-full max-w-3xl rounded-[28px] p-6 md:p-8" },
                    createElement("a", { className: "text-label-sm text-primary", href: "/home" }, "返回首页"),
                    createElement("h1", { className: "mt-5 font-display text-[34px] leading-tight text-on-surface" }, "搜索"),
                    createElement("label", { className: "mt-6 flex flex-col gap-2" },
                        createElement("span", { className: "auth-label" }, "关键词"),
                        createElement("input", {
                            autoFocus: true,
                            className: "auth-field min-h-14 rounded-full px-5 text-[16px] text-on-surface",
                            defaultValue: query,
                            maxLength: 50,
                            placeholder: "搜索内容、创作者或话题",
                            type: "search"
                        })
                    ),
                    renderSearchState(query, viewState)
                )
            )
        )
    );
}

function getInitialSearchState(query: string): SearchViewState {
    if (!query) {
        return { status: "idle" };
    }

    if (query.length > maxSearchQueryLength) {
        return { status: "invalid" };
    }

    return { status: "loading" };
}

function renderSearchState(query: string, viewState: SearchViewState) {
    if (!query) {
        return createElement(PageState, {
            state: "empty",
            title: "输入关键词开始搜索",
            description: "支持搜索内容、创作者或话题。",
            className: "mt-6 rounded-2xl border border-white/40 bg-white/35 px-4 py-4"
        });
    }

    if (viewState.status === "invalid") {
        return createElement(PageState, {
            state: "error",
            title: "关键词最多 50 字",
            description: "请缩短关键词后重试。",
            className: "mt-6 rounded-2xl border border-white/40 bg-white/35 px-4 py-4"
        });
    }

    if (viewState.status === "loading") {
        return createElement(PageState, {
            state: "loading",
            title: "正在搜索",
            description: "正在检索内容和创作者。",
            className: "mt-6 rounded-2xl border border-white/40 bg-white/35 px-4 py-4"
        });
    }

    if (viewState.status === "error") {
        return createElement(PageState, {
            state: "error",
            title: "搜索失败",
            description: "请稍后重试。",
            className: "mt-6 rounded-2xl border border-white/40 bg-white/35 px-4 py-4"
        });
    }

    if (viewState.status !== "ready") {
        return null;
    }

    if (viewState.contents.length === 0 && viewState.users.length === 0) {
        return createElement(PageState, {
            state: "empty",
            title: "没有找到相关结果",
            description: `换个关键词搜索“${query}”。`,
            className: "mt-6 rounded-2xl border border-white/40 bg-white/35 px-4 py-4"
        });
    }

    return createElement("div", { className: "mt-6 grid gap-5" },
        viewState.contents.length > 0 ? createElement("section", { className: "grid gap-3" },
            createElement("h2", { className: "font-label-sm text-on-surface" }, "内容"),
            ...viewState.contents.map(renderContentResult)
        ) : null,
        viewState.users.length > 0 ? createElement("section", { className: "grid gap-3" },
            createElement("h2", { className: "font-label-sm text-on-surface" }, "创作者"),
            ...viewState.users.map(renderUserResult)
        ) : null
    );
}

function renderContentResult(item: SearchContentItem) {
    return createElement("a", {
        className: "block rounded-2xl border border-white/40 bg-white/35 px-4 py-4 transition hover:bg-white/50",
        href: `/content/${item.content_id}`,
        key: `content-${item.content_id}`
    },
        createElement("div", { className: "flex min-w-0 items-start gap-3" },
            item.cover_url ? createElement("img", {
                alt: "",
                className: "h-16 w-16 flex-none rounded-xl object-cover",
                src: item.cover_url
            }) : null,
            createElement("div", { className: "min-w-0 flex-1" },
                createElement("div", { className: "break-words font-headline-md text-[16px] leading-6 text-on-surface" }, item.title),
                createElement("div", { className: "mt-2 flex min-w-0 flex-wrap items-center gap-2 text-[13px] text-on-surface-variant" },
                    createElement("span", { className: "min-w-0 break-words" }, item.author_name || "未知作者"),
                    createElement("span", null, "·"),
                    createElement("span", null, formatPublishedAt(item.published_at))
                )
            )
        )
    );
}

function renderUserResult(item: SearchUserItem) {
    return createElement("a", {
        className: "block rounded-2xl border border-white/40 bg-white/35 px-4 py-4 transition hover:bg-white/50",
        href: `/user/${item.user_id}`,
        key: `user-${item.user_id}`
    },
        createElement("div", { className: "flex min-w-0 items-center gap-3" },
            item.avatar ? createElement("img", {
                alt: "",
                className: "h-12 w-12 flex-none rounded-full object-cover",
                src: item.avatar
            }) : createElement("div", { className: "h-12 w-12 flex-none rounded-full bg-white/55" }),
            createElement("div", { className: "min-w-0 flex-1" },
                createElement("div", { className: "break-words font-headline-md text-[16px] text-on-surface" }, item.nickname),
                createElement("p", { className: "mt-1 break-words text-[14px] leading-6 text-on-surface-variant" }, item.bio || "这个创作者还没有简介。")
            ),
            createElement("span", { className: "rounded-full bg-white/40 px-3 py-1 text-[12px] text-primary" }, item.is_following ? "已关注" : "查看")
        )
    );
}

function formatPublishedAt(publishedAt: number) {
    if (!publishedAt) {
        return "刚刚";
    }

    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date(publishedAt * 1000));
}
