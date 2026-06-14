import { createElement } from "react";
import { PageShell } from "../runtime/PageShell";
import { sharedGlassBodyClass, sharedGlassStyles } from "./sharedGlassStyles";

export function SearchPage() {
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
                            maxLength: 50,
                            placeholder: "搜索内容、创作者或话题",
                            type: "search"
                        })
                    ),
                    createElement("p", { className: "mt-5 text-[14px] leading-7 text-on-surface-variant" }, "输入关键词后会展示内容和用户结果。")
                )
            )
        )
    );
}
