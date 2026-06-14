import { createElement } from "react";
import { PageShell } from "../runtime/PageShell";
import { sharedGlassBodyClass, sharedGlassStyles } from "./sharedGlassStyles";

export function RegisterPage() {
    return createElement(
        PageShell,
        {
            title: "zfeed - 注册",
            htmlClass: "light",
            bodyClass: sharedGlassBodyClass,
            styles: sharedGlassStyles
        },
        createElement("div", { className: "page-root" },
            createElement("main", {
                className: "min-h-screen px-4 py-4 md:px-6 md:py-8 flex items-end md:items-center justify-center"
            },
                createElement("section", {
                    className:
                        "auth-sheet w-full max-w-[460px] min-h-[calc(100dvh-2rem)] overflow-hidden rounded-t-[28px] rounded-b-none md:min-h-0 md:rounded-[28px] p-6 md:p-8"
                },
                    createElement("div", { className: "flex items-center justify-between gap-4" },
                        createElement("a", {
                            className: "flex items-center gap-3",
                            href: "/"
                        },
                            createElement("div", {
                                className:
                                    "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-container to-primary text-white shadow-md"
                            }, "z"),
                            createElement("div", null,
                                createElement("div", { className: "font-display text-[24px] leading-none text-on-surface" }, "zfeed"),
                                createElement("div", { className: "mt-1 font-meta-xs text-on-surface-variant" }, "创建账号")
                            )
                        ),
                        createElement("a", {
                            className:
                                "glass-button-ghost inline-flex min-h-11 items-center rounded-full px-4 py-2.5 text-primary font-label-sm",
                            href: "/login"
                        }, "登录")
                    ),
                    createElement("div", { className: "mt-6" },
                        createElement("h1", {
                            className: "font-display text-[34px] leading-tight text-on-surface"
                        }, "创建 zfeed 账号"),
                        createElement("p", {
                            className: "mt-2 text-[15px] leading-7 text-on-surface-variant"
                        }, "注册后就能继续浏览、关注和发布。")
                    ),
                    createElement("form", { className: "mt-6 grid gap-4" },
                        renderField("手机号", "phone", "tel", "请输入手机号", "tel"),
                        renderField("密码", "password", "password", "请输入密码", "new-password"),
                        renderField("昵称", "nickname", "text", "可选"),
                        renderField("头像 URL", "avatarUrl", "url", "可选"),
                        renderField("邮箱", "email", "email", "可选", "email"),
                        createElement("label", { className: "flex flex-col gap-2" },
                            createElement("span", { className: "auth-label" }, "简介"),
                            createElement("textarea", {
                                className:
                                    "auth-field min-h-28 resize-none rounded-2xl px-4 py-3 text-[15px] text-on-surface",
                                id: "bio",
                                name: "bio",
                                placeholder: "可选",
                                rows: 4
                            })
                        ),
                        createElement("div", { className: "flex items-center justify-between gap-3 pt-1" },
                            createElement("a", {
                                className: "text-label-sm text-primary",
                                href: "/home"
                            }, "先浏览内容"),
                            createElement("button", {
                                className:
                                    "glass-button-primary inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-5 py-3 text-white font-label-sm",
                                type: "button"
                            }, "注册")
                        )
                    ),
                    createElement("div", { className: "mt-6 border-t border-white/30 pt-4" },
                        createElement("a", {
                            className:
                                "glass-button-ghost inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 py-2.5 text-primary font-label-sm",
                            href: "/login"
                        }, "去登录")
                    )
                )
            )
        )
    );
}

function renderField(
    label: string,
    id: string,
    type: string,
    placeholder: string,
    autoComplete?: string
) {
    return createElement("label", { className: "flex flex-col gap-2" },
        createElement("span", { className: "auth-label" }, label),
        createElement("input", {
            className: "auth-field rounded-2xl px-4 py-3 text-[15px] text-on-surface",
            id,
            name: id,
            placeholder,
            type,
            autoComplete,
            inputMode: type === "tel" ? "tel" : undefined
        })
    );
}
