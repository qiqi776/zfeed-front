import { createElement, useEffect, useState } from "react";
import { PageShell } from "../runtime/PageShell";
import { getMe } from "../runtime/apiClient";
import { clearAuthSession, readAuthSession, saveAuthSession } from "../runtime/authStore";
import type { AuthSession } from "../runtime/authStore";
import { navigateTo } from "../runtime/navigation";
import { sharedGlassBodyClass, sharedGlassStyles } from "./sharedGlassStyles";

const restoreTimeoutMs = 5_000;

export function AuthGatewayPage() {
    const [sessionToRestore] = useState<AuthSession | null>(() => readAuthSession());
    const isRestoring = sessionToRestore !== null;

    useEffect(() => {
        if (!sessionToRestore) {
            return;
        }

        let isActive = true;
        const restoreTimer = window.setTimeout(() => {
            if (!isActive) {
                return;
            }

            isActive = false;
            clearAuthSession();
            navigateTo("/home");
        }, restoreTimeoutMs);

        getMe<{
            user_info: {
                user_id: number;
                nickname: string;
                avatar: string;
            };
        }>()
            .then((response) => {
                if (!isActive) {
                    return;
                }

                saveAuthSession({
                    ...sessionToRestore,
                    user: {
                        userId: response.user_info.user_id,
                        nickname: response.user_info.nickname,
                        avatar: response.user_info.avatar
                    }
                });
                window.clearTimeout(restoreTimer);
                isActive = false;
                navigateTo("/home");
            })
            .catch(() => {
                if (!isActive) {
                    return;
                }

                window.clearTimeout(restoreTimer);
                isActive = false;
                clearAuthSession();
                navigateTo("/home");
            });

        return () => {
            isActive = false;
            window.clearTimeout(restoreTimer);
        };
    }, [sessionToRestore]);

    return createElement(
        PageShell,
        {
            title: "zfeed - 登录或注册",
            htmlClass: "light",
            bodyClass: sharedGlassBodyClass,
            styles: sharedGlassStyles
        },
        createElement("div", { className: "page-root auth-gateway-root" },
            createElement("div", {
                "aria-hidden": "true",
                className: "auth-home-backdrop",
                title: "zfeed 首页雾化背景"
            },
                createElement("div", { className: "auth-home-shell" },
                    createElement("div", { className: "auth-home-topbar" },
                        createElement("div", { className: "auth-logo-dot" }),
                        createElement("div", { className: "auth-home-wordmark" }, "zfeed"),
                        createElement("div", { className: "auth-home-search" }),
                        createElement("div", { className: "auth-home-icon" }),
                        createElement("div", { className: "auth-home-icon" })
                    ),
                    createElement("div", { className: "auth-home-grid" },
                        createElement("div", { className: "auth-home-left" },
                            renderBackdropLine("w-24"),
                            renderBackdropLine("w-32"),
                            renderBackdropLine("w-28"),
                            renderBackdropLine("w-36")
                        ),
                        createElement("div", { className: "auth-home-feed" },
                            renderBackdropComposer(),
                            renderBackdropCard("Jax Lee", "用 AI 构建产品：30 天从 0 到 1", "w-5/6"),
                            renderBackdropCard("Lin Xia", "创作工具的未来：AI 成为协作副驾", "w-3/4")
                        ),
                        createElement("div", { className: "auth-home-right" },
                            renderBackdropLine("w-32"),
                            renderBackdropLine("w-28"),
                            renderBackdropLine("w-36"),
                            renderBackdropLine("w-24")
                        )
                    )
                )
            ),
            createElement("main", {
                className:
                    "relative z-10 flex min-h-screen items-end justify-center px-4 py-4 md:items-center md:px-6 md:py-8"
            },
                createElement("section", {
                    className:
                        "auth-sheet feed-transition feed-ready w-full max-w-[460px] overflow-hidden rounded-t-[28px] rounded-b-none p-6 md:rounded-[28px] md:p-8"
                },
                    createElement("div", { className: "flex items-center gap-3" },
                        createElement("div", {
                            className:
                                "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-container to-primary text-white shadow-md"
                        }, "z"),
                        createElement("div", null,
                            createElement("div", { className: "font-display text-[26px] leading-none text-on-surface" }, "zfeed"),
                            createElement("div", { className: "mt-1 font-meta-xs text-on-surface-variant" }, "继续浏览、关注和发布")
                        )
                    ),
                    createElement("div", { className: "mt-7" },
                        createElement("h1", {
                            className: "font-display text-[34px] leading-tight text-on-surface md:text-[38px]"
                        }, isRestoring ? "正在恢复 zfeed 会话" : "登录或注册 zfeed"),
                        createElement("p", {
                            className: "mt-3 text-[15px] leading-7 text-on-surface-variant"
                        }, isRestoring ? "如果登录状态失效，会自动进入游客首页。" : "首页已经准备好，登录后继续你的信息流；也可以先以游客身份浏览公开内容。")
                    ),
                    createElement("div", { className: "mt-7 grid gap-3 sm:grid-cols-2" },
                        createElement("a", {
                            className:
                                "glass-button-primary inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-white font-label-sm",
                            href: "/login"
                        }, "登录"),
                        createElement("a", {
                            className:
                                "glass-button-ghost inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-primary font-label-sm",
                            href: "/register"
                        }, "注册")
                    ),
                    createElement("a", {
                        className:
                            "mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 py-2.5 text-primary font-label-sm hover:bg-white/30",
                        href: "/home"
                    }, "先浏览首页")
                )
            )
        )
    );
}

function renderBackdropLine(widthClass: string) {
    return createElement("div", { className: `h-9 rounded-2xl bg-white/45 ${widthClass}` });
}

function renderBackdropComposer() {
    return createElement("div", { className: "auth-backdrop-card" },
        createElement("div", { className: "flex items-center gap-3" },
            createElement("div", { className: "h-10 w-10 rounded-full bg-white/55" }),
            createElement("div", { className: "h-11 flex-1 rounded-2xl bg-white/50" })
        ),
        createElement("div", { className: "mt-5 grid grid-cols-4 gap-3" },
            createElement("div", { className: "h-14 rounded-2xl bg-white/45" }),
            createElement("div", { className: "h-14 rounded-2xl bg-white/42" }),
            createElement("div", { className: "h-14 rounded-2xl bg-white/40" }),
            createElement("div", { className: "h-14 rounded-2xl bg-white/38" })
        )
    );
}

function renderBackdropCard(author: string, title: string, widthClass: string) {
    return createElement("article", { className: "auth-backdrop-card" },
        createElement("div", { className: "flex items-center gap-3" },
            createElement("div", { className: "h-10 w-10 rounded-full bg-white/55" }),
            createElement("div", null,
                createElement("div", { className: "font-label-sm text-on-surface" }, author),
                createElement("div", { className: "mt-1 h-3 w-20 rounded-full bg-white/45" })
            )
        ),
        createElement("div", { className: "mt-5 font-title text-[18px] leading-7 text-on-surface" }, title),
        createElement("div", { className: `mt-4 h-3 rounded-full bg-white/55 ${widthClass}` }),
        createElement("div", { className: "mt-3 h-3 w-2/3 rounded-full bg-white/45" }),
        createElement("div", { className: "mt-5 h-36 rounded-[24px] bg-white/42" })
    );
}
