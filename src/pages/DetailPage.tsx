import { createElement } from "react";
import type { ReactNode } from "react";
import { PageShell } from "../runtime/PageShell";

type PageVariant = {
    title: string;
    htmlClass: string;
    bodyClass: string;
    children: ReactNode;
};

const styles = "/* Liquid Glass Utility Classes */\r\n        .glass-panel {\r\n            background: rgba(255, 255, 255, 0.4);\r\n            backdrop-filter: blur(40px);\r\n            -webkit-backdrop-filter: blur(40px);\r\n            border: 1px solid rgba(255, 255, 255, 0.6);\r\n            border-top: 1px solid rgba(255, 255, 255, 0.8); /* Specular highlight */\r\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), \r\n                        0 4px 20px rgba(0, 0, 0, 0.05);\r\n        }\r\n        \r\n        .glass-input {\r\n            background: rgba(255, 255, 255, 0.5);\r\n            backdrop-filter: blur(20px);\r\n            border: 1px solid rgba(255, 255, 255, 0.7);\r\n            box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n        \r\n        .glass-input:focus {\n            outline: none;\n            border-color: var(--color-primary, #1f53c9);\n            box-shadow: 0 0 0 2px rgba(31, 83, 201, 0.2), inset 0 1px 3px rgba(0,0,0,0.02);\n        }\n\n        .search-shell {\n            border-radius: 9999px;\n            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-out;\n        }\n\n        .search-shell:hover,\n        .search-shell:focus-within {\n            transform: translateY(-2px);\n            filter: drop-shadow(0 10px 22px rgba(31, 83, 201, 0.14));\n        }\n\n        .search-shell .glass-input {\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.75), 0 4px 16px rgba(0, 0, 0, 0.04);\n        }\n\n        .search-shell:hover .glass-input {\n            background: rgba(255, 255, 255, 0.62);\n            border-color: rgba(255, 255, 255, 0.9);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .search-shell:focus-within .glass-input {\n            background: rgba(255, 255, 255, 0.72);\n            border-color: rgba(31, 83, 201, 0.55);\n            box-shadow: 0 0 0 3px rgba(31, 83, 201, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 10px 28px rgba(31, 83, 201, 0.16);\n        }\n\n        .search-shell::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n            z-index: 10;\n        }\n\n        .search-shell:hover::after,\n        .search-shell:focus-within::after {\n            left: 160%;\n        }\n\n        .composer-shell {\n            position: relative;\n            flex: 1;\n            overflow: hidden;\n            border-radius: 1.25rem;\n            background: rgba(255, 255, 255, 0.34);\n            backdrop-filter: blur(18px);\n            -webkit-backdrop-filter: blur(18px);\n            border: 1px solid rgba(255, 255, 255, 0.62);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.72), 0 4px 16px rgba(0, 0, 0, 0.035);\n            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out;\n        }\n\n        .composer-shell:hover,\n        .composer-shell:focus-within {\n            transform: translateY(-2px);\n            background: rgba(255, 255, 255, 0.58);\n            border-color: rgba(255, 255, 255, 0.9);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 10px 28px rgba(31, 83, 201, 0.12);\n        }\n\n        .composer-shell:focus-within {\n            border-color: rgba(31, 83, 201, 0.50);\n            box-shadow: 0 0 0 3px rgba(31, 83, 201, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 12px 30px rgba(31, 83, 201, 0.16);\n        }\n\n        .composer-shell::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n            z-index: 10;\n        }\n\n        .composer-shell:hover::after,\n        .composer-shell:focus-within::after {\n            left: 160%;\n        }\n\n        .composer-shell input {\n            position: relative;\n            z-index: 20;\n            min-height: 44px;\n            padding: 0.65rem 0.95rem;\n        }\n\n        .composer-shell input:focus {\n            outline: none;\n            box-shadow: none;\n        }\n\n        .top-channel {\n            position: relative;\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            overflow: hidden;\n            min-height: 34px;\n            padding: 0 12px;\n            border-radius: 9999px;\n            color: var(--color-on-surface-variant, #434654);\n            font-weight: 600;\n            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease-out, background 0.25s ease-out, box-shadow 0.25s ease-out;\n        }\n\n        .top-channel::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n        }\n\n        .top-channel:hover {\n            transform: translateY(-2px);\n            color: var(--color-primary, #1f53c9);\n            background: rgba(255, 255, 255, 0.62);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .top-channel.active {\n            color: var(--color-primary, #1f53c9);\n            background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(236, 244, 255, 0.62));\n            backdrop-filter: blur(20px) saturate(1.25);\n            -webkit-backdrop-filter: blur(20px) saturate(1.25);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(31, 83, 201, 0.12), 0 10px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .top-channel:hover::after,\n        .top-channel.active::after {\n            left: 160%;\n        }\n\n        .top-channel:active {\n            transform: translateY(-1px) scale(0.97);\n        }\n\n        .top-icon-btn {\n            width: 40px;\n            height: 40px;\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            transform: translateY(2px);\n            background: rgba(255, 255, 255, 0.16);\n            border: 1px solid rgba(255, 255, 255, 0.22);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.45);\n        }\n\n        .top-icon-btn:hover {\n            transform: translateY(0);\n            background: rgba(255, 255, 255, 0.42);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.70), 0 8px 18px rgba(31, 83, 201, 0.10);\n        }\n\n        .glass-button-primary {\n            background: linear-gradient(135deg, rgba(64, 109, 228, 0.9) 0%, rgba(31, 83, 201, 0.9) 100%);\r\n            backdrop-filter: blur(10px);\r\n            box-shadow: 0 4px 15px rgba(31, 83, 201, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);\r\n            border: 1px solid rgba(255, 255, 255, 0.2);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n        \r\n        .glass-button-primary:hover {\r\n            transform: translateY(-1px);\r\n            box-shadow: 0 6px 20px rgba(31, 83, 201, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5);\r\n        }\r\n\r\n        .glass-button-ghost {\r\n            background: rgba(255, 255, 255, 0.3);\r\n            backdrop-filter: blur(10px);\r\n            border: 1px solid rgba(255, 255, 255, 0.6);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n\r\n        .glass-button-ghost:hover {\r\n            background: rgba(255, 255, 255, 0.5);\r\n            border-color: rgba(255, 255, 255, 0.8);\r\n        }\r\n\r\n        /* Hover Lift and Shine Effects */\r\n        .hover-lift {\r\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n        }\r\n        .hover-lift:hover {\r\n            transform: translateY(-4px);\r\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 12px 30px rgba(0, 0, 0, 0.08);\r\n            border-color: rgba(255, 255, 255, 0.9);\r\n        }\r\n\r\n        .shine-effect {\r\n            position: relative;\r\n            overflow: hidden;\r\n        }\r\n        .shine-effect::after {\r\n            content: '';\r\n            position: absolute;\r\n            top: 0;\r\n            left: -150%;\r\n            width: 50%;\r\n            height: 100%;\r\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);\r\n            transform: skewX(-25deg);\r\n            transition: left 0.7s ease;\r\n            z-index: 10;\r\n            pointer-events: none;\r\n        }\r\n        .shine-effect:hover::after {\r\n            left: 200%;\r\n        }\r\n\r\n        /* Ambient Background */\r\n        body {\n            background-color: #eef2f6;\n            background-image: \n                radial-gradient(circle at 15% 50%, rgba(180, 197, 255, 0.4) 0%, transparent 50%),\n                radial-gradient(circle at 85% 30%, rgba(219, 226, 250, 0.5) 0%, transparent 50%);\n            background-attachment: fixed;\n            min-height: 100vh;\n        }\n\n        .feed-transition {\n            opacity: 0;\n            transform: translateY(8px) scale(0.995);\n            filter: blur(8px);\n            transition:\n                opacity 0.28s ease,\n                transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),\n                filter 0.34s ease;\n        }\n\n        .feed-transition.feed-ready {\n            opacity: 1;\n            transform: none;\n            filter: none;\n        }\n\n        .feed-transition.feed-leaving {\n            opacity: 0;\n            transform: translateY(6px) scale(0.996);\n            filter: blur(7px);\n            pointer-events: none;\n        }\n\n        @media (prefers-reduced-motion: reduce) {\n            .feed-transition,\n            .feed-transition.feed-ready,\n            .feed-transition.feed-leaving {\n                opacity: 1;\n                transform: none;\n                filter: none;\n                transition: none;\n            }\n        }\n\n        .chart-glow-line {\n            filter: drop-shadow(0 4px 6px rgba(31, 83, 201, 0.2));\n        }\n\r\n        .nav-link-hover {\r\n            transition: all 0.2s ease-out;\r\n        }\r\n        .nav-link-hover:hover {\n            background: rgba(255, 255, 255, 0.4);\n            border-radius: 0.75rem;\n        }\n\n        .detail-prose p {\n            margin-bottom: 1rem;\n            color: rgba(67, 70, 84, 0.96);\n            font-size: 16px;\n            line-height: 1.82;\n        }\n\n        .detail-prose h2 {\n            margin-top: 1.5rem;\n            margin-bottom: 0.75rem;\n            font-family: \"Hanken Grotesk\", sans-serif;\n            font-size: 22px;\n            line-height: 1.35;\n            font-weight: 700;\n            color: #191c1e;\n        }\n\n        .detail-hero {\n            background:\n                radial-gradient(circle at 20% 22%, rgba(255,255,255,0.72), transparent 28%),\n                radial-gradient(circle at 82% 18%, rgba(180,197,255,0.68), transparent 34%),\n                linear-gradient(135deg, rgba(219,226,250,0.78), rgba(237,250,255,0.76) 48%, rgba(231,223,246,0.66));\n        }\n\n        .detail-video-shell {\n            background:\n                radial-gradient(circle at 24% 18%, rgba(255,255,255,0.42), transparent 30%),\n                linear-gradient(135deg, rgba(31,83,201,0.82), rgba(88,96,128,0.78));\n            box-shadow: inset 0 1px 2px rgba(255,255,255,0.46), 0 20px 48px rgba(31,83,201,0.22);\n        }\n\n        .comment-row {\n            background: rgba(255,255,255,0.28);\n            border: 1px solid rgba(255,255,255,0.42);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.62);\n        }\n\n        .article-anchor {\n            text-decoration: none;\n            color: inherit;\n        }";

