import { createElement } from "react";
import { PageShell } from "../runtime/PageShell";

const styles = "/* Liquid Glass Utility Classes */\r\n        .glass-panel {\r\n            background: rgba(255, 255, 255, 0.4);\r\n            backdrop-filter: blur(40px);\r\n            -webkit-backdrop-filter: blur(40px);\r\n            border: 1px solid rgba(255, 255, 255, 0.6);\r\n            border-top: 1px solid rgba(255, 255, 255, 0.8); /* Specular highlight */\r\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), \r\n                        0 4px 20px rgba(0, 0, 0, 0.05);\r\n        }\r\n        \r\n        .glass-input {\r\n            background: rgba(255, 255, 255, 0.5);\r\n            backdrop-filter: blur(20px);\r\n            border: 1px solid rgba(255, 255, 255, 0.7);\r\n            box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n        \r\n        .glass-input:focus {\n            outline: none;\n            border-color: var(--color-primary, #1f53c9);\n            box-shadow: 0 0 0 2px rgba(31, 83, 201, 0.2), inset 0 1px 3px rgba(0,0,0,0.02);\n        }\n\n        .search-shell {\n            border-radius: 9999px;\n            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-out;\n        }\n\n        .search-shell:hover,\n        .search-shell:focus-within {\n            transform: translateY(-2px);\n            filter: drop-shadow(0 10px 22px rgba(31, 83, 201, 0.14));\n        }\n\n        .search-shell .glass-input {\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.75), 0 4px 16px rgba(0, 0, 0, 0.04);\n        }\n\n        .search-shell:hover .glass-input {\n            background: rgba(255, 255, 255, 0.62);\n            border-color: rgba(255, 255, 255, 0.9);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .search-shell:focus-within .glass-input {\n            background: rgba(255, 255, 255, 0.72);\n            border-color: rgba(31, 83, 201, 0.55);\n            box-shadow: 0 0 0 3px rgba(31, 83, 201, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 10px 28px rgba(31, 83, 201, 0.16);\n        }\n\n        .search-shell::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n            z-index: 10;\n        }\n\n        .search-shell:hover::after,\n        .search-shell:focus-within::after {\n            left: 160%;\n        }\n\n        .composer-shell {\n            position: relative;\n            flex: 1;\n            overflow: hidden;\n            border-radius: 1.25rem;\n            background: rgba(255, 255, 255, 0.34);\n            backdrop-filter: blur(18px);\n            -webkit-backdrop-filter: blur(18px);\n            border: 1px solid rgba(255, 255, 255, 0.62);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.72), 0 4px 16px rgba(0, 0, 0, 0.035);\n            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out;\n        }\n\n        .composer-shell:hover,\n        .composer-shell:focus-within {\n            transform: translateY(-2px);\n            background: rgba(255, 255, 255, 0.58);\n            border-color: rgba(255, 255, 255, 0.9);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 10px 28px rgba(31, 83, 201, 0.12);\n        }\n\n        .composer-shell:focus-within {\n            border-color: rgba(31, 83, 201, 0.50);\n            box-shadow: 0 0 0 3px rgba(31, 83, 201, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.95), 0 12px 30px rgba(31, 83, 201, 0.16);\n        }\n\n        .composer-shell::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n            z-index: 10;\n        }\n\n        .composer-shell:hover::after,\n        .composer-shell:focus-within::after {\n            left: 160%;\n        }\n\n        .composer-shell input {\n            position: relative;\n            z-index: 20;\n            min-height: 44px;\n            padding: 0.65rem 0.95rem;\n        }\n\n        .composer-shell input:focus {\n            outline: none;\n            box-shadow: none;\n        }\n\n        .top-channel {\n            position: relative;\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            overflow: hidden;\n            min-height: 34px;\n            padding: 0 12px;\n            border-radius: 9999px;\n            color: var(--color-on-surface-variant, #434654);\n            font-weight: 600;\n            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease-out, background 0.25s ease-out, box-shadow 0.25s ease-out;\n        }\n\n        .top-channel::after {\n            content: '';\n            position: absolute;\n            top: 0;\n            left: -140%;\n            width: 42%;\n            height: 100%;\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%);\n            transform: skewX(-25deg);\n            transition: left 0.65s ease;\n            pointer-events: none;\n        }\n\n        .top-channel:hover {\n            transform: translateY(-2px);\n            color: var(--color-primary, #1f53c9);\n            background: rgba(255, 255, 255, 0.62);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .top-channel.active {\n            color: var(--color-primary, #1f53c9);\n            background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(236, 244, 255, 0.62));\n            backdrop-filter: blur(20px) saturate(1.25);\n            -webkit-backdrop-filter: blur(20px) saturate(1.25);\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(31, 83, 201, 0.12), 0 10px 24px rgba(31, 83, 201, 0.10);\n        }\n\n        .top-channel:hover::after,\n        .top-channel.active::after {\n            left: 160%;\n        }\n\n        .top-channel:active {\n            transform: translateY(-1px) scale(0.97);\n        }\n\n        .top-icon-btn {\n            width: 40px;\n            height: 40px;\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            transform: translateY(2px);\n            background: rgba(255, 255, 255, 0.16);\n            border: 1px solid rgba(255, 255, 255, 0.22);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.45);\n        }\n\n        .top-icon-btn:hover {\n            transform: translateY(0);\n            background: rgba(255, 255, 255, 0.42);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.70), 0 8px 18px rgba(31, 83, 201, 0.10);\n        }\n\n        .glass-button-primary {\n            background: linear-gradient(135deg, rgba(64, 109, 228, 0.9) 0%, rgba(31, 83, 201, 0.9) 100%);\r\n            backdrop-filter: blur(10px);\r\n            box-shadow: 0 4px 15px rgba(31, 83, 201, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);\r\n            border: 1px solid rgba(255, 255, 255, 0.2);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n        \r\n        .glass-button-primary:hover {\r\n            transform: translateY(-1px);\r\n            box-shadow: 0 6px 20px rgba(31, 83, 201, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5);\r\n        }\r\n\r\n        .glass-button-ghost {\r\n            background: rgba(255, 255, 255, 0.3);\r\n            backdrop-filter: blur(10px);\r\n            border: 1px solid rgba(255, 255, 255, 0.6);\r\n            transition: all 0.3s ease-out;\r\n        }\r\n\r\n        .glass-button-ghost:hover {\r\n            background: rgba(255, 255, 255, 0.5);\r\n            border-color: rgba(255, 255, 255, 0.8);\r\n        }\r\n\r\n        /* Hover Lift and Shine Effects */\r\n        .hover-lift {\r\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n        }\r\n        .hover-lift:hover {\r\n            transform: translateY(-4px);\r\n            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 12px 30px rgba(0, 0, 0, 0.08);\r\n            border-color: rgba(255, 255, 255, 0.9);\r\n        }\r\n\r\n        .shine-effect {\r\n            position: relative;\r\n            overflow: hidden;\r\n        }\r\n        .shine-effect::after {\r\n            content: '';\r\n            position: absolute;\r\n            top: 0;\r\n            left: -150%;\r\n            width: 50%;\r\n            height: 100%;\r\n            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);\r\n            transform: skewX(-25deg);\r\n            transition: left 0.7s ease;\r\n            z-index: 10;\r\n            pointer-events: none;\r\n        }\r\n        .shine-effect:hover::after {\r\n            left: 200%;\r\n        }\r\n\r\n        /* Ambient Background */\r\n        body {\n            background-color: #eef2f6;\n            background-image: \n                radial-gradient(circle at 15% 50%, rgba(180, 197, 255, 0.4) 0%, transparent 50%),\n                radial-gradient(circle at 85% 30%, rgba(219, 226, 250, 0.5) 0%, transparent 50%);\n            background-attachment: fixed;\n            min-height: 100vh;\n        }\n\n        .feed-transition {\n            opacity: 0;\n            transform: translateY(8px) scale(0.995);\n            filter: blur(8px);\n            transition:\n                opacity 0.28s ease,\n                transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),\n                filter 0.34s ease;\n        }\n\n        .feed-transition.feed-ready {\n            opacity: 1;\n            transform: none;\n            filter: none;\n        }\n\n        .feed-transition.feed-leaving {\n            opacity: 0;\n            transform: translateY(6px) scale(0.996);\n            filter: blur(7px);\n            pointer-events: none;\n        }\n\n        @media (prefers-reduced-motion: reduce) {\n            .feed-transition,\n            .feed-transition.feed-ready,\n            .feed-transition.feed-leaving {\n                opacity: 1;\n                transform: none;\n                filter: none;\n                transition: none;\n            }\n        }\n\n        .chart-glow-line {\n            filter: drop-shadow(0 4px 6px rgba(31, 83, 201, 0.2));\n        }\n\r\n        .nav-link-hover {\r\n            transition: all 0.2s ease-out;\r\n        }\r\n        .nav-link-hover:hover {\n            background: rgba(255, 255, 255, 0.4);\n            border-radius: 0.75rem;\n        }\n\n        .profile-tab {\n            position: relative;\n            border: 1px solid transparent;\n            background: transparent;\n            color: rgba(67, 70, 84, 0.92);\n            font-weight: 700;\n            transition: color 0.16s ease, background-color 0.16s ease, border-color 0.16s ease;\n        }\n\n        .profile-tab::after {\n            content: \"\";\n            position: absolute;\n            left: 1rem;\n            right: 1rem;\n            bottom: 0;\n            height: 2px;\n            border-radius: 999px;\n            background: transparent;\n            transition: all 0.28s ease;\n        }\n\n        .profile-tab.active,\n        .profile-tab:hover {\n            color: var(--color-primary, #1f53c9);\n            background: rgba(255, 255, 255, 0.54);\n            border: 1px solid rgba(255, 255, 255, 0.38);\n            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28);\n            transform: none;\n        }\n\n        .profile-tab.active::after,\n        .profile-tab:hover::after {\n            background: transparent;\n        }\n\n        .profile-stat-line {\n            color: rgba(67, 70, 84, 0.92);\n        }\n\n        .profile-stat-line strong {\n            color: #191c1e;\n            font-family: \"Hanken Grotesk\", sans-serif;\n            font-size: 17px;\n            font-weight: 700;\n        }\n\n        .edit-field {\n            background: rgba(255, 255, 255, 0.38);\n            border: 1px solid rgba(255, 255, 255, 0.56);\n            box-shadow: inset 0 1px 2px rgba(255,255,255,0.72);\n            transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;\n        }\n\n        .edit-field:focus {\n            outline: none;\n            border-color: rgba(31, 83, 201, 0.42);\n            background: rgba(255, 255, 255, 0.62);\n            box-shadow: inset 0 1px 2px rgba(255,255,255,0.86), 0 0 0 3px rgba(31, 83, 201, 0.10);\n        }\n\n        .edit-label {\n            color: rgba(67, 70, 84, 0.78);\n            font-family: \"Inter\", sans-serif;\n            font-size: 12px;\n            font-weight: 600;\n        }\n\n        .edit-chip {\n            background: rgba(255, 255, 255, 0.44);\n            border: 1px solid rgba(255, 255, 255, 0.54);\n            box-shadow: inset 0 1px 1px rgba(255,255,255,0.70);\n        }";

