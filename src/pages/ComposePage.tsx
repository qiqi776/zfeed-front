import { createElement } from "react";
import { PageShell } from "../runtime/PageShell";
import { readAuthSession } from "../runtime/authStore";
import { sharedGlassBodyClass, sharedGlassStyles } from "./sharedGlassStyles";

export function ComposePage() {
    const session = readAuthSession();

    return createElement(
        PageShell,
        {
            title: "zfeed - 发布",
            htmlClass: "light",
            bodyClass: sharedGlassBodyClass,
            styles: sharedGlassStyles
        },
        createElement("div", { className: "page-root" },
            createElement("main", { className: "min-h-screen px-4 py-6 md:px-6 md:py-10" },
                createElement("section", { className: "auth-sheet feed-transition feed-ready mx-auto w-full max-w-3xl rounded-[28px] p-6 md:p-8" },
                    createElement("a", { className: "text-label-sm text-primary", href: "/home" }, "返回首页"),
                    createElement("h1", { className: "mt-5 font-display text-[34px] leading-tight text-on-surface" }, "发布"),
                    session
                        ? createElement("div", { className: "mt-6 grid gap-4", "data-compose-form": "true" },
                            createElement("input", {
                                className: "auth-field rounded-2xl px-4 py-3 text-[15px] text-on-surface",
                                maxLength: 80,
                                name: "title",
                                placeholder: "标题",
                                type: "text"
                            }),
                            createElement("textarea", {
                                className: "auth-field min-h-56 resize-none rounded-2xl px-4 py-3 text-[15px] text-on-surface",
                                maxLength: 5000,
                                name: "content",
                                placeholder: "写下你的想法...",
                                rows: 10
                            }),
                            createElement("button", {
                                className: "glass-button-primary inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-white font-label-sm",
                                type: "button"
                            }, "发布")
                        )
                        : createElement("div", { className: "mt-6 rounded-2xl border border-white/40 bg-white/35 px-4 py-4 text-[14px] leading-7 text-on-surface-variant" },
                            "发布需要登录。",
                            createElement("a", { className: "ml-2 text-primary font-label-sm", href: "/login" }, "去登录")
                        )
                )
            )
        )
    );
}