const variants: Record<string, PageVariant> = {
    "article": {
        title: "zfeed - 用 AI 构建产品：30 天从 0 到 1",
        htmlClass: "light",
        bodyClass: "text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container",
        children: createElement("div", { "className": "page-root" },
            createElement("header", { "className": "fixed top-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-[50px] border-b border-white/20 saturate-[180%] shadow-sm border-white/30 shadow-md" },
                createElement("div", { "className": "flex items-center gap-4" },
                    createElement("button", { "className": "md:hidden p-2 text-on-surface-variant hover:bg-white/20 active:scale-95 rounded-full transition-all duration-300 ease-out" },
                        createElement("span", { "className": "material-symbols-outlined" },
                            "menu"
                        )
                    ),
                    createElement("div", { "className": "flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 gap-3" },
                        createElement("div", { "className": "w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center shadow-md" },
                            createElement("div", { "className": "w-3 h-3 bg-white rounded-full" })
                        ),
                        createElement("span", { "className": "font-display text-[24px] tracking-tight font-bold text-primary dark:text-primary-fixed" },
                            "zfeed"
                        )
                    ),
                    createElement("div", { "className": "hidden md:flex ml-8 relative w-96 group md:ml-16 search-shell overflow-hidden" },
                        createElement("span", { "className": "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300" },
                            "search"
                        ),
                        createElement("input", { "className": "glass-input w-full pl-10 pr-4 rounded-full font-body-md text-on-surface placeholder:text-on-surface-variant/70 border-white/40 bg-white/30 backdrop-blur-md focus:bg-white/60 transition-colors py-2.5", "placeholder": "搜索内容、创作者或话题", "type": "text" })
                    )
                ),
                createElement("nav", { "className": "hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-5" },
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "/following" },
                        "关注"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "趋势"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "最新"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "AI"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "设计"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "科技"
                    )
                ),
                createElement("div", { "className": "flex items-center gap-5 pr-12" },
                    createElement("button", { "className": "top-icon-btn relative text-on-surface-variant active:scale-95 rounded-full transition-all duration-300 ease-out" },
                        createElement("span", { "className": "material-symbols-outlined" },
                            "notifications"
                        ),
                        createElement("span", { "className": "absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-white" })
                    ),
                    createElement("button", { "className": "top-icon-btn relative text-on-surface-variant active:scale-95 rounded-full transition-all duration-300 ease-out" },
                        createElement("span", { "className": "material-symbols-outlined" },
                            "mail"
                        ),
                        createElement("span", { "className": "absolute top-0 right-0 w-4 h-4 bg-error text-white font-label-sm text-[10px] rounded-full flex items-center justify-center border border-white" },
                            "3"
                        )
                    ),
                    createElement("button", { "className": "hidden sm:flex glass-button-primary text-white font-label-sm py-2 rounded-full items-center gap-2 active:scale-95 px-6" },
                        createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                            "add"
                        ),
                        "\n                发布\n            "
                    ),
                    createElement("a", { "aria-label": "进入我的主页", "href": "/profile?user=me" },
                        createElement("img", { "alt": "用户头像", "className": "w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-out", "data-alt": "A close-up portrait of a young woman with natural makeup, looking directly at the camera, set against a bright, well-lit background. The style is modern, crisp, and high-resolution, fitting a premium digital interface. Soft, even lighting highlights her features.", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" })
                    )
                )
            ),
            createElement("div", { "className": "pt-24 px-4 md:px-6 max-w-[1600px] mx-auto pb-safe" },
                createElement("div", { "className": "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5" },
                    createElement("aside", { "className": "hidden lg:block lg:col-span-2 relative" },
                        createElement("div", { "className": "sticky top-24 w-full flex flex-col gap-8" },
                            createElement("nav", { "className": "flex flex-col gap-1" },
                                createElement("a", { "className": "flex items-center gap-3 bg-white/60 dark:bg-black/60 text-primary font-bold rounded-lg p-2 shadow-sm ring-1 ring-inset ring-white/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined", "style": { "fontVariationSettings": "'FILL' 1" } },
                                        "home"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "推荐"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/following" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "person_add"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "关注"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "trending_up"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "趋势"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "bookmark"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "收藏"
                                    )
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-2" },
                                createElement("span", { "className": "font-meta-xs text-on-surface-variant/70 uppercase tracking-wider px-3 mb-1" },
                                    "频道"
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-label-sm transition-colors duration-300" },
                                        "A"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "AI 与机器学习"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 font-label-sm transition-colors duration-300" },
                                        "D"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "设计与灵感"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 font-label-sm transition-colors duration-300" },
                                        "P"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "产品与增长"
                                    )
                                ),
                                createElement("button", { "className": "flex items-center gap-2 text-on-surface-variant p-2 hover:text-primary hover:bg-white/40 rounded-lg active:scale-95 transition-all duration-300 ease-out text-[13px] font-body-md w-full justify-start mt-2" },
                                    createElement("span", { "className": "material-symbols-outlined text-[16px]" },
                                        "more_horiz"
                                    ),
                                    "\n                            更多频道\n                        "
                                )
                            ),
                            createElement("div", { "className": "mt-auto flex flex-col gap-1 border-t border-white/40 pt-4" },
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-3 nav-link-hover active:scale-95", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "settings"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[14px]" },
                                        "设置"
                                    )
                                )
                            )
                        )
                    ),
                    createElement("main", { "className": "feed-transition col-span-4 md:col-span-8 lg:col-span-7 flex flex-col gap-6 pb-24 feed-ready" },
                        createElement("section", { "className": "glass-panel rounded-3xl p-6 hover-lift shine-effect" },
                            createElement("a", { "className": "inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-5", "href": "/" },
                                createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                    "arrow_back"
                                ),
                                createElement("span", { "className": "font-label-sm" },
                                    "返回 Feed"
                                )
                            ),
                            createElement("div", { "className": "font-label-sm text-primary mb-3" },
                                "独立开发 · 深度复盘"
                            ),
                            createElement("h1", { "className": "font-display text-[38px] leading-tight text-on-surface" },
                                "用 AI 构建产品：30 天从 0 到 1"
                            ),
                            createElement("div", { "className": "flex flex-wrap gap-2 mt-4" },
                                createElement("span", { "className": "px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-label-sm text-[11px] transition-colors duration-300 cursor-pointer" },
                                    "# 独立开发"
                                ),
                                createElement("span", { "className": "px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-label-sm text-[11px] transition-colors duration-300 cursor-pointer" },
                                    "# 产品开发"
                                ),
                                createElement("span", { "className": "px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-label-sm text-[11px] transition-colors duration-300 cursor-pointer" },
                                    "# AI 应用"
                                )
                            ),
                            createElement("div", { "className": "flex items-center justify-between gap-4 mt-6 pt-5 border-t border-white/30" },
                                createElement("a", { "className": "flex items-center gap-3 group article-anchor", "href": "/profile?user=jax" },
                                    createElement("img", { "alt": "Jax Lee", "className": "w-11 h-11 rounded-full border border-white object-cover shadow-sm group-hover:scale-105 transition-transform duration-300", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuBvuOLVnsjO-1iiReceld4efYvN9a7XyG7mE_uVmZnyU5HQUUdi3pGNLEkV_gMctpfyY_uQpW1qggtG_XPtZ4WbDLLbxJwfLbR1mMxf4ScYzWLW4_Vfh6iXFQV12Xem2Mvj1GomjfPyq8QZe3lyDcVFglYAl-739LfayZUdFrHwVt00UvErzKDXUKy7XQVAgBYZ2Rb2qrl60hYui7qSt9fRHkJ3wECmeiMf1wBf5tUoiNvjt7ZIFO357kFzuiy4wKkSMa8GH4srd84" }),
                                    createElement("div", null,
                                        createElement("div", { "className": "font-headline-md text-[16px] group-hover:text-primary transition-colors" },
                                            "Jax Lee"
                                        ),
                                        createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                            "独立开发者 · 2 小时前 · 12 分钟阅读"
                                        )
                                    )
                                ),
                                createElement("button", { "className": "glass-button-primary text-white font-label-sm px-5 py-2.5 rounded-full active:scale-95 transition-all duration-300" },
                                    "关注作者"
                                )
                            )
                        ),
                        createElement("section", { "className": "detail-hero glass-panel rounded-3xl overflow-hidden" },
                            createElement("div", { "className": "relative h-72 overflow-hidden" },
                                createElement("img", { "alt": "文章封面", "className": "absolute inset-0 w-full h-full object-cover opacity-62 mix-blend-overlay", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuA0S66apkPGg5PkhicqKL7Obg8N7a-8vTWZLnvwN_fjwIK4owo0PljTZav2gyl0R5XQU83KcTggMt3BMRFacL2DqUdTpuGc9L4knns1TeCP1PgSHUzyYRNOWVR1WDQX-TSqjp4K9WWVY1_LqQ7iDuAe42gkgYOm1VK2He4ox-rUvXjibbH4Z_q2C7gZCC5wkAJzo_x6ArmavE0dcfdnhyFv-l2GjOQzw-Jtygcbb3HFOmMwebpUU72McgI51GjL_suZaxa0M_KpyHI" }),
                                createElement("div", { "className": "absolute inset-0 bg-gradient-to-tr from-white/58 via-white/12 to-primary/18" }),
                                createElement("div", { "className": "absolute left-6 bottom-6 glass-panel rounded-2xl p-4 bg-white/34 max-w-sm" },
                                    createElement("div", { "className": "font-label-sm text-primary mb-2" },
                                        "编辑精选"
                                    ),
                                    createElement("div", { "className": "font-body-md text-on-surface-variant" },
                                        "一篇关于 AI 产品构建节奏、组件化和用户反馈闭环的完整复盘。"
                                    )
                                )
                            )
                        ),
                        createElement("article", { "className": "glass-panel rounded-3xl p-7 detail-prose" },
                            createElement("p", null,
                                "过去 30 天，我把一个只有一句话的产品想法推进到了可用版本。这个过程没有神奇捷径，真正有价值的是把 AI 放进每一个高频环节：需求澄清、原型验证、代码生成、文案打磨和用户反馈整理。"
                            ),
                            createElement("h2", null,
                                "第一周：先验证问题，而不是急着做功能"
                            ),
                            createElement("p", null,
                                "我先写了 20 个可能的用户场景，再把它们压缩成 3 个最容易验证的假设。AI 在这个阶段最有用的地方不是替我做决定，而是帮我穷举盲点，让访谈问题不至于只证明我原本相信的东西。"
                            ),
                            createElement("p", null,
                                "原型阶段我保留了非常粗糙的交互，只做两条主路径：创建内容、整理反馈。任何不会影响验证的问题都推迟处理，包括复杂权限、完整设置页和高级筛选。"
                            ),
                            createElement("h2", null,
                                "第二周：用组件约束速度"
                            ),
                            createElement("p", null,
                                "真正提速的是把界面拆成稳定组件。按钮、输入框、卡片、弹层和导航先统一，再让 AI 按这些约束生成页面。这样得到的不是一次性代码，而是可以持续维护的产品骨架。"
                            ),
                            createElement("p", null,
                                "我发现一个很重要的经验：提示词越像产品规范，结果越稳定；提示词越像情绪描述，结果越容易变成一堆漂亮但不可用的碎片。"
                            ),
                            createElement("h2", null,
                                "第三周到第四周：让反馈进入日常节奏"
                            ),
                            createElement("p", null,
                                "上线前我每天只看三个指标：新用户是否完成首个任务、是否愿意第二天回来、以及他们卡在哪一步。AI 帮我把访谈和行为记录整理成改动清单，但排序仍然由我来做。"
                            ),
                            createElement("p", null,
                                "30 天之后，产品还远没有成熟，但它已经足够真实。这个阶段最重要的成果不是功能数量，而是形成了一套可以继续迭代的判断系统。"
                            ),
                            createElement("div", { "className": "rounded-2xl bg-primary/8 border border-primary/12 px-5 py-4 mt-6" },
                                createElement("div", { "className": "font-headline-md text-[17px] text-on-surface mb-2" },
                                    "核心结论"
                                ),
                                createElement("p", { "className": "!mb-0" },
                                    "AI 能放大执行速度，但产品判断仍然来自真实用户、稳定组件和明确优先级。"
                                )
                            )
                        ),
                        createElement("section", { "className": "glass-panel rounded-3xl p-5 flex items-center justify-between" },
                            createElement("div", { "className": "flex gap-6" },
                                createElement("button", { "className": "flex items-center gap-1.5 text-error hover:opacity-80 active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "material-symbols-outlined text-[21px]", "style": { "fontVariationSettings": "'FILL' 1" } },
                                        "favorite"
                                    ),
                                    createElement("span", { "className": "font-label-sm" },
                                        "892"
                                    )
                                ),
                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "material-symbols-outlined text-[21px]" },
                                        "chat_bubble"
                                    ),
                                    createElement("span", { "className": "font-label-sm" },
                                        "36"
                                    )
                                ),
                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "material-symbols-outlined text-[21px]" },
                                        "bookmark"
                                    ),
                                    createElement("span", { "className": "font-label-sm" },
                                        "128"
                                    )
                                )
                            ),
                            createElement("button", { "className": "glass-button-ghost rounded-full px-4 py-2 flex items-center gap-2 text-primary font-label-sm active:scale-95" },
                                createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                    "ios_share"
                                ),
                                "\n                分享\n            "
                            )
                        ),
                        createElement("section", { "className": "glass-panel rounded-3xl p-6" },
                            createElement("div", { "className": "flex items-center justify-between mb-5" },
                                createElement("div", null,
                                    createElement("h2", { "className": "font-headline-md text-on-surface" },
                                        "评论"
                                    ),
                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                        "36 条讨论 · 按热度排序"
                                    )
                                ),
                                createElement("button", { "className": "glass-button-ghost rounded-full px-4 py-2 text-primary font-label-sm active:scale-95" },
                                    "最新"
                                )
                            ),
                            createElement("div", { "className": "comment-row rounded-2xl p-4 mb-4" },
                                createElement("div", { "className": "flex gap-3" },
                                    createElement("img", { "alt": "当前用户", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" }),
                                    createElement("div", { "className": "flex-1" },
                                        createElement("div", { "className": "composer-shell" },
                                            createElement("input", { "className": "w-full bg-transparent border-none text-body-md focus:ring-0 placeholder:text-on-surface-variant/60 transition-all duration-300", "placeholder": "写下你的观点，补充或提问...", "type": "text" })
                                        ),
                                        createElement("div", { "className": "flex items-center justify-between mt-3" },
                                            createElement("div", { "className": "flex gap-2 text-on-surface-variant" },
                                                createElement("button", { "className": "hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[19px]" },
                                                        "alternate_email"
                                                    )
                                                ),
                                                createElement("button", { "className": "hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[19px]" },
                                                        "image"
                                                    )
                                                )
                                            ),
                                            createElement("button", { "className": "glass-button-primary text-white font-label-sm px-4 py-2 rounded-full active:scale-95 transition-all duration-300" },
                                                "发送"
                                            )
                                        )
                                    )
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-3" },
                                createElement("div", { "className": "comment-row rounded-2xl p-4" },
                                    createElement("div", { "className": "flex gap-3" },
                                        createElement("img", { "alt": "Chen Zhiyuan", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAjy9F2spaCuXVNFsbQA3OV-xq3_D_aHed697ibS0JfB92Tg6j809zOnsf2bKmMmYrqeIfWaNNm0ympGjqJbH9xXKQFAdboyzS0CordhHdkjn7IkPl8qrouYIHYw8600T3WIc5vBGXygRxp6_z3z5fqQ3NUuUOUhDcEXY9xSQ_cXzldsBIpliCkfFqJaAqkhAahMB57RP2JphA2SpDMfQ2aAbBfzdRKnguiYGF_zuJx76lxhRvGZdHnftv9o6UeuZaj9T8aAVfWHXc" }),
                                        createElement("div", { "className": "flex-1 min-w-0" },
                                            createElement("div", { "className": "flex items-center justify-between gap-3" },
                                                createElement("div", null,
                                                    createElement("div", { "className": "font-headline-md text-[15px] text-on-surface" },
                                                        "Chen Zhiyuan"
                                                    ),
                                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                                        "界面设计师 · 28 分钟前"
                                                    )
                                                ),
                                                createElement("button", { "className": "text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[20px]" },
                                                        "more_horiz"
                                                    )
                                                )
                                            ),
                                            createElement("p", { "className": "font-body-md text-on-surface-variant mt-3" },
                                                "这篇复盘最有价值的是把 AI 放到具体流程里，而不是停留在“提高效率”的抽象表述。组件约束速度这个点很认同。"
                                            ),
                                            createElement("div", { "className": "mt-3 rounded-2xl bg-white/35 border border-white/40 px-4 py-3 font-body-md text-on-surface-variant text-[13px]" },
                                                "尤其是提示词像产品规范这一句，基本说中了稳定产出的关键。"
                                            ),
                                            createElement("div", { "className": "flex items-center gap-5 mt-4" },
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-error active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "favorite"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "86"
                                                    )
                                                ),
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "reply"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "回复"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                createElement("div", { "className": "comment-row rounded-2xl p-4" },
                                    createElement("div", { "className": "flex gap-3" },
                                        createElement("img", { "alt": "Zhang Xiaolong", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAWq-D_IMAoovUJnq2NeL9-Wm6WK7d7dWPFW5mEr4Zc-BC5am_HSoshASJ_432ojGLAXiF4n9BEUxU79VCb1qMF6lIww0vrQxbrAX_2Lf66y3Oyt2Aqmua_WTEnomNIxL3LKHsKYfugq8uxCECu8DMs2g6pvdYx6VJX536DIeFiyme4A6WSadft_V0Qz6wS-no1S0JGZSCZ2U25rsVMXl1gPcikmRe8NMv0Q_iy0tvZS0UzuCzwmTFNi_oAR4RfLgvPAiIzgkp-m_U" }),
                                        createElement("div", { "className": "flex-1 min-w-0" },
                                            createElement("div", { "className": "flex items-center justify-between gap-3" },
                                                createElement("div", null,
                                                    createElement("div", { "className": "font-headline-md text-[15px] text-on-surface" },
                                                        "Zhang Xiaolong"
                                                    ),
                                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                                        "产品经理 · 1 小时前"
                                                    )
                                                ),
                                                createElement("button", { "className": "text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[20px]" },
                                                        "more_horiz"
                                                    )
                                                )
                                            ),
                                            createElement("p", { "className": "font-body-md text-on-surface-variant mt-3" },
                                                "想看后续怎么把用户反馈转成优先级。如果能展示一下你的表格或看板结构会更完整。"
                                            ),
                                            createElement("div", { "className": "flex items-center gap-5 mt-4" },
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-error active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "favorite"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "54"
                                                    )
                                                ),
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "reply"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "回复"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                createElement("div", { "className": "comment-row rounded-2xl p-4" },
                                    createElement("div", { "className": "flex gap-3" },
                                        createElement("img", { "alt": "Mira Chen", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" }),
                                        createElement("div", { "className": "flex-1 min-w-0" },
                                            createElement("div", { "className": "flex items-center justify-between gap-3" },
                                                createElement("div", null,
                                                    createElement("div", { "className": "font-headline-md text-[15px] text-on-surface" },
                                                        "Mira Chen"
                                                    ),
                                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                                        "产品设计师 · 2 小时前"
                                                    )
                                                ),
                                                createElement("button", { "className": "text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[20px]" },
                                                        "more_horiz"
                                                    )
                                                )
                                            ),
                                            createElement("p", { "className": "font-body-md text-on-surface-variant mt-3" },
                                                "评论区也需要保持阅读节奏，信息密度不能太吵。喜欢这种评论卡片和正文之间的层级。"
                                            ),
                                            createElement("div", { "className": "flex items-center gap-5 mt-4" },
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-error active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "favorite"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "37"
                                                    )
                                                ),
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "reply"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "回复"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    createElement("aside", { "className": "hidden lg:flex lg:col-span-3 flex-col gap-6" },
                        createElement("div", { "className": "glass-panel rounded-3xl p-5 hover-lift shine-effect" },
                            createElement("div", { "className": "flex items-center justify-between mb-4 relative z-20" },
                                createElement("h3", { "className": "font-headline-md text-[16px] text-on-surface" },
                                    "趋势话题"
                                ),
                                createElement("button", { "className": "text-on-surface-variant text-[13px] hover:text-primary active:scale-95 transition-all duration-300" },
                                    "查看全部"
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-3 relative z-20" },
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-error w-4 text-center" },
                                            "1"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# AI 产品趋势"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-error text-[16px] group-hover:-translate-y-1 transition-transform duration-300" },
                                            "arrow_upward"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "12.5k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-orange-400 w-4 text-center" },
                                            "2"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 设计系统"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-emerald-500 text-[16px] group-hover:-translate-y-1 transition-transform duration-300" },
                                            "arrow_upward"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "8.7k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-yellow-500 w-4 text-center" },
                                            "3"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 独立开发日志"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-on-surface-variant text-[16px]" },
                                            "remove"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "6.3k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-on-surface-variant w-4 text-center" },
                                            "4"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 远程工作技巧"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-emerald-500 text-[16px] group-hover:-translate-y-1 transition-transform duration-300" },
                                            "arrow_upward"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "4.1k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300 mt-1" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-on-surface-variant w-4 text-center" },
                                            "5"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 创作者经济"
                                        ),
                                        createElement("span", { "className": "px-2 py-0.5 bg-primary/10 text-primary rounded-md font-meta-xs group-hover:bg-primary/20 transition-colors" },
                                            "新"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "3.2k"
                                    )
                                )
                            )
                        ),
                        createElement("div", { "className": "glass-panel rounded-3xl p-5 hover-lift shine-effect" },
                            createElement("div", { "className": "flex items-center justify-between mb-4 relative z-20" },
                                createElement("h3", { "className": "font-headline-md text-[16px] text-on-surface" },
                                    "为你推荐"
                                ),
                                createElement("button", { "className": "flex items-center gap-1 text-on-surface-variant text-[13px] hover:text-primary active:scale-95 transition-all duration-300 group" },
                                    createElement("span", { "className": "material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-500" },
                                        "refresh"
                                    ),
                                    " 换一批\n                        "
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-4 relative z-20" },
                                createElement("div", { "className": "flex items-center justify-between group" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("img", { "alt": "用户", "className": "w-10 h-10 rounded-full border border-white object-cover group-hover:scale-105 transition-transform duration-300", "data-alt": "A portrait of a young man with a casual haircut, wearing a simple t-shirt, set against a bright, airy background. The style is approachable and modern, suitable for a digital profile picture in a clean, soft-futurist UI context.", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAWq-D_IMAoovUJnq2NeL9-Wm6WK7d7dWPFW5mEr4Zc-BC5am_HSoshASJ_432ojGLAXiF4n9BEUxU79VCb1qMF6lIww0vrQxbrAX_2Lf66y3Oyt2Aqmua_WTEnomNIxL3LKHsKYfugq8uxCECu8DMs2g6pvdYx6VJX536DIeFiyme4A6WSadft_V0Qz6wS-no1S0JGZSCZ2U25rsVMXl1gPcikmRe8NMv0Q_iy0tvZS0UzuCzwmTFNi_oAR4RfLgvPAiIzgkp-m_U" }),
                                        createElement("div", { "className": "flex flex-col cursor-pointer" },
                                            createElement("span", { "className": "font-headline-md text-[14px] group-hover:text-primary transition-colors" },
                                                "Zhang Xiaolong"
                                            ),
                                            createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                                "产品经理"
                                            )
                                        )
                                    ),
                                    createElement("button", { "className": "glass-button-ghost px-4 py-1.5 rounded-full font-label-sm text-primary border-primary/20 hover:border-primary active:scale-95 transition-all duration-300" },
                                        "关注"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("img", { "alt": "用户", "className": "w-10 h-10 rounded-full border border-white object-cover group-hover:scale-105 transition-transform duration-300", "data-alt": "A portrait of a confident middle-aged woman wearing glasses and a light blazer. The lighting is professional yet soft, emphasizing a bright, trustworthy aesthetic fitting for a premium digital feed interface.", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAjy9F2spaCuXVNFsbQA3OV-xq3_D_aHed697ibS0JfB92Tg6j809zOnsf2bKmMmYrqeIfWaNNm0ympGjqJbH9xXKQFAdboyzS0CordhHdkjn7IkPl8qrouYIHYw8600T3WIc5vBGXygRxp6_z3z5fqQ3NUuUOUhDcEXY9xSQ_cXzldsBIpliCkfFqJaAqkhAahMB57RP2JphA2SpDMfQ2aAbBfzdRKnguiYGF_zuJx76lxhRvGZdHnftv9o6UeuZaj9T8aAVfWHXc" }),
                                        createElement("div", { "className": "flex flex-col cursor-pointer" },
                                            createElement("span", { "className": "font-headline-md text-[14px] group-hover:text-primary transition-colors" },
                                                "Chen Zhiyuan"
                                            ),
                                            createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                                "界面设计师"
                                            )
                                        )
                                    ),
                                    createElement("button", { "className": "glass-button-ghost px-4 py-1.5 rounded-full font-label-sm text-primary border-primary/20 hover:border-primary active:scale-95 transition-all duration-300" },
                                        "关注"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("div", { "className": "w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-display text-[18px] group-hover:scale-105 transition-transform duration-300 shadow-sm" },
                                            "A"
                                        ),
                                        createElement("div", { "className": "flex flex-col cursor-pointer" },
                                            createElement("span", { "className": "font-headline-md text-[14px] group-hover:text-primary transition-colors" },
                                                "AI 前线"
                                            ),
                                            createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                                "科技媒体"
                                            )
                                        )
                                    ),
                                    createElement("button", { "className": "glass-button-ghost px-4 py-1.5 rounded-full font-label-sm text-primary border-primary/20 hover:border-primary active:scale-95 transition-all duration-300" },
                                        "关注"
                                    )
                                )
                            )
                        ),
                        createElement("div", { "className": "glass-panel rounded-3xl p-5 relative overflow-hidden hover-lift shine-effect group" })
                    )
                )
            )
        )
    },
    "video": {
        title: "zfeed - 创作工具的未来：AI 成为协作副驾",
        htmlClass: "light",
        bodyClass: "text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container",
        children: createElement("div", { "className": "page-root" },
            createElement("header", { "className": "fixed top-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-[50px] border-b border-white/20 saturate-[180%] shadow-sm border-white/30 shadow-md" },
                createElement("div", { "className": "flex items-center gap-4" },
                    createElement("button", { "className": "md:hidden p-2 text-on-surface-variant hover:bg-white/20 active:scale-95 rounded-full transition-all duration-300 ease-out" },
                        createElement("span", { "className": "material-symbols-outlined" },
                            "menu"
                        )
                    ),
                    createElement("div", { "className": "flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 gap-3" },
                        createElement("div", { "className": "w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center shadow-md" },
                            createElement("div", { "className": "w-3 h-3 bg-white rounded-full" })
                        ),
                        createElement("span", { "className": "font-display text-[24px] tracking-tight font-bold text-primary dark:text-primary-fixed" },
                            "zfeed"
                        )
                    ),
                    createElement("div", { "className": "hidden md:flex ml-8 relative w-96 group md:ml-16 search-shell overflow-hidden" },
                        createElement("span", { "className": "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300" },
                            "search"
                        ),
                        createElement("input", { "className": "glass-input w-full pl-10 pr-4 rounded-full font-body-md text-on-surface placeholder:text-on-surface-variant/70 border-white/40 bg-white/30 backdrop-blur-md focus:bg-white/60 transition-colors py-2.5", "placeholder": "搜索内容、创作者或话题", "type": "text" })
                    )
                ),
                createElement("nav", { "className": "hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-5" },
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "/following" },
                        "关注"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "趋势"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "最新"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "AI"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "设计"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "#" },
                        "科技"
                    )
                ),
                createElement("div", { "className": "flex items-center gap-5 pr-12" },
                    createElement("button", { "className": "top-icon-btn relative text-on-surface-variant active:scale-95 rounded-full transition-all duration-300 ease-out" },
                        createElement("span", { "className": "material-symbols-outlined" },
                            "notifications"
                        ),
                        createElement("span", { "className": "absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-white" })
                    ),
                    createElement("button", { "className": "top-icon-btn relative text-on-surface-variant active:scale-95 rounded-full transition-all duration-300 ease-out" },
                        createElement("span", { "className": "material-symbols-outlined" },
                            "mail"
                        ),
                        createElement("span", { "className": "absolute top-0 right-0 w-4 h-4 bg-error text-white font-label-sm text-[10px] rounded-full flex items-center justify-center border border-white" },
                            "3"
                        )
                    ),
                    createElement("button", { "className": "hidden sm:flex glass-button-primary text-white font-label-sm py-2 rounded-full items-center gap-2 active:scale-95 px-6" },
                        createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                            "add"
                        ),
                        "\n                发布\n            "
                    ),
                    createElement("a", { "aria-label": "进入我的主页", "href": "/profile?user=me" },
                        createElement("img", { "alt": "用户头像", "className": "w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-out", "data-alt": "A close-up portrait of a young woman with natural makeup, looking directly at the camera, set against a bright, well-lit background. The style is modern, crisp, and high-resolution, fitting a premium digital interface. Soft, even lighting highlights her features.", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" })
                    )
                )
            ),
            createElement("div", { "className": "pt-24 px-4 md:px-6 max-w-[1600px] mx-auto pb-safe" },
                createElement("div", { "className": "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5" },
                    createElement("aside", { "className": "hidden lg:block lg:col-span-2 relative" },
                        createElement("div", { "className": "sticky top-24 w-full flex flex-col gap-8" },
                            createElement("nav", { "className": "flex flex-col gap-1" },
                                createElement("a", { "className": "flex items-center gap-3 bg-white/60 dark:bg-black/60 text-primary font-bold rounded-lg p-2 shadow-sm ring-1 ring-inset ring-white/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined", "style": { "fontVariationSettings": "'FILL' 1" } },
                                        "home"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "推荐"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/following" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "person_add"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "关注"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "trending_up"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "趋势"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "bookmark"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "收藏"
                                    )
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-2" },
                                createElement("span", { "className": "font-meta-xs text-on-surface-variant/70 uppercase tracking-wider px-3 mb-1" },
                                    "频道"
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-label-sm transition-colors duration-300" },
                                        "A"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "AI 与机器学习"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 font-label-sm transition-colors duration-300" },
                                        "D"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "设计与灵感"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "#" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 font-label-sm transition-colors duration-300" },
                                        "P"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "产品与增长"
                                    )
                                ),
                                createElement("button", { "className": "flex items-center gap-2 text-on-surface-variant p-2 hover:text-primary hover:bg-white/40 rounded-lg active:scale-95 transition-all duration-300 ease-out text-[13px] font-body-md w-full justify-start mt-2" },
                                    createElement("span", { "className": "material-symbols-outlined text-[16px]" },
                                        "more_horiz"
                                    ),
                                    "\n                            更多频道\n                        "
                                )
                            ),
                            createElement("div", { "className": "mt-auto flex flex-col gap-1 border-t border-white/40 pt-4" },
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-3 nav-link-hover active:scale-95", "href": "#" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "settings"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[14px]" },
                                        "设置"
                                    )
                                )
                            )
                        )
                    ),
                    createElement("main", { "className": "feed-transition col-span-4 md:col-span-8 lg:col-span-7 flex flex-col gap-6 pb-24 feed-ready" },
                        createElement("section", { "className": "glass-panel rounded-3xl p-6 hover-lift shine-effect" },
                            createElement("a", { "className": "inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-5", "href": "/" },
                                createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                    "arrow_back"
                                ),
                                createElement("span", { "className": "font-label-sm" },
                                    "返回 Feed"
                                )
                            ),
                            createElement("div", { "className": "font-label-sm text-primary mb-3" },
                                "视频 · AI 工作流"
                            ),
                            createElement("h1", { "className": "font-display text-[38px] leading-tight text-on-surface" },
                                "创作工具的未来：AI 成为协作副驾"
                            ),
                            createElement("div", { "className": "flex flex-wrap gap-2 mt-4" },
                                createElement("span", { "className": "px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-label-sm text-[11px] transition-colors duration-300 cursor-pointer" },
                                    "# AI 模型"
                                ),
                                createElement("span", { "className": "px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-label-sm text-[11px] transition-colors duration-300 cursor-pointer" },
                                    "# 生产力"
                                ),
                                createElement("span", { "className": "px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-label-sm text-[11px] transition-colors duration-300 cursor-pointer" },
                                    "# 创作工具"
                                )
                            ),
                            createElement("div", { "className": "flex items-center justify-between gap-4 mt-6 pt-5 border-t border-white/30" },
                                createElement("a", { "className": "flex items-center gap-3 group article-anchor", "href": "/profile?user=lin" },
                                    createElement("img", { "alt": "Lin Xia", "className": "w-11 h-11 rounded-full border border-white object-cover shadow-sm group-hover:scale-105 transition-transform duration-300", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuBKH3U0AbExKb68Hpb-JJVI9QR_i52h0ee8yDQX67e9HRNk1hJ5BEGzaKTY0KejUgpHjQH8Ci6Sd0eMojgi03_UJeCawSjJ7LIrMet-EYXXjR9C_6fjZWyvL9RP0W-cSH0RxFq6ZCq0GqvLeyE2Cu3U3NMVcdIET7574HGB054ysNU21Btj1yYaONdSkkkzDGzmBxLljyhBbtLmlzuQyFPOkhQeOlF-AEu5Vdh4HbN4mlZ_VUuCR6pNHyCmSigDZaVbBWrVnnscafY" }),
                                    createElement("div", null,
                                        createElement("div", { "className": "font-headline-md text-[16px] group-hover:text-primary transition-colors" },
                                            "Lin Xia"
                                        ),
                                        createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                            "AI 研究员 · 3 小时前 · 18:42"
                                        )
                                    )
                                ),
                                createElement("button", { "className": "glass-button-primary text-white font-label-sm px-5 py-2.5 rounded-full active:scale-95 transition-all duration-300" },
                                    "关注作者"
                                )
                            )
                        ),
                        createElement("section", { "className": "detail-video-shell rounded-3xl overflow-hidden relative text-white" },
                            createElement("div", { "className": "relative h-[420px] overflow-hidden" },
                                createElement("img", { "alt": "视频画面", "className": "absolute inset-0 w-full h-full object-cover opacity-62 mix-blend-overlay", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAz10wqckHxx_fzlly_PU5l8rUOYXrK49zrPaAqIMU0xo1pL5FpIbMsJNd_m7A8OKuBiVIUhp220quI7hfR4gbAQKD4vx512FpOEkn7NzJj4LcnXf_t_dqNdiFkqYX28jp5PwY1ikK5BwZSnPI3wvkfq6cj6rPCPhmfb2Wg1biVMZKA3OkCZJXGg3fivfbRSRYfEMgHG-UVrtjpUN5oP8vOlpJiuDq5P57RQwykerL3XY2IYPbAiHvNGXzzgugBOS5C4IQbcpzht0k" }),
                                createElement("div", { "className": "absolute inset-0 bg-gradient-to-t from-black/52 via-black/12 to-white/8" }),
                                createElement("div", { "className": "absolute inset-0 flex items-center justify-center" },
                                    createElement("button", { "className": "w-20 h-20 rounded-full bg-white/26 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300" },
                                        createElement("span", { "className": "material-symbols-outlined text-white text-[42px]", "style": { "fontVariationSettings": "'FILL' 1" } },
                                            "play_arrow"
                                        )
                                    )
                                ),
                                createElement("div", { "className": "absolute left-5 right-5 bottom-5 glass-panel rounded-2xl px-4 py-3 bg-white/20" },
                                    createElement("div", { "className": "flex items-center gap-3 text-white" },
                                        createElement("span", { "className": "font-label-sm" },
                                            "03:28"
                                        ),
                                        createElement("div", { "className": "h-1.5 flex-1 rounded-full bg-white/25 overflow-hidden" },
                                            createElement("div", { "className": "h-full w-[28%] rounded-full bg-white shadow-sm" })
                                        ),
                                        createElement("span", { "className": "font-label-sm" },
                                            "18:42"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-[20px]" },
                                            "fullscreen"
                                        )
                                    )
                                )
                            )
                        ),
                        createElement("section", { "className": "glass-panel rounded-3xl p-5" },
                            createElement("h2", { "className": "font-headline-md text-on-surface mb-4" },
                                "视频章节"
                            ),
                            createElement("div", { "className": "grid gap-3" },
                                createElement("button", { "className": "glass-button-ghost rounded-2xl px-4 py-3 flex items-center justify-between text-left hover:scale-[1.01] active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "font-body-md text-on-surface" },
                                        "为什么协作副驾不是自动驾驶"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-primary" },
                                        "00:00"
                                    )
                                ),
                                createElement("button", { "className": "glass-button-ghost rounded-2xl px-4 py-3 flex items-center justify-between text-left hover:scale-[1.01] active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "font-body-md text-on-surface" },
                                        "从素材理解到草稿生成"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-primary" },
                                        "04:18"
                                    )
                                ),
                                createElement("button", { "className": "glass-button-ghost rounded-2xl px-4 py-3 flex items-center justify-between text-left hover:scale-[1.01] active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "font-body-md text-on-surface" },
                                        "创作者如何保持判断权"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-primary" },
                                        "09:36"
                                    )
                                ),
                                createElement("button", { "className": "glass-button-ghost rounded-2xl px-4 py-3 flex items-center justify-between text-left hover:scale-[1.01] active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "font-body-md text-on-surface" },
                                        "下一代工具的界面形态"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-primary" },
                                        "15:10"
                                    )
                                )
                            )
                        ),
                        createElement("section", { "className": "glass-panel rounded-3xl p-5 flex items-center justify-between" },
                            createElement("div", { "className": "flex gap-6" },
                                createElement("button", { "className": "flex items-center gap-1.5 text-error hover:opacity-80 active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "material-symbols-outlined text-[21px]", "style": { "fontVariationSettings": "'FILL' 1" } },
                                        "favorite"
                                    ),
                                    createElement("span", { "className": "font-label-sm" },
                                        "1.2k"
                                    )
                                ),
                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "material-symbols-outlined text-[21px]" },
                                        "chat_bubble"
                                    ),
                                    createElement("span", { "className": "font-label-sm" },
                                        "128"
                                    )
                                ),
                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                    createElement("span", { "className": "material-symbols-outlined text-[21px]" },
                                        "bookmark"
                                    ),
                                    createElement("span", { "className": "font-label-sm" },
                                        "421"
                                    )
                                )
                            ),
                            createElement("button", { "className": "glass-button-ghost rounded-full px-4 py-2 flex items-center gap-2 text-primary font-label-sm active:scale-95" },
                                createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                    "ios_share"
                                ),
                                "\n                分享\n            "
                            )
                        ),
                        createElement("section", { "className": "glass-panel rounded-3xl p-6" },
                            createElement("div", { "className": "flex items-center justify-between mb-5" },
                                createElement("div", null,
                                    createElement("h2", { "className": "font-headline-md text-on-surface" },
                                        "评论"
                                    ),
                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                        "128 条讨论 · 按热度排序"
                                    )
                                ),
                                createElement("button", { "className": "glass-button-ghost rounded-full px-4 py-2 text-primary font-label-sm active:scale-95" },
                                    "最新"
                                )
                            ),
                            createElement("div", { "className": "comment-row rounded-2xl p-4 mb-4" },
                                createElement("div", { "className": "flex gap-3" },
                                    createElement("img", { "alt": "当前用户", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" }),
                                    createElement("div", { "className": "flex-1" },
                                        createElement("div", { "className": "composer-shell" },
                                            createElement("input", { "className": "w-full bg-transparent border-none text-body-md focus:ring-0 placeholder:text-on-surface-variant/60 transition-all duration-300", "placeholder": "写下你的观点，补充或提问...", "type": "text" })
                                        ),
                                        createElement("div", { "className": "flex items-center justify-between mt-3" },
                                            createElement("div", { "className": "flex gap-2 text-on-surface-variant" },
                                                createElement("button", { "className": "hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[19px]" },
                                                        "alternate_email"
                                                    )
                                                ),
                                                createElement("button", { "className": "hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[19px]" },
                                                        "image"
                                                    )
                                                )
                                            ),
                                            createElement("button", { "className": "glass-button-primary text-white font-label-sm px-4 py-2 rounded-full active:scale-95 transition-all duration-300" },
                                                "发送"
                                            )
                                        )
                                    )
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-3" },
                                createElement("div", { "className": "comment-row rounded-2xl p-4" },
                                    createElement("div", { "className": "flex gap-3" },
                                        createElement("img", { "alt": "Chen Zhiyuan", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAjy9F2spaCuXVNFsbQA3OV-xq3_D_aHed697ibS0JfB92Tg6j809zOnsf2bKmMmYrqeIfWaNNm0ympGjqJbH9xXKQFAdboyzS0CordhHdkjn7IkPl8qrouYIHYw8600T3WIc5vBGXygRxp6_z3z5fqQ3NUuUOUhDcEXY9xSQ_cXzldsBIpliCkfFqJaAqkhAahMB57RP2JphA2SpDMfQ2aAbBfzdRKnguiYGF_zuJx76lxhRvGZdHnftv9o6UeuZaj9T8aAVfWHXc" }),
                                        createElement("div", { "className": "flex-1 min-w-0" },
                                            createElement("div", { "className": "flex items-center justify-between gap-3" },
                                                createElement("div", null,
                                                    createElement("div", { "className": "font-headline-md text-[15px] text-on-surface" },
                                                        "Chen Zhiyuan"
                                                    ),
                                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                                        "界面设计师 · 28 分钟前"
                                                    )
                                                ),
                                                createElement("button", { "className": "text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[20px]" },
                                                        "more_horiz"
                                                    )
                                                )
                                            ),
                                            createElement("p", { "className": "font-body-md text-on-surface-variant mt-3" },
                                                "这篇复盘最有价值的是把 AI 放到具体流程里，而不是停留在“提高效率”的抽象表述。组件约束速度这个点很认同。"
                                            ),
                                            createElement("div", { "className": "mt-3 rounded-2xl bg-white/35 border border-white/40 px-4 py-3 font-body-md text-on-surface-variant text-[13px]" },
                                                "尤其是提示词像产品规范这一句，基本说中了稳定产出的关键。"
                                            ),
                                            createElement("div", { "className": "flex items-center gap-5 mt-4" },
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-error active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "favorite"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "86"
                                                    )
                                                ),
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "reply"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "回复"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                createElement("div", { "className": "comment-row rounded-2xl p-4" },
                                    createElement("div", { "className": "flex gap-3" },
                                        createElement("img", { "alt": "Zhang Xiaolong", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAWq-D_IMAoovUJnq2NeL9-Wm6WK7d7dWPFW5mEr4Zc-BC5am_HSoshASJ_432ojGLAXiF4n9BEUxU79VCb1qMF6lIww0vrQxbrAX_2Lf66y3Oyt2Aqmua_WTEnomNIxL3LKHsKYfugq8uxCECu8DMs2g6pvdYx6VJX536DIeFiyme4A6WSadft_V0Qz6wS-no1S0JGZSCZ2U25rsVMXl1gPcikmRe8NMv0Q_iy0tvZS0UzuCzwmTFNi_oAR4RfLgvPAiIzgkp-m_U" }),
                                        createElement("div", { "className": "flex-1 min-w-0" },
                                            createElement("div", { "className": "flex items-center justify-between gap-3" },
                                                createElement("div", null,
                                                    createElement("div", { "className": "font-headline-md text-[15px] text-on-surface" },
                                                        "Zhang Xiaolong"
                                                    ),
                                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                                        "产品经理 · 1 小时前"
                                                    )
                                                ),
                                                createElement("button", { "className": "text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[20px]" },
                                                        "more_horiz"
                                                    )
                                                )
                                            ),
                                            createElement("p", { "className": "font-body-md text-on-surface-variant mt-3" },
                                                "想看后续怎么把用户反馈转成优先级。如果能展示一下你的表格或看板结构会更完整。"
                                            ),
                                            createElement("div", { "className": "flex items-center gap-5 mt-4" },
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-error active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "favorite"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "54"
                                                    )
                                                ),
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "reply"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "回复"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                createElement("div", { "className": "comment-row rounded-2xl p-4" },
                                    createElement("div", { "className": "flex gap-3" },
                                        createElement("img", { "alt": "Mira Chen", "className": "w-10 h-10 rounded-full border border-white object-cover shadow-sm", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" }),
                                        createElement("div", { "className": "flex-1 min-w-0" },
                                            createElement("div", { "className": "flex items-center justify-between gap-3" },
                                                createElement("div", null,
                                                    createElement("div", { "className": "font-headline-md text-[15px] text-on-surface" },
                                                        "Mira Chen"
                                                    ),
                                                    createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                                        "产品设计师 · 2 小时前"
                                                    )
                                                ),
                                                createElement("button", { "className": "text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[20px]" },
                                                        "more_horiz"
                                                    )
                                                )
                                            ),
                                            createElement("p", { "className": "font-body-md text-on-surface-variant mt-3" },
                                                "评论区也需要保持阅读节奏，信息密度不能太吵。喜欢这种评论卡片和正文之间的层级。"
                                            ),
                                            createElement("div", { "className": "flex items-center gap-5 mt-4" },
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-error active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "favorite"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "37"
                                                    )
                                                ),
                                                createElement("button", { "className": "flex items-center gap-1.5 text-on-surface-variant hover:text-primary active:scale-95 transition-all duration-300" },
                                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                        "reply"
                                                    ),
                                                    createElement("span", { "className": "font-label-sm" },
                                                        "回复"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    createElement("aside", { "className": "hidden lg:flex lg:col-span-3 flex-col gap-6" },
                        createElement("div", { "className": "glass-panel rounded-3xl p-5 hover-lift shine-effect" },
                            createElement("div", { "className": "flex items-center justify-between mb-4 relative z-20" },
                                createElement("h3", { "className": "font-headline-md text-[16px] text-on-surface" },
                                    "趋势话题"
                                ),
                                createElement("button", { "className": "text-on-surface-variant text-[13px] hover:text-primary active:scale-95 transition-all duration-300" },
                                    "查看全部"
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-3 relative z-20" },
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-error w-4 text-center" },
                                            "1"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# AI 产品趋势"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-error text-[16px] group-hover:-translate-y-1 transition-transform duration-300" },
                                            "arrow_upward"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "12.5k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-orange-400 w-4 text-center" },
                                            "2"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 设计系统"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-emerald-500 text-[16px] group-hover:-translate-y-1 transition-transform duration-300" },
                                            "arrow_upward"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "8.7k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-yellow-500 w-4 text-center" },
                                            "3"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 独立开发日志"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-on-surface-variant text-[16px]" },
                                            "remove"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "6.3k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-on-surface-variant w-4 text-center" },
                                            "4"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 远程工作技巧"
                                        ),
                                        createElement("span", { "className": "material-symbols-outlined text-emerald-500 text-[16px] group-hover:-translate-y-1 transition-transform duration-300" },
                                            "arrow_upward"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "4.1k"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-colors duration-300 mt-1" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("span", { "className": "font-headline-md text-on-surface-variant w-4 text-center" },
                                            "5"
                                        ),
                                        createElement("span", { "className": "font-body-md text-on-surface group-hover:text-primary transition-colors" },
                                            "# 创作者经济"
                                        ),
                                        createElement("span", { "className": "px-2 py-0.5 bg-primary/10 text-primary rounded-md font-meta-xs group-hover:bg-primary/20 transition-colors" },
                                            "新"
                                        )
                                    ),
                                    createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                        "3.2k"
                                    )
                                )
                            )
                        ),
                        createElement("div", { "className": "glass-panel rounded-3xl p-5 hover-lift shine-effect" },
                            createElement("div", { "className": "flex items-center justify-between mb-4 relative z-20" },
                                createElement("h3", { "className": "font-headline-md text-[16px] text-on-surface" },
                                    "为你推荐"
                                ),
                                createElement("button", { "className": "flex items-center gap-1 text-on-surface-variant text-[13px] hover:text-primary active:scale-95 transition-all duration-300 group" },
                                    createElement("span", { "className": "material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-500" },
                                        "refresh"
                                    ),
                                    " 换一批\n                        "
                                )
                            ),
                            createElement("div", { "className": "flex flex-col gap-4 relative z-20" },
                                createElement("div", { "className": "flex items-center justify-between group" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("img", { "alt": "用户", "className": "w-10 h-10 rounded-full border border-white object-cover group-hover:scale-105 transition-transform duration-300", "data-alt": "A portrait of a young man with a casual haircut, wearing a simple t-shirt, set against a bright, airy background. The style is approachable and modern, suitable for a digital profile picture in a clean, soft-futurist UI context.", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAWq-D_IMAoovUJnq2NeL9-Wm6WK7d7dWPFW5mEr4Zc-BC5am_HSoshASJ_432ojGLAXiF4n9BEUxU79VCb1qMF6lIww0vrQxbrAX_2Lf66y3Oyt2Aqmua_WTEnomNIxL3LKHsKYfugq8uxCECu8DMs2g6pvdYx6VJX536DIeFiyme4A6WSadft_V0Qz6wS-no1S0JGZSCZ2U25rsVMXl1gPcikmRe8NMv0Q_iy0tvZS0UzuCzwmTFNi_oAR4RfLgvPAiIzgkp-m_U" }),
                                        createElement("div", { "className": "flex flex-col cursor-pointer" },
                                            createElement("span", { "className": "font-headline-md text-[14px] group-hover:text-primary transition-colors" },
                                                "Zhang Xiaolong"
                                            ),
                                            createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                                "产品经理"
                                            )
                                        )
                                    ),
                                    createElement("button", { "className": "glass-button-ghost px-4 py-1.5 rounded-full font-label-sm text-primary border-primary/20 hover:border-primary active:scale-95 transition-all duration-300" },
                                        "关注"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("img", { "alt": "用户", "className": "w-10 h-10 rounded-full border border-white object-cover group-hover:scale-105 transition-transform duration-300", "data-alt": "A portrait of a confident middle-aged woman wearing glasses and a light blazer. The lighting is professional yet soft, emphasizing a bright, trustworthy aesthetic fitting for a premium digital feed interface.", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuAjy9F2spaCuXVNFsbQA3OV-xq3_D_aHed697ibS0JfB92Tg6j809zOnsf2bKmMmYrqeIfWaNNm0ympGjqJbH9xXKQFAdboyzS0CordhHdkjn7IkPl8qrouYIHYw8600T3WIc5vBGXygRxp6_z3z5fqQ3NUuUOUhDcEXY9xSQ_cXzldsBIpliCkfFqJaAqkhAahMB57RP2JphA2SpDMfQ2aAbBfzdRKnguiYGF_zuJx76lxhRvGZdHnftv9o6UeuZaj9T8aAVfWHXc" }),
                                        createElement("div", { "className": "flex flex-col cursor-pointer" },
                                            createElement("span", { "className": "font-headline-md text-[14px] group-hover:text-primary transition-colors" },
                                                "Chen Zhiyuan"
                                            ),
                                            createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                                "界面设计师"
                                            )
                                        )
                                    ),
                                    createElement("button", { "className": "glass-button-ghost px-4 py-1.5 rounded-full font-label-sm text-primary border-primary/20 hover:border-primary active:scale-95 transition-all duration-300" },
                                        "关注"
                                    )
                                ),
                                createElement("div", { "className": "flex items-center justify-between group" },
                                    createElement("div", { "className": "flex items-center gap-3" },
                                        createElement("div", { "className": "w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-display text-[18px] group-hover:scale-105 transition-transform duration-300 shadow-sm" },
                                            "A"
                                        ),
                                        createElement("div", { "className": "flex flex-col cursor-pointer" },
                                            createElement("span", { "className": "font-headline-md text-[14px] group-hover:text-primary transition-colors" },
                                                "AI 前线"
                                            ),
                                            createElement("span", { "className": "font-meta-xs text-on-surface-variant" },
                                                "科技媒体"
                                            )
                                        )
                                    ),
                                    createElement("button", { "className": "glass-button-ghost px-4 py-1.5 rounded-full font-label-sm text-primary border-primary/20 hover:border-primary active:scale-95 transition-all duration-300" },
                                        "关注"
                                    )
                                )
                            )
                        ),
                        createElement("div", { "className": "glass-panel rounded-3xl p-5 relative overflow-hidden hover-lift shine-effect group" })
                    )
                )
            )
        )
    }
};

export function DetailPage() {
    const detailKey = new URLSearchParams(window.location.search).get("type") === "video" ? "video" : "article";
    const variant = variants[detailKey] ?? variants["article"];

    return createElement(
        PageShell,
        { title: variant.title, htmlClass: variant.htmlClass, bodyClass: variant.bodyClass, styles },
        variant.children
    );
}