export function EditProfilePage() {
    return createElement(
        PageShell,
        { title: "zfeed - 编辑资料", htmlClass: "light", bodyClass: "text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container", styles },
        createElement("div", { "className": "page-root" },
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
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "/home" },
                        "趋势"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "/home" },
                        "最新"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "/home" },
                        "AI"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "/home" },
                        "设计"
                    ),
                    createElement("a", { "className": "top-channel text-label-sm tracking-wide", "href": "/home" },
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
                    createElement("img", { "alt": "用户头像", "className": "w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-out", "data-alt": "A close-up portrait of a young woman with natural makeup, looking directly at the camera, set against a bright, well-lit background. The style is modern, crisp, and high-resolution, fitting a premium digital interface. Soft, even lighting highlights her features.", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" })
                )
            ),
            createElement("div", { "className": "pt-24 px-4 md:px-6 max-w-[1600px] mx-auto pb-safe" },
                createElement("div", { "className": "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-5" },
                    createElement("aside", { "className": "hidden lg:block lg:col-span-2 relative" },
                        createElement("div", { "className": "sticky top-24 w-full flex flex-col gap-8" },
                            createElement("nav", { "className": "flex flex-col gap-1" },
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/home" },
                                    createElement("span", { "className": "material-symbols-outlined" },
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
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/home" },
                                    createElement("span", { "className": "material-symbols-outlined" },
                                        "trending_up"
                                    ),
                                    createElement("span", { "className": "font-label-sm text-[13px]" },
                                        "趋势"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/home" },
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
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/home" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-label-sm transition-colors duration-300" },
                                        "A"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "AI 与机器学习"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/home" },
                                    createElement("div", { "className": "w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 font-label-sm transition-colors duration-300" },
                                        "D"
                                    ),
                                    createElement("span", { "className": "font-body-md text-[13px]" },
                                        "设计与灵感"
                                    )
                                ),
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-2 nav-link-hover rounded-lg active:scale-95", "href": "/home" },
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
                                createElement("a", { "className": "flex items-center gap-3 text-on-surface-variant p-3 nav-link-hover active:scale-95", "href": "/home" },
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
                    createElement("main", { "className": "feed-transition col-span-4 md:col-span-8 lg:col-span-7 flex flex-col gap-4 pb-24 feed-ready" },
                        createElement("section", { "className": "flex items-center justify-between gap-4" },
                            createElement("div", null,
                                createElement("a", { "className": "inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-3", "href": "/me" },
                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                        "arrow_back"
                                    ),
                                    createElement("span", { "className": "font-label-sm" },
                                        "返回主页"
                                    )
                                ),
                                createElement("h1", { "className": "font-display text-[34px] leading-tight text-on-surface" },
                                    "编辑资料"
                                ),
                                createElement("p", { "className": "font-body-md text-on-surface-variant mt-1" },
                                    "更新你的公开身份、简介和展示信息。"
                                )
                            ),
                            createElement("div", { "className": "flex gap-2" },
                                createElement("a", { "className": "glass-button-ghost text-primary border-primary/20 font-label-sm px-5 py-2.5 rounded-full active:scale-95 transition-all duration-300", "href": "/me" },
                                    "取消"
                                ),
                                createElement("button", { "className": "glass-button-primary text-white font-label-sm px-5 py-2.5 rounded-full active:scale-95 transition-all duration-300 flex items-center gap-2" },
                                    createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                        "check"
                                    ),
                                    "\n                    保存\n                "
                                )
                            )
                        ),
                        createElement("section", { "className": "grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5" },
                            createElement("form", { "className": "glass-panel rounded-3xl p-6 flex flex-col gap-5" },
                                createElement("div", { "className": "flex items-center gap-4 pb-5 border-b border-white/30" },
                                    createElement("div", { "className": "relative" },
                                        createElement("img", { "alt": "Mira Chen", "className": "w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" }),
                                        createElement("button", { "className": "absolute -right-1 bottom-1 w-9 h-9 rounded-full glass-button-primary text-white flex items-center justify-center active:scale-95 transition-all duration-300", "type": "button" },
                                            createElement("span", { "className": "material-symbols-outlined text-[18px]" },
                                                "photo_camera"
                                            )
                                        )
                                    ),
                                    createElement("div", { "className": "min-w-0" },
                                        createElement("div", { "className": "font-headline-md text-on-surface" },
                                            "头像与资料"
                                        ),
                                        createElement("div", { "className": "font-body-md text-on-surface-variant mt-1" },
                                            "建议使用清晰头像，展示在主页、评论和 Feed 中。"
                                        )
                                    )
                                ),
                                createElement("div", { "className": "grid grid-cols-1 md:grid-cols-2 gap-4" },
                                    createElement("label", { "className": "flex flex-col gap-2" },
                                        createElement("span", { "className": "edit-label" },
                                            "昵称"
                                        ),
                                        createElement("input", { "className": "edit-field rounded-2xl px-4 py-3 font-body-md text-on-surface", "defaultValue": "Mira Chen", "type": "text" })
                                    ),
                                    createElement("label", { "className": "flex flex-col gap-2" },
                                        createElement("span", { "className": "edit-label" },
                                            "用户名"
                                        ),
                                        createElement("input", { "className": "edit-field rounded-2xl px-4 py-3 font-body-md text-on-surface", "defaultValue": "mira.zfeed", "type": "text" })
                                    ),
                                    createElement("label", { "className": "flex flex-col gap-2" },
                                        createElement("span", { "className": "edit-label" },
                                            "身份"
                                        ),
                                        createElement("input", { "className": "edit-field rounded-2xl px-4 py-3 font-body-md text-on-surface", "defaultValue": "产品设计师 / 内容策展人", "type": "text" })
                                    ),
                                    createElement("label", { "className": "flex flex-col gap-2" },
                                        createElement("span", { "className": "edit-label" },
                                            "位置"
                                        ),
                                        createElement("input", { "className": "edit-field rounded-2xl px-4 py-3 font-body-md text-on-surface", "defaultValue": "上海", "type": "text" })
                                    )
                                ),
                                createElement("label", { "className": "flex flex-col gap-2" },
                                    createElement("span", { "className": "edit-label" },
                                        "简介"
                                    ),
                                    createElement("textarea", { "className": "edit-field rounded-2xl px-4 py-3 font-body-md text-on-surface min-h-28 resize-none", "defaultValue": "关注创作者工具、液态玻璃界面和高质量信息流体验。正在把 zfeed 打磨成一个适合深度阅读和持续创作的社区。" })
                                ),
                                createElement("div", { "className": "grid grid-cols-1 md:grid-cols-2 gap-4" },
                                    createElement("label", { "className": "flex flex-col gap-2" },
                                        createElement("span", { "className": "edit-label" },
                                            "个人网站"
                                        ),
                                        createElement("input", { "className": "edit-field rounded-2xl px-4 py-3 font-body-md text-on-surface", "defaultValue": "zfeed.app/mira.zfeed", "type": "text" })
                                    ),
                                    createElement("label", { "className": "flex flex-col gap-2" },
                                        createElement("span", { "className": "edit-label" },
                                            "邮箱"
                                        ),
                                        createElement("input", { "className": "edit-field rounded-2xl px-4 py-3 font-body-md text-on-surface", "defaultValue": "mira@zfeed.app", "type": "email" })
                                    )
                                ),
                                createElement("div", { "className": "flex flex-col gap-3" },
                                    createElement("span", { "className": "edit-label" },
                                        "关注领域"
                                    ),
                                    createElement("div", { "className": "flex flex-wrap gap-2" },
                                        createElement("span", { "className": "edit-chip rounded-full px-3 py-1.5 font-label-sm text-primary" },
                                            "# UI 设计"
                                        ),
                                        createElement("span", { "className": "edit-chip rounded-full px-3 py-1.5 font-label-sm text-primary" },
                                            "# 创作者经济"
                                        ),
                                        createElement("span", { "className": "edit-chip rounded-full px-3 py-1.5 font-label-sm text-primary" },
                                            "# 知识社区"
                                        ),
                                        createElement("button", { "className": "edit-chip rounded-full px-3 py-1.5 font-label-sm text-on-surface-variant flex items-center gap-1", "type": "button" },
                                            createElement("span", { "className": "material-symbols-outlined text-[16px]" },
                                                "add"
                                            ),
                                            "\n                            添加\n                        "
                                        )
                                    )
                                )
                            ),
                            createElement("aside", { "className": "glass-panel rounded-3xl p-5 h-fit" },
                                createElement("div", { "className": "font-headline-md text-on-surface mb-4" },
                                    "主页预览"
                                ),
                                createElement("div", { "className": "flex items-center gap-3" },
                                    createElement("img", { "alt": "Mira Chen", "className": "w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover", "src": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2WuyVTcm_5B9RRybna_LVQrlLy_WxGL5XlBe5mwsnpiXEMqm659guA4lMJTK4UxMdageAf1TDs-L1AxY0Pyet1sw6Gt9bFKPqlmRAGBGVZTFSa8rcM4dqhY168MAKLXSk-uBA8cNTXdk2tHU0bTidPBlbcnn53QTqxLHVpX3ncbmXw-VqULqMGrHK0jVs2DFCdMPPDvUNhSMraLFPOKFaYOwbxG7AZ9zP3UCZmjG56hYLmnhtsyZt6X2OYb5mSbVj04nidzbV1Y8" }),
                                    createElement("div", null,
                                        createElement("div", { "className": "font-headline-md text-[17px] text-on-surface" },
                                            "Mira Chen"
                                        ),
                                        createElement("div", { "className": "font-meta-xs text-on-surface-variant mt-1" },
                                            "@mira.zfeed"
                                        )
                                    )
                                ),
                                createElement("p", { "className": "font-body-md text-on-surface-variant mt-4" },
                                    "关注创作者工具、液态玻璃界面和高质量信息流体验。正在把 zfeed 打磨成一个适合深度阅读和持续创作的社区。"
                                ),
                                createElement("div", { "className": "flex flex-wrap gap-2 mt-4" },
                                    createElement("span", { "className": "px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-[11px]" },
                                        "# UI 设计"
                                    ),
                                    createElement("span", { "className": "px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-[11px]" },
                                        "# 创作者经济"
                                    ),
                                    createElement("span", { "className": "px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-[11px]" },
                                        "# 知识社区"
                                    )
                                ),
                                createElement("div", { "className": "border-t border-white/30 mt-5 pt-4 flex items-center justify-between text-on-surface-variant" },
                                    createElement("span", { "className": "font-label-sm" },
                                        "公开可见"
                                    ),
                                    createElement("span", { "className": "material-symbols-outlined text-primary" },
                                        "visibility"
                                    )
                                )
                            )
                        ),
                        createElement("section", { "className": "glass-panel rounded-3xl p-5" },
                            createElement("div", { "className": "flex items-center justify-between gap-4" },
                                createElement("div", null,
                                    createElement("div", { "className": "font-headline-md text-on-surface" },
                                        "账号安全"
                                    ),
                                    createElement("div", { "className": "font-body-md text-on-surface-variant mt-1" },
                                        "管理登录邮箱、双重验证和资料可见范围。"
                                    )
                                ),
                                createElement("button", { "className": "glass-button-ghost text-primary border-primary/20 font-label-sm px-4 py-2 rounded-full active:scale-95 transition-all duration-300" },
                                    "管理"
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
    );
}
