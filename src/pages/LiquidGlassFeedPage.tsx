import { createElement } from "react";
import { PageShell } from "../runtime/PageShell";

const styles = ":root {\n      color-scheme: light;\n      --ink: #17202a;\n      --ink-soft: #516071;\n      --ink-muted: #778394;\n      --glass: rgba(255, 255, 255, 0.50);\n      --glass-strong: rgba(255, 255, 255, 0.68);\n      --glass-soft: rgba(255, 255, 255, 0.34);\n      --line: rgba(255, 255, 255, 0.76);\n      --line-cool: rgba(138, 168, 204, 0.24);\n      --blue: #2f65ff;\n      --cyan: #24a9c8;\n      --mint: #39b894;\n      --violet: #8268d9;\n      --rose: #ef5c80;\n      --amber: #cf8a12;\n      --shadow: 0 24px 70px rgba(54, 83, 121, 0.18);\n      --shadow-soft: 0 12px 36px rgba(60, 88, 126, 0.13);\n      --blur: blur(32px) saturate(1.34);\n      --radius-panel: 28px;\n      --radius-card: 24px;\n      --radius-control: 999px;\n      --max: 1520px;\n      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI\", sans-serif;\n    }\n\n    * {\n      box-sizing: border-box;\n    }\n\n    html {\n      min-height: 100%;\n      scroll-behavior: smooth;\n    }\n\n    body {\n      margin: 0;\n      min-height: 100vh;\n      color: var(--ink);\n      background:\n        linear-gradient(125deg, rgba(248, 252, 255, 0.96) 0%, rgba(232, 244, 249, 0.96) 34%, rgba(247, 244, 255, 0.94) 70%, rgba(250, 253, 255, 0.98) 100%);\n      overflow-x: hidden;\n    }\n\n    body::before,\n    body::after {\n      content: \"\";\n      position: fixed;\n      inset: 0;\n      z-index: -2;\n      pointer-events: none;\n    }\n\n    body::before {\n      background:\n        linear-gradient(118deg, rgba(70, 148, 255, 0.20), transparent 32%),\n        linear-gradient(252deg, rgba(65, 207, 190, 0.18), transparent 34%),\n        linear-gradient(18deg, transparent 54%, rgba(153, 126, 224, 0.14) 84%),\n        linear-gradient(180deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.12));\n      filter: blur(28px);\n      transform: scale(1.04);\n    }\n\n    body::after {\n      z-index: -1;\n      opacity: 0.24;\n      background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E\");\n      mix-blend-mode: soft-light;\n    }\n\n    button,\n    input {\n      font: inherit;\n    }\n\n    button {\n      cursor: pointer;\n      border: 0;\n    }\n\n    a {\n      color: inherit;\n      text-decoration: none;\n    }\n\n    img {\n      display: block;\n      max-width: 100%;\n    }\n\n    .glass {\n      position: relative;\n      overflow: hidden;\n      background:\n        linear-gradient(145deg, rgba(255, 255, 255, 0.70), rgba(255, 255, 255, 0.36)),\n        var(--glass);\n      backdrop-filter: var(--blur);\n      -webkit-backdrop-filter: var(--blur);\n      border: 1px solid var(--line);\n      box-shadow:\n        inset 0 1px 0 rgba(255, 255, 255, 0.82),\n        inset 0 -1px 0 rgba(90, 132, 181, 0.10),\n        var(--shadow-soft);\n    }\n\n    .glass::before {\n      content: \"\";\n      position: absolute;\n      inset: 0;\n      pointer-events: none;\n      background:\n        linear-gradient(115deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.16) 23%, transparent 44%),\n        linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 44%);\n      opacity: 0.82;\n    }\n\n    .glass::after {\n      content: \"\";\n      position: absolute;\n      inset: 1px;\n      pointer-events: none;\n      border-radius: inherit;\n      box-shadow:\n        inset 1px 1px 1px rgba(255, 255, 255, 0.66),\n        inset -1px -1px 1px rgba(89, 126, 168, 0.08);\n    }\n\n    .surface {\n      position: relative;\n      z-index: 1;\n    }\n\n    .icon {\n      width: 18px;\n      height: 18px;\n      stroke-width: 1.8;\n    }\n\n    .icon-btn {\n      width: 42px;\n      height: 42px;\n      display: inline-grid;\n      place-items: center;\n      color: #324258;\n      border-radius: var(--radius-control);\n      background: rgba(255, 255, 255, 0.34);\n      border: 1px solid rgba(255, 255, 255, 0.68);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74), 0 10px 22px rgba(63, 90, 126, 0.10);\n      transition: transform 180ms ease, background 180ms ease, color 180ms ease, box-shadow 180ms ease;\n    }\n\n    .icon-btn:hover {\n      transform: translateY(-2px);\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.62);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88), 0 18px 34px rgba(63, 90, 126, 0.16);\n    }\n\n    .icon-btn.active {\n      color: var(--blue);\n      background: rgba(47, 101, 255, 0.12);\n      border-color: rgba(47, 101, 255, 0.22);\n    }\n\n    .topbar {\n      position: fixed;\n      top: 16px;\n      left: 50%;\n      transform: translateX(-50%);\n      z-index: 30;\n      width: min(calc(100vw - 32px), var(--max));\n      border-radius: 30px;\n    }\n\n    .topbar-inner {\n      position: relative;\n      z-index: 2;\n      display: grid;\n      grid-template-columns: 190px minmax(280px, 1fr) auto auto;\n      align-items: center;\n      gap: 14px;\n      padding: 11px 12px 11px 16px;\n    }\n\n    .brand {\n      display: inline-flex;\n      align-items: center;\n      gap: 10px;\n      min-width: 0;\n    }\n\n    .brand-mark {\n      width: 38px;\n      height: 38px;\n      display: grid;\n      place-items: center;\n      border-radius: 15px;\n      color: white;\n      font-weight: 800;\n      background:\n        linear-gradient(145deg, rgba(255, 255, 255, 0.36), transparent 38%),\n        linear-gradient(135deg, #2f65ff, #24a9c8 58%, #8268d9);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.56), 0 14px 26px rgba(47, 101, 255, 0.24);\n    }\n\n    .brand-copy {\n      display: flex;\n      flex-direction: column;\n      line-height: 1.05;\n    }\n\n    .brand-name {\n      font-size: 16px;\n      font-weight: 800;\n      letter-spacing: 0;\n    }\n\n    .brand-meta {\n      margin-top: 3px;\n      color: var(--ink-muted);\n      font-size: 11px;\n      letter-spacing: 0;\n    }\n\n    .search-wrap {\n      position: relative;\n      min-width: 0;\n    }\n\n    .search-box {\n      position: relative;\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      min-height: 46px;\n      padding: 0 14px;\n      border-radius: var(--radius-control);\n      background: rgba(255, 255, 255, 0.46);\n      border: 1px solid rgba(255, 255, 255, 0.74);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.80), inset 0 -1px 0 rgba(72, 115, 166, 0.08);\n      transition: background 180ms ease, box-shadow 180ms ease, border-color 180ms ease;\n    }\n\n    .search-wrap.focused .search-box,\n    .search-box:focus-within {\n      background: rgba(255, 255, 255, 0.76);\n      border-color: rgba(47, 101, 255, 0.24);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 0 0 4px rgba(47, 101, 255, 0.08), 0 18px 36px rgba(47, 101, 255, 0.12);\n    }\n\n    .search-box input {\n      width: 100%;\n      min-width: 0;\n      border: 0;\n      outline: 0;\n      color: var(--ink);\n      background: transparent;\n      font-size: 14px;\n    }\n\n    .search-box input::placeholder {\n      color: #7d8898;\n    }\n\n    .search-suggestions {\n      position: absolute;\n      top: calc(100% + 10px);\n      left: 0;\n      right: 0;\n      z-index: 40;\n      display: grid;\n      gap: 8px;\n      padding: 10px;\n      border-radius: 22px;\n      opacity: 0;\n      pointer-events: none;\n      transform: translateY(-5px);\n      transition: opacity 160ms ease, transform 160ms ease;\n    }\n\n    .search-wrap.focused .search-suggestions,\n    .search-wrap:focus-within .search-suggestions {\n      opacity: 1;\n      pointer-events: auto;\n      transform: translateY(0);\n    }\n\n    .suggestion {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 10px;\n      padding: 10px 12px;\n      border-radius: 16px;\n      background: rgba(255, 255, 255, 0.36);\n      color: var(--ink-soft);\n      font-size: 13px;\n    }\n\n    .suggestion strong {\n      color: var(--ink);\n      font-weight: 700;\n    }\n\n    .channels {\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      padding: 4px;\n      border-radius: var(--radius-control);\n      background: rgba(255, 255, 255, 0.34);\n      border: 1px solid rgba(255, 255, 255, 0.58);\n    }\n\n    .channel {\n      min-height: 34px;\n      padding: 0 13px;\n      border-radius: var(--radius-control);\n      color: var(--ink-soft);\n      background: transparent;\n      font-size: 13px;\n      font-weight: 700;\n      white-space: nowrap;\n      transition: color 180ms ease, background 180ms ease, box-shadow 180ms ease;\n    }\n\n    .channel.active,\n    .channel:hover {\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.72);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86), 0 9px 20px rgba(47, 101, 255, 0.10);\n    }\n\n    .top-actions {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n\n    .notif {\n      position: relative;\n    }\n\n    .notif::before {\n      content: \"3\";\n      position: absolute;\n      top: 4px;\n      right: 3px;\n      z-index: 2;\n      min-width: 17px;\n      height: 17px;\n      padding: 0 4px;\n      display: grid;\n      place-items: center;\n      border-radius: var(--radius-control);\n      color: white;\n      background: linear-gradient(135deg, #ef5c80, #f08a5c);\n      font-size: 10px;\n      font-weight: 800;\n      border: 2px solid rgba(255, 255, 255, 0.72);\n    }\n\n    .publish {\n      min-height: 44px;\n      display: inline-flex;\n      align-items: center;\n      gap: 8px;\n      padding: 0 16px;\n      border-radius: var(--radius-control);\n      color: white;\n      font-weight: 800;\n      background:\n        linear-gradient(145deg, rgba(255, 255, 255, 0.32), transparent 34%),\n        linear-gradient(135deg, #2f65ff, #24a9c8);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.50), 0 18px 32px rgba(47, 101, 255, 0.24);\n      transition: transform 180ms ease, box-shadow 180ms ease;\n    }\n\n    .publish:hover {\n      transform: translateY(-2px);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58), 0 24px 42px rgba(47, 101, 255, 0.30);\n    }\n\n    .avatar {\n      width: 42px;\n      height: 42px;\n      flex: 0 0 auto;\n      object-fit: cover;\n      border-radius: 50%;\n      border: 2px solid rgba(255, 255, 255, 0.74);\n      box-shadow: 0 10px 22px rgba(54, 83, 121, 0.14);\n    }\n\n    .avatar.sm {\n      width: 34px;\n      height: 34px;\n      border-width: 1px;\n    }\n\n    .avatar.lg {\n      width: 48px;\n      height: 48px;\n    }\n\n    .app-shell {\n      width: min(calc(100vw - 32px), var(--max));\n      margin: 0 auto;\n      padding: 96px 0 42px;\n      display: grid;\n      grid-template-columns: 248px minmax(0, 1fr) 340px;\n      gap: 18px;\n      align-items: start;\n    }\n\n    .sidebar,\n    .rightbar {\n      position: sticky;\n      top: 96px;\n      display: grid;\n      gap: 14px;\n      align-self: start;\n    }\n\n    .panel {\n      border-radius: var(--radius-panel);\n      padding: 16px;\n    }\n\n    .nav-section + .nav-section {\n      margin-top: 16px;\n      padding-top: 14px;\n      border-top: 1px solid rgba(110, 137, 171, 0.12);\n    }\n\n    .section-label {\n      margin: 0 0 10px;\n      color: var(--ink-muted);\n      font-size: 11px;\n      font-weight: 800;\n      letter-spacing: 0;\n      text-transform: uppercase;\n    }\n\n    .nav-list {\n      display: grid;\n      gap: 5px;\n      margin: 0;\n      padding: 0;\n      list-style: none;\n    }\n\n    .nav-item {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      min-height: 42px;\n      padding: 0 11px;\n      border-radius: 16px;\n      color: var(--ink-soft);\n      font-size: 14px;\n      font-weight: 700;\n      transition: background 180ms ease, color 180ms ease, transform 180ms ease;\n    }\n\n    .nav-item:hover,\n    .nav-item.active {\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.60);\n      transform: translateX(2px);\n    }\n\n    .nav-item.active {\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.80), 0 10px 22px rgba(47, 101, 255, 0.10);\n    }\n\n    .count {\n      margin-left: auto;\n      min-width: 24px;\n      height: 22px;\n      display: grid;\n      place-items: center;\n      padding: 0 7px;\n      border-radius: var(--radius-control);\n      color: var(--ink-soft);\n      background: rgba(255, 255, 255, 0.58);\n      font-size: 11px;\n      font-weight: 800;\n    }\n\n    .dot {\n      width: 8px;\n      height: 8px;\n      border-radius: 50%;\n      background: var(--blue);\n      box-shadow: 0 0 0 4px rgba(47, 101, 255, 0.10);\n    }\n\n    .dot.mint {\n      background: var(--mint);\n      box-shadow: 0 0 0 4px rgba(57, 184, 148, 0.10);\n    }\n\n    .dot.violet {\n      background: var(--violet);\n      box-shadow: 0 0 0 4px rgba(130, 104, 217, 0.10);\n    }\n\n    .dot.rose {\n      background: var(--rose);\n      box-shadow: 0 0 0 4px rgba(239, 92, 128, 0.10);\n    }\n\n    .tag-cloud {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n\n    .tag {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      min-height: 30px;\n      padding: 0 10px;\n      border-radius: var(--radius-control);\n      color: var(--ink-soft);\n      background: rgba(255, 255, 255, 0.42);\n      border: 1px solid rgba(255, 255, 255, 0.58);\n      font-size: 12px;\n      font-weight: 700;\n    }\n\n    .mini-profile {\n      display: flex;\n      align-items: center;\n      gap: 11px;\n      margin-top: 14px;\n      padding: 12px;\n      border-radius: 20px;\n      background: rgba(255, 255, 255, 0.38);\n      border: 1px solid rgba(255, 255, 255, 0.58);\n    }\n\n    .mini-profile strong {\n      display: block;\n      font-size: 13px;\n    }\n\n    .mini-profile span {\n      color: var(--ink-muted);\n      font-size: 12px;\n    }\n\n    .feed {\n      display: grid;\n      gap: 16px;\n      min-width: 0;\n    }\n\n    .feed-toolbar {\n      border-radius: var(--radius-panel);\n      padding: 14px;\n    }\n\n    .toolbar-row {\n      position: relative;\n      z-index: 2;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 14px;\n    }\n\n    .toolbar-title {\n      min-width: 0;\n    }\n\n    .toolbar-title h1 {\n      margin: 0;\n      font-size: 22px;\n      line-height: 1.2;\n      letter-spacing: 0;\n    }\n\n    .toolbar-title p {\n      margin: 4px 0 0;\n      color: var(--ink-muted);\n      font-size: 13px;\n    }\n\n    .segmented {\n      display: flex;\n      gap: 4px;\n      padding: 4px;\n      border-radius: var(--radius-control);\n      background: rgba(255, 255, 255, 0.40);\n      border: 1px solid rgba(255, 255, 255, 0.58);\n    }\n\n    .segment {\n      min-height: 34px;\n      padding: 0 12px;\n      border-radius: var(--radius-control);\n      color: var(--ink-soft);\n      background: transparent;\n      font-size: 12px;\n      font-weight: 800;\n      white-space: nowrap;\n    }\n\n    .segment.active {\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.72);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82), 0 8px 16px rgba(47, 101, 255, 0.10);\n    }\n\n    .composer {\n      border-radius: var(--radius-panel);\n      padding: 14px;\n    }\n\n    .composer-inner {\n      position: relative;\n      z-index: 2;\n      display: grid;\n      grid-template-columns: auto minmax(0, 1fr) auto;\n      gap: 12px;\n      align-items: center;\n    }\n\n    .composer-field {\n      min-height: 46px;\n      display: flex;\n      align-items: center;\n      padding: 0 15px;\n      border-radius: var(--radius-control);\n      color: var(--ink-muted);\n      background: rgba(255, 255, 255, 0.42);\n      border: 1px solid rgba(255, 255, 255, 0.60);\n      font-size: 14px;\n    }\n\n    .composer-tools {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n\n    .feed-card {\n      border-radius: var(--radius-card);\n      padding: 18px;\n      transition: transform 210ms ease, box-shadow 210ms ease, border-color 210ms ease;\n    }\n\n    .feed-card:hover {\n      transform: translateY(-5px);\n      border-color: rgba(255, 255, 255, 0.92);\n      box-shadow:\n        inset 0 1px 0 rgba(255, 255, 255, 0.86),\n        inset 0 -1px 0 rgba(90, 132, 181, 0.10),\n        0 30px 80px rgba(54, 83, 121, 0.21);\n    }\n\n    .card-head {\n      position: relative;\n      z-index: 2;\n      display: flex;\n      justify-content: space-between;\n      gap: 14px;\n      margin-bottom: 14px;\n    }\n\n    .author {\n      display: flex;\n      align-items: center;\n      gap: 11px;\n      min-width: 0;\n    }\n\n    .author-meta {\n      min-width: 0;\n    }\n\n    .author-line {\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      min-width: 0;\n    }\n\n    .author-line strong {\n      font-size: 14px;\n      letter-spacing: 0;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .verify {\n      display: inline-grid;\n      place-items: center;\n      width: 16px;\n      height: 16px;\n      border-radius: 50%;\n      color: white;\n      background: linear-gradient(135deg, var(--blue), var(--cyan));\n      box-shadow: 0 6px 12px rgba(47, 101, 255, 0.22);\n    }\n\n    .verify svg {\n      width: 11px;\n      height: 11px;\n      stroke-width: 3;\n    }\n\n    .meta {\n      margin-top: 3px;\n      color: var(--ink-muted);\n      font-size: 12px;\n      line-height: 1.25;\n    }\n\n    .card-body {\n      position: relative;\n      z-index: 2;\n    }\n\n    .card-body h2 {\n      margin: 0 0 9px;\n      font-size: 21px;\n      line-height: 1.26;\n      letter-spacing: 0;\n    }\n\n    .card-body p {\n      margin: 0;\n      color: var(--ink-soft);\n      font-size: 15px;\n      line-height: 1.66;\n    }\n\n    .content-tags {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 8px;\n      margin-top: 14px;\n    }\n\n    .media {\n      position: relative;\n      margin-top: 15px;\n      overflow: hidden;\n      border-radius: 22px;\n      border: 1px solid rgba(255, 255, 255, 0.66);\n      background: rgba(255, 255, 255, 0.28);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68), 0 18px 36px rgba(46, 75, 112, 0.13);\n    }\n\n    .media img {\n      width: 100%;\n      height: 310px;\n      object-fit: cover;\n    }\n\n    .media-overlay {\n      position: absolute;\n      left: 14px;\n      right: 14px;\n      bottom: 14px;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 12px;\n      padding: 10px 12px;\n      border-radius: 18px;\n      color: #f8fbff;\n      background: rgba(20, 32, 50, 0.34);\n      backdrop-filter: blur(22px) saturate(1.2);\n      -webkit-backdrop-filter: blur(22px) saturate(1.2);\n      border: 1px solid rgba(255, 255, 255, 0.28);\n    }\n\n    .media-overlay span {\n      font-size: 12px;\n      font-weight: 700;\n    }\n\n    .media-grid {\n      display: grid;\n      grid-template-columns: 1.25fr 0.75fr;\n      gap: 8px;\n      padding: 8px;\n    }\n\n    .media-grid img {\n      height: 100%;\n      min-height: 138px;\n      border-radius: 16px;\n      object-fit: cover;\n    }\n\n    .media-grid img:first-child {\n      grid-row: span 2;\n      min-height: 286px;\n    }\n\n    .video-badge {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      padding: 7px 10px;\n      border-radius: var(--radius-control);\n      background: rgba(255, 255, 255, 0.24);\n      border: 1px solid rgba(255, 255, 255, 0.26);\n      color: white;\n      font-size: 12px;\n      font-weight: 800;\n    }\n\n    .play-control {\n      width: 46px;\n      height: 46px;\n      display: grid;\n      place-items: center;\n      border-radius: 50%;\n      color: white;\n      background: rgba(255, 255, 255, 0.22);\n      border: 1px solid rgba(255, 255, 255, 0.32);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.32);\n    }\n\n    .link-preview {\n      margin-top: 15px;\n      display: grid;\n      grid-template-columns: 156px minmax(0, 1fr);\n      gap: 14px;\n      padding: 10px;\n      border-radius: 22px;\n      background: rgba(255, 255, 255, 0.38);\n      border: 1px solid rgba(255, 255, 255, 0.62);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.62);\n    }\n\n    .link-preview img {\n      width: 100%;\n      height: 112px;\n      object-fit: cover;\n      border-radius: 16px;\n    }\n\n    .link-preview small {\n      color: var(--blue);\n      font-size: 12px;\n      font-weight: 800;\n    }\n\n    .link-preview h3 {\n      margin: 8px 0 5px;\n      font-size: 16px;\n      line-height: 1.35;\n      letter-spacing: 0;\n    }\n\n    .link-preview p {\n      color: var(--ink-muted);\n      font-size: 13px;\n      line-height: 1.5;\n    }\n\n    .actions {\n      position: relative;\n      z-index: 2;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 12px;\n      margin-top: 16px;\n      padding-top: 14px;\n      border-top: 1px solid rgba(110, 137, 171, 0.12);\n    }\n\n    .action-group {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      min-width: 0;\n    }\n\n    .action {\n      min-height: 38px;\n      display: inline-flex;\n      align-items: center;\n      gap: 7px;\n      padding: 0 10px;\n      border-radius: var(--radius-control);\n      color: var(--ink-soft);\n      background: rgba(255, 255, 255, 0.36);\n      border: 1px solid rgba(255, 255, 255, 0.56);\n      font-size: 12px;\n      font-weight: 800;\n      transition: color 180ms ease, background 180ms ease, transform 180ms ease;\n    }\n\n    .action:hover {\n      transform: translateY(-2px);\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.62);\n    }\n\n    .action.selected {\n      color: var(--blue);\n      background: rgba(47, 101, 255, 0.12);\n      border-color: rgba(47, 101, 255, 0.22);\n    }\n\n    .action.bookmarked {\n      color: var(--violet);\n      background: rgba(130, 104, 217, 0.12);\n      border-color: rgba(130, 104, 217, 0.22);\n    }\n\n    .side-card {\n      border-radius: var(--radius-panel);\n      padding: 16px;\n    }\n\n    .card-title {\n      position: relative;\n      z-index: 2;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 12px;\n      margin-bottom: 14px;\n    }\n\n    .card-title h2,\n    .card-title h3 {\n      margin: 0;\n      font-size: 16px;\n      letter-spacing: 0;\n    }\n\n    .card-title span {\n      color: var(--ink-muted);\n      font-size: 12px;\n      font-weight: 800;\n    }\n\n    .trend-list,\n    .follow-list,\n    .live-list {\n      position: relative;\n      z-index: 2;\n      display: grid;\n      gap: 8px;\n      margin: 0;\n      padding: 0;\n      list-style: none;\n    }\n\n    .trend-item {\n      display: grid;\n      grid-template-columns: 30px minmax(0, 1fr) auto;\n      align-items: center;\n      gap: 10px;\n      padding: 10px;\n      border-radius: 18px;\n      background: rgba(255, 255, 255, 0.36);\n      border: 1px solid rgba(255, 255, 255, 0.52);\n    }\n\n    .rank {\n      width: 28px;\n      height: 28px;\n      display: grid;\n      place-items: center;\n      border-radius: 11px;\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.62);\n      font-weight: 900;\n      font-size: 13px;\n    }\n\n    .trend-copy {\n      min-width: 0;\n    }\n\n    .trend-copy strong {\n      display: block;\n      font-size: 13px;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .trend-copy small {\n      display: block;\n      margin-top: 3px;\n      color: var(--ink-muted);\n      font-size: 11px;\n    }\n\n    .trend-state {\n      display: inline-flex;\n      align-items: center;\n      gap: 4px;\n      color: var(--mint);\n      font-size: 11px;\n      font-weight: 900;\n    }\n\n    .trend-state.down {\n      color: var(--rose);\n    }\n\n    .trend-state.new {\n      color: var(--violet);\n    }\n\n    .follow-item {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 12px;\n      padding: 8px 0;\n    }\n\n    .follow-person {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      min-width: 0;\n    }\n\n    .follow-person strong {\n      display: block;\n      font-size: 13px;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .follow-person span {\n      display: block;\n      margin-top: 3px;\n      color: var(--ink-muted);\n      font-size: 11px;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .follow-btn {\n      min-height: 32px;\n      padding: 0 12px;\n      flex: 0 0 auto;\n      border-radius: var(--radius-control);\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.46);\n      border: 1px solid rgba(47, 101, 255, 0.18);\n      font-size: 12px;\n      font-weight: 900;\n    }\n\n    .stats-grid {\n      position: relative;\n      z-index: 2;\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      gap: 10px;\n    }\n\n    .stat {\n      min-height: 88px;\n      padding: 13px;\n      border-radius: 20px;\n      background: rgba(255, 255, 255, 0.36);\n      border: 1px solid rgba(255, 255, 255, 0.54);\n    }\n\n    .stat strong {\n      display: block;\n      font-size: 20px;\n      letter-spacing: 0;\n    }\n\n    .stat span {\n      display: block;\n      margin-top: 5px;\n      color: var(--ink-muted);\n      font-size: 11px;\n      font-weight: 800;\n    }\n\n    .spark {\n      position: relative;\n      z-index: 2;\n      height: 78px;\n      margin-top: 12px;\n      display: flex;\n      align-items: end;\n      gap: 7px;\n      padding: 12px;\n      border-radius: 20px;\n      background: rgba(255, 255, 255, 0.32);\n      border: 1px solid rgba(255, 255, 255, 0.52);\n    }\n\n    .spark i {\n      flex: 1;\n      min-width: 0;\n      border-radius: 9px 9px 5px 5px;\n      background:\n        linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent),\n        linear-gradient(180deg, rgba(47, 101, 255, 0.68), rgba(36, 169, 200, 0.30));\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.44);\n    }\n\n    .live-row {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      padding: 10px;\n      border-radius: 18px;\n      background: rgba(255, 255, 255, 0.32);\n      border: 1px solid rgba(255, 255, 255, 0.50);\n    }\n\n    .pulse {\n      width: 10px;\n      height: 10px;\n      flex: 0 0 auto;\n      border-radius: 50%;\n      background: var(--mint);\n      box-shadow: 0 0 0 6px rgba(57, 184, 148, 0.12);\n    }\n\n    .live-row strong {\n      display: block;\n      font-size: 13px;\n    }\n\n    .live-row span {\n      color: var(--ink-muted);\n      font-size: 11px;\n    }\n\n    .bottom-tabs {\n      position: fixed;\n      left: 12px;\n      right: 12px;\n      bottom: 12px;\n      z-index: 35;\n      display: none;\n      grid-template-columns: repeat(5, 1fr);\n      gap: 6px;\n      padding: 8px;\n      border-radius: 28px;\n    }\n\n    .tab {\n      min-height: 44px;\n      display: grid;\n      place-items: center;\n      color: var(--ink-muted);\n      border-radius: 18px;\n      background: transparent;\n    }\n\n    .tab.active {\n      color: var(--blue);\n      background: rgba(255, 255, 255, 0.62);\n      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78);\n    }\n\n    @media (max-width: 1240px) {\n      .topbar-inner {\n        grid-template-columns: 170px minmax(240px, 1fr) auto;\n      }\n\n      .channels {\n        display: none;\n      }\n\n      .app-shell {\n        grid-template-columns: 232px minmax(0, 1fr);\n      }\n\n      .rightbar {\n        display: none;\n      }\n    }\n\n    @media (max-width: 900px) {\n      .topbar {\n        top: 10px;\n        width: calc(100vw - 20px);\n        border-radius: 26px;\n      }\n\n      .topbar-inner {\n        grid-template-columns: auto minmax(0, 1fr) auto;\n        gap: 10px;\n        padding: 10px;\n      }\n\n      .brand-copy,\n      .top-actions .icon-btn:nth-child(2),\n      .top-actions .avatar,\n      .publish span {\n        display: none;\n      }\n\n      .brand-mark {\n        width: 40px;\n        height: 40px;\n      }\n\n      .search-box {\n        min-height: 42px;\n      }\n\n      .search-suggestions {\n        display: none;\n      }\n\n      .publish {\n        width: 42px;\n        min-height: 42px;\n        justify-content: center;\n        padding: 0;\n      }\n\n      .app-shell {\n        width: min(calc(100vw - 20px), 720px);\n        grid-template-columns: minmax(0, 1fr);\n        padding-top: 84px;\n        padding-bottom: 92px;\n      }\n\n      .sidebar {\n        display: none;\n      }\n\n      .bottom-tabs {\n        display: grid;\n      }\n\n      .toolbar-row,\n      .composer-inner {\n        grid-template-columns: 1fr;\n      }\n\n      .toolbar-row {\n        align-items: stretch;\n        flex-direction: column;\n      }\n\n      .segmented {\n        width: 100%;\n        justify-content: flex-start;\n        overflow-x: auto;\n        scrollbar-width: none;\n      }\n\n      .segmented::-webkit-scrollbar {\n        display: none;\n      }\n\n      .segment {\n        flex: 0 0 auto;\n        min-width: 72px;\n      }\n\n      .composer-inner {\n        display: flex;\n      }\n\n      .composer-tools .icon-btn:nth-child(2),\n      .composer-tools .icon-btn:nth-child(3) {\n        display: none;\n      }\n    }\n\n    @media (max-width: 640px) {\n      .topbar-inner {\n        grid-template-columns: auto minmax(0, 1fr) auto;\n      }\n\n      .search-box input {\n        font-size: 13px;\n      }\n\n      .top-actions .notif {\n        display: none;\n      }\n\n      .feed-card,\n      .panel,\n      .feed-toolbar,\n      .composer {\n        border-radius: 22px;\n        padding: 14px;\n      }\n\n      .card-body h2 {\n        font-size: 18px;\n      }\n\n      .card-body p {\n        font-size: 14px;\n      }\n\n      .media img {\n        height: 230px;\n      }\n\n      .media-grid {\n        grid-template-columns: 1fr;\n      }\n\n      .media-grid img,\n      .media-grid img:first-child {\n        min-height: 180px;\n        height: 180px;\n        grid-row: auto;\n      }\n\n      .link-preview {\n        grid-template-columns: 1fr;\n      }\n\n      .link-preview img {\n        height: 170px;\n      }\n\n      .actions {\n        align-items: stretch;\n      }\n\n      .action-group {\n        width: 100%;\n        justify-content: space-between;\n        gap: 6px;\n      }\n\n      .action {\n        flex: 1;\n        justify-content: center;\n        padding: 0 8px;\n      }\n\n      .action span {\n        display: none;\n      }\n\n      .action:last-child span,\n      .action.selected span,\n      .action.bookmarked span {\n        display: inline;\n      }\n    }";

export function LiquidGlassFeedPage() {
    return createElement(
        PageShell,
        { title: "Cirra Liquid Glass Feed", htmlClass: "light", bodyClass: "", styles },
        createElement("div", { "className": "page-root" },
            createElement("header", { "className": "topbar glass", "aria-label": "顶部导航" },
                createElement("div", { "className": "topbar-inner" },
                    createElement("a", { "className": "brand", "href": "#", "aria-label": "Cirra 首页" },
                        createElement("span", { "className": "brand-mark" },
                            "C"
                        ),
                        createElement("span", { "className": "brand-copy" },
                            createElement("span", { "className": "brand-name" },
                                "Cirra"
                            ),
                            createElement("span", { "className": "brand-meta" },
                                "Creator Intelligence Feed"
                            )
                        )
                    ),
                    createElement("div", { "className": "search-wrap focused" },
                        createElement("label", { "className": "search-box", "aria-label": "全局搜索" },
                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "search", "className": "lucide lucide-search icon", "aria-hidden": "true" },
                                createElement("path", { "d": "m21 21-4.34-4.34" }),
                                createElement("circle", { "cx": "11", "cy": "11", "r": "8" })
                            ),
                            createElement("input", { "defaultValue": "Liquid Glass", "aria-label": "搜索内容、创作者、话题" }),
                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "sparkles", "className": "lucide lucide-sparkles icon", "aria-hidden": "true" },
                                createElement("path", { "d": "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }),
                                createElement("path", { "d": "M20 2v4" }),
                                createElement("path", { "d": "M22 4h-4" }),
                                createElement("circle", { "cx": "4", "cy": "20", "r": "2" })
                            )
                        ),
                        createElement("div", { "className": "search-suggestions glass" },
                            createElement("div", { "className": "suggestion" },
                                createElement("span", null,
                                    createElement("strong", null,
                                        "Liquid Glass"
                                    ),
                                    " 设计系统"
                                ),
                                createElement("small", null,
                                    "话题"
                                )
                            ),
                            createElement("div", { "className": "suggestion" },
                                createElement("span", null,
                                    "iOS Feed 视觉复盘"
                                ),
                                createElement("small", null,
                                    "文章"
                                )
                            ),
                            createElement("div", { "className": "suggestion" },
                                createElement("span", null,
                                    "@Mira Chen"
                                ),
                                createElement("small", null,
                                    "创作者"
                                )
                            )
                        )
                    ),
                    createElement("nav", { "className": "channels", "aria-label": "频道切换" },
                        createElement("button", { "className": "channel active" },
                            "推荐"
                        ),
                        createElement("button", { "className": "channel" },
                            "关注"
                        ),
                        createElement("button", { "className": "channel" },
                            "热门"
                        ),
                        createElement("button", { "className": "channel" },
                            "AI"
                        ),
                        createElement("button", { "className": "channel" },
                            "设计"
                        )
                    ),
                    createElement("div", { "className": "top-actions" },
                        createElement("button", { "className": "icon-btn notif", "title": "通知", "aria-label": "通知" },
                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "bell", "className": "lucide lucide-bell icon" },
                                createElement("path", { "d": "M10.268 21a2 2 0 0 0 3.464 0" }),
                                createElement("path", { "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" })
                            )
                        ),
                        createElement("button", { "className": "icon-btn", "title": "私信", "aria-label": "私信" },
                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "message-circle", "className": "lucide lucide-message-circle icon" },
                                createElement("path", { "d": "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" })
                            )
                        ),
                        createElement("img", { "className": "avatar sm", "alt": "当前用户头像", "src": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80" }),
                        createElement("button", { "className": "publish", "aria-label": "发布内容" },
                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "plus", "className": "lucide lucide-plus icon" },
                                createElement("path", { "d": "M5 12h14" }),
                                createElement("path", { "d": "M12 5v14" })
                            ),
                            createElement("span", null,
                                "发布"
                            )
                        )
                    )
                )
            ),
            createElement("div", { "className": "app-shell" },
                createElement("aside", { "className": "sidebar", "aria-label": "左侧导航" },
                    createElement("section", { "className": "panel glass" },
                        createElement("div", { "className": "surface" },
                            createElement("div", { "className": "nav-section" },
                                createElement("p", { "className": "section-label" },
                                    "Explore"
                                ),
                                createElement("ul", { "className": "nav-list" },
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item active", "href": "#" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "sparkles", "className": "lucide lucide-sparkles icon" },
                                                createElement("path", { "d": "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }),
                                                createElement("path", { "d": "M20 2v4" }),
                                                createElement("path", { "d": "M22 4h-4" }),
                                                createElement("circle", { "cx": "4", "cy": "20", "r": "2" })
                                            ),
                                            "推荐",
                                            createElement("span", { "className": "count" },
                                                "42"
                                            )
                                        )
                                    ),
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "users", "className": "lucide lucide-users icon" },
                                                createElement("path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
                                                createElement("path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }),
                                                createElement("path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }),
                                                createElement("circle", { "cx": "9", "cy": "7", "r": "4" })
                                            ),
                                            "关注"
                                        )
                                    ),
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "flame", "className": "lucide lucide-flame icon" },
                                                createElement("path", { "d": "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" })
                                            ),
                                            "热门",
                                            createElement("span", { "className": "count" },
                                                "9"
                                            )
                                        )
                                    ),
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "bookmark", "className": "lucide lucide-bookmark icon" },
                                                createElement("path", { "d": "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" })
                                            ),
                                            "收藏"
                                        )
                                    ),
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "radio", "className": "lucide lucide-radio icon" },
                                                createElement("path", { "d": "M16.247 7.761a6 6 0 0 1 0 8.478" }),
                                                createElement("path", { "d": "M19.075 4.933a10 10 0 0 1 0 14.134" }),
                                                createElement("path", { "d": "M4.925 19.067a10 10 0 0 1 0-14.134" }),
                                                createElement("path", { "d": "M7.753 16.239a6 6 0 0 1 0-8.478" }),
                                                createElement("circle", { "cx": "12", "cy": "12", "r": "2" })
                                            ),
                                            "直播讨论"
                                        )
                                    )
                                )
                            ),
                            createElement("div", { "className": "nav-section" },
                                createElement("p", { "className": "section-label" },
                                    "Channels"
                                ),
                                createElement("ul", { "className": "nav-list" },
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("span", { "className": "dot" }),
                                            "AI 产品"
                                        )
                                    ),
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("span", { "className": "dot mint" }),
                                            "知识社区"
                                        )
                                    ),
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("span", { "className": "dot violet" }),
                                            "界面设计"
                                        )
                                    ),
                                    createElement("li", null,
                                        createElement("a", { "className": "nav-item", "href": "#" },
                                            createElement("span", { "className": "dot rose" }),
                                            "创作者经济"
                                        )
                                    )
                                )
                            ),
                            createElement("div", { "className": "nav-section" },
                                createElement("p", { "className": "section-label" },
                                    "Topics"
                                ),
                                createElement("div", { "className": "tag-cloud" },
                                    createElement("span", { "className": "tag" },
                                        "# LiquidGlass"
                                    ),
                                    createElement("span", { "className": "tag" },
                                        "# Agent工作流"
                                    ),
                                    createElement("span", { "className": "tag" },
                                        "# 设计系统"
                                    ),
                                    createElement("span", { "className": "tag" },
                                        "# 产品观察"
                                    )
                                )
                            ),
                            createElement("div", { "className": "mini-profile" },
                                createElement("img", { "className": "avatar sm", "alt": "创作者头像", "src": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=160&q=80" }),
                                createElement("div", null,
                                    createElement("strong", null,
                                        "Studio Mode"
                                    ),
                                    createElement("span", null,
                                        "今日 18 条创作线索"
                                    )
                                )
                            )
                        )
                    )
                ),
                createElement("main", { "className": "feed", "aria-label": "主信息流" },
                    createElement("section", { "className": "feed-toolbar glass" },
                        createElement("div", { "className": "toolbar-row" },
                            createElement("div", { "className": "toolbar-title" },
                                createElement("h1", null,
                                    "推荐 Feed"
                                ),
                                createElement("p", null,
                                    "创作者、知识社区与趋势资讯的实时内容流"
                                )
                            ),
                            createElement("div", { "className": "segmented", "aria-label": "内容排序" },
                                createElement("button", { "className": "segment active" },
                                    "智能推荐"
                                ),
                                createElement("button", { "className": "segment" },
                                    "最新"
                                ),
                                createElement("button", { "className": "segment" },
                                    "长文"
                                ),
                                createElement("button", { "className": "segment" },
                                    "媒体"
                                )
                            )
                        )
                    ),
                    createElement("section", { "className": "composer glass", "aria-label": "发布入口" },
                        createElement("div", { "className": "composer-inner" },
                            createElement("img", { "className": "avatar", "alt": "当前用户头像", "src": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80" }),
                            createElement("div", { "className": "composer-field" },
                                "分享一个趋势、链接或创作笔记..."
                            ),
                            createElement("div", { "className": "composer-tools" },
                                createElement("button", { "className": "icon-btn", "title": "添加图片", "aria-label": "添加图片" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "image", "className": "lucide lucide-image icon" },
                                        createElement("rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2", "ry": "2" }),
                                        createElement("circle", { "cx": "9", "cy": "9", "r": "2" }),
                                        createElement("path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" })
                                    )
                                ),
                                createElement("button", { "className": "icon-btn", "title": "添加链接", "aria-label": "添加链接" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "link", "className": "lucide lucide-link icon" },
                                        createElement("path", { "d": "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                                        createElement("path", { "d": "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
                                    )
                                ),
                                createElement("button", { "className": "icon-btn", "title": "发起投票", "aria-label": "发起投票" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "list-checks", "className": "lucide lucide-list-checks icon" },
                                        createElement("path", { "d": "M13 5h8" }),
                                        createElement("path", { "d": "M13 12h8" }),
                                        createElement("path", { "d": "M13 19h8" }),
                                        createElement("path", { "d": "m3 17 2 2 4-4" }),
                                        createElement("path", { "d": "m3 7 2 2 4-4" })
                                    )
                                )
                            )
                        )
                    ),
                    createElement("article", { "className": "feed-card glass" },
                        createElement("div", { "className": "card-head" },
                            createElement("div", { "className": "author" },
                                createElement("img", { "className": "avatar lg", "alt": "Mira Chen 头像", "src": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80" }),
                                createElement("div", { "className": "author-meta" },
                                    createElement("div", { "className": "author-line" },
                                        createElement("strong", null,
                                            "Mira Chen"
                                        ),
                                        createElement("span", { "className": "verify" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "check", "className": "lucide lucide-check" },
                                                createElement("path", { "d": "M20 6 9 17l-5-5" })
                                            )
                                        )
                                    ),
                                    createElement("div", { "className": "meta" },
                                        "产品策略作者 · 12 分钟前 · 来自 AI 产品频道"
                                    )
                                )
                            ),
                            createElement("button", { "className": "icon-btn", "title": "更多", "aria-label": "更多操作" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "more-horizontal", "className": "lucide lucide-more-horizontal icon" },
                                    createElement("circle", { "cx": "12", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "19", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "5", "cy": "12", "r": "1" })
                                )
                            )
                        ),
                        createElement("div", { "className": "card-body" },
                            createElement("h2", null,
                                "AI 产品更新后，创作者工作流正在从「工具列表」变成「任务编排」"
                            ),
                            createElement("p", null,
                                "过去一周最明显的变化不是模型能力本身，而是团队开始把写作、检索、剪辑、分发拆成可复用的流程。好的 Feed 产品会把这些流程中的信号重新组织成可读的知识脉络。"
                            ),
                            createElement("div", { "className": "content-tags" },
                                createElement("span", { "className": "tag" },
                                    "# AIProduct"
                                ),
                                createElement("span", { "className": "tag" },
                                    "# Workflow"
                                ),
                                createElement("span", { "className": "tag" },
                                    "# CreatorStack"
                                )
                            ),
                            createElement("div", { "className": "media" },
                                createElement("img", { "alt": "明亮桌面上的创作者工具与笔记本电脑", "src": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=82" }),
                                createElement("div", { "className": "media-overlay" },
                                    createElement("span", null,
                                        "趋势观察 · 7 分钟阅读"
                                    ),
                                    createElement("span", { "className": "video-badge" },
                                        createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "trending-up", "className": "lucide lucide-trending-up icon" },
                                            createElement("path", { "d": "M16 7h6v6" }),
                                            createElement("path", { "d": "m22 7-8.5 8.5-5-5L2 17" })
                                        ),
                                        " 热度 +28%"
                                    )
                                )
                            )
                        ),
                        createElement("div", { "className": "actions" },
                            createElement("div", { "className": "action-group" },
                                createElement("button", { "className": "action selected" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "heart", "className": "lucide lucide-heart icon" },
                                        createElement("path", { "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" })
                                    ),
                                    createElement("span", null,
                                        "2.4k"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "message-square", "className": "lucide lucide-message-square icon" },
                                        createElement("path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" })
                                    ),
                                    createElement("span", null,
                                        "318"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "repeat-2", "className": "lucide lucide-repeat-2 icon" },
                                        createElement("path", { "d": "m2 9 3-3 3 3" }),
                                        createElement("path", { "d": "M13 18H7a2 2 0 0 1-2-2V6" }),
                                        createElement("path", { "d": "m22 15-3 3-3-3" }),
                                        createElement("path", { "d": "M11 6h6a2 2 0 0 1 2 2v10" })
                                    ),
                                    createElement("span", null,
                                        "转发"
                                    )
                                ),
                                createElement("button", { "className": "action bookmarked" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "bookmark", "className": "lucide lucide-bookmark icon" },
                                        createElement("path", { "d": "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" })
                                    ),
                                    createElement("span", null,
                                        "已收藏"
                                    )
                                )
                            ),
                            createElement("button", { "className": "action", "title": "分享" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "send", "className": "lucide lucide-send icon" },
                                    createElement("path", { "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }),
                                    createElement("path", { "d": "m21.854 2.147-10.94 10.939" })
                                ),
                                createElement("span", null,
                                    "分享"
                                )
                            )
                        )
                    ),
                    createElement("article", { "className": "feed-card glass" },
                        createElement("div", { "className": "card-head" },
                            createElement("div", { "className": "author" },
                                createElement("img", { "className": "avatar lg", "alt": "Liam Park 头像", "src": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" }),
                                createElement("div", { "className": "author-meta" },
                                    createElement("div", { "className": "author-line" },
                                        createElement("strong", null,
                                            "Liam Park"
                                        ),
                                        createElement("span", { "className": "verify" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "check", "className": "lucide lucide-check" },
                                                createElement("path", { "d": "M20 6 9 17l-5-5" })
                                            )
                                        )
                                    ),
                                    createElement("div", { "className": "meta" },
                                        "界面设计师 · 35 分钟前 · 图片组"
                                    )
                                )
                            ),
                            createElement("button", { "className": "icon-btn", "title": "更多", "aria-label": "更多操作" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "more-horizontal", "className": "lucide lucide-more-horizontal icon" },
                                    createElement("circle", { "cx": "12", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "19", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "5", "cy": "12", "r": "1" })
                                )
                            )
                        ),
                        createElement("div", { "className": "card-body" },
                            createElement("h2", null,
                                "Liquid Glass 不是把卡片调透明，而是重新设计层级、光线和可读性"
                            ),
                            createElement("p", null,
                                "这组截图记录了 Feed 卡片、搜索浮层、底部 Tab Bar 的材质实验。最稳定的方案是让玻璃只承载控件层，正文区域仍保留足够遮罩。"
                            ),
                            createElement("div", { "className": "content-tags" },
                                createElement("span", { "className": "tag" },
                                    "# LiquidGlass"
                                ),
                                createElement("span", { "className": "tag" },
                                    "# DesignSystem"
                                ),
                                createElement("span", { "className": "tag" },
                                    "# iOS"
                                )
                            ),
                            createElement("div", { "className": "media media-grid" },
                                createElement("img", { "alt": "移动应用玻璃拟态界面设计", "src": "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=900&q=82" }),
                                createElement("img", { "alt": "设计工作区中的界面线框图", "src": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=720&q=82" }),
                                createElement("img", { "alt": "柔和光线下的设计原型屏幕", "src": "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=720&q=82" })
                            )
                        ),
                        createElement("div", { "className": "actions" },
                            createElement("div", { "className": "action-group" },
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "heart", "className": "lucide lucide-heart icon" },
                                        createElement("path", { "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" })
                                    ),
                                    createElement("span", null,
                                        "948"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "message-square", "className": "lucide lucide-message-square icon" },
                                        createElement("path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" })
                                    ),
                                    createElement("span", null,
                                        "86"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "repeat-2", "className": "lucide lucide-repeat-2 icon" },
                                        createElement("path", { "d": "m2 9 3-3 3 3" }),
                                        createElement("path", { "d": "M13 18H7a2 2 0 0 1-2-2V6" }),
                                        createElement("path", { "d": "m22 15-3 3-3-3" }),
                                        createElement("path", { "d": "M11 6h6a2 2 0 0 1 2 2v10" })
                                    ),
                                    createElement("span", null,
                                        "转发"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "bookmark", "className": "lucide lucide-bookmark icon" },
                                        createElement("path", { "d": "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" })
                                    ),
                                    createElement("span", null,
                                        "收藏"
                                    )
                                )
                            ),
                            createElement("button", { "className": "action", "title": "分享" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "send", "className": "lucide lucide-send icon" },
                                    createElement("path", { "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }),
                                    createElement("path", { "d": "m21.854 2.147-10.94 10.939" })
                                ),
                                createElement("span", null,
                                    "分享"
                                )
                            )
                        )
                    ),
                    createElement("article", { "className": "feed-card glass" },
                        createElement("div", { "className": "card-head" },
                            createElement("div", { "className": "author" },
                                createElement("img", { "className": "avatar lg", "alt": "Rin Studio 头像", "src": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80" }),
                                createElement("div", { "className": "author-meta" },
                                    createElement("div", { "className": "author-line" },
                                        createElement("strong", null,
                                            "Rin Studio"
                                        ),
                                        createElement("span", { "className": "verify" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "check", "className": "lucide lucide-check" },
                                                createElement("path", { "d": "M20 6 9 17l-5-5" })
                                            )
                                        )
                                    ),
                                    createElement("div", { "className": "meta" },
                                        "创作者工具团队 · 1 小时前 · 链接分享"
                                    )
                                )
                            ),
                            createElement("button", { "className": "icon-btn", "title": "更多", "aria-label": "更多操作" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "more-horizontal", "className": "lucide lucide-more-horizontal icon" },
                                    createElement("circle", { "cx": "12", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "19", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "5", "cy": "12", "r": "1" })
                                )
                            )
                        ),
                        createElement("div", { "className": "card-body" },
                            createElement("h2", null,
                                "我们把 1200 篇社区长文压缩成「可追踪趋势图谱」"
                            ),
                            createElement("p", null,
                                "新版本的推荐系统会识别长期主题，而不只看即时热度。它可以把分散讨论、外链、视频片段和评论中的关键判断合并成一条可持续追踪的主题线。"
                            ),
                            createElement("div", { "className": "link-preview" },
                                createElement("img", { "alt": "数据分析看板与社区内容趋势", "src": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=720&q=82" }),
                                createElement("div", null,
                                    createElement("small", null,
                                        "cirra.design/report"
                                    ),
                                    createElement("h3", null,
                                        "Trend Graph for Creator Communities"
                                    ),
                                    createElement("p", null,
                                        "从内容信号、作者关系、转发链路和收藏行为中提取主题势能。"
                                    )
                                )
                            ),
                            createElement("div", { "className": "content-tags" },
                                createElement("span", { "className": "tag" },
                                    "# KnowledgeGraph"
                                ),
                                createElement("span", { "className": "tag" },
                                    "# FeedRanking"
                                ),
                                createElement("span", { "className": "tag" },
                                    "# Community"
                                )
                            )
                        ),
                        createElement("div", { "className": "actions" },
                            createElement("div", { "className": "action-group" },
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "heart", "className": "lucide lucide-heart icon" },
                                        createElement("path", { "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" })
                                    ),
                                    createElement("span", null,
                                        "1.1k"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "message-square", "className": "lucide lucide-message-square icon" },
                                        createElement("path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" })
                                    ),
                                    createElement("span", null,
                                        "144"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "repeat-2", "className": "lucide lucide-repeat-2 icon" },
                                        createElement("path", { "d": "m2 9 3-3 3 3" }),
                                        createElement("path", { "d": "M13 18H7a2 2 0 0 1-2-2V6" }),
                                        createElement("path", { "d": "m22 15-3 3-3-3" }),
                                        createElement("path", { "d": "M11 6h6a2 2 0 0 1 2 2v10" })
                                    ),
                                    createElement("span", null,
                                        "转发"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "bookmark", "className": "lucide lucide-bookmark icon" },
                                        createElement("path", { "d": "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" })
                                    ),
                                    createElement("span", null,
                                        "收藏"
                                    )
                                )
                            ),
                            createElement("button", { "className": "action", "title": "分享" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "send", "className": "lucide lucide-send icon" },
                                    createElement("path", { "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }),
                                    createElement("path", { "d": "m21.854 2.147-10.94 10.939" })
                                ),
                                createElement("span", null,
                                    "分享"
                                )
                            )
                        )
                    ),
                    createElement("article", { "className": "feed-card glass" },
                        createElement("div", { "className": "card-head" },
                            createElement("div", { "className": "author" },
                                createElement("img", { "className": "avatar lg", "alt": "Nora Wei 头像", "src": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80" }),
                                createElement("div", { "className": "author-meta" },
                                    createElement("div", { "className": "author-line" },
                                        createElement("strong", null,
                                            "Nora Wei"
                                        ),
                                        createElement("span", { "className": "verify" },
                                            createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "check", "className": "lucide lucide-check" },
                                                createElement("path", { "d": "M20 6 9 17l-5-5" })
                                            )
                                        )
                                    ),
                                    createElement("div", { "className": "meta" },
                                        "趋势视频作者 · 2 小时前 · 视频预览"
                                    )
                                )
                            ),
                            createElement("button", { "className": "icon-btn", "title": "更多", "aria-label": "更多操作" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "more-horizontal", "className": "lucide lucide-more-horizontal icon" },
                                    createElement("circle", { "cx": "12", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "19", "cy": "12", "r": "1" }),
                                    createElement("circle", { "cx": "5", "cy": "12", "r": "1" })
                                )
                            )
                        ),
                        createElement("div", { "className": "card-body" },
                            createElement("h2", null,
                                "5 分钟看懂：为什么新一代内容平台会更像「实时研究室」"
                            ),
                            createElement("p", null,
                                "Feed 不再只是滚动消费，而是在持续吸收、聚类、追踪和分发。用户会期待每张内容卡片都能成为一个主题入口。"
                            ),
                            createElement("div", { "className": "media" },
                                createElement("img", { "alt": "视频工作室中的内容创作者正在录制趋势分析", "src": "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=82" }),
                                createElement("div", { "className": "media-overlay" },
                                    createElement("span", { "className": "video-badge" },
                                        createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "play", "className": "lucide lucide-play icon" },
                                            createElement("path", { "d": "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" })
                                        ),
                                        " 05:24"
                                    ),
                                    createElement("button", { "className": "play-control", "aria-label": "播放视频" },
                                        createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "play", "className": "lucide lucide-play icon" },
                                            createElement("path", { "d": "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" })
                                        )
                                    )
                                )
                            ),
                            createElement("div", { "className": "content-tags" },
                                createElement("span", { "className": "tag" },
                                    "# VideoBrief"
                                ),
                                createElement("span", { "className": "tag" },
                                    "# ResearchFeed"
                                )
                            )
                        ),
                        createElement("div", { "className": "actions" },
                            createElement("div", { "className": "action-group" },
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "heart", "className": "lucide lucide-heart icon" },
                                        createElement("path", { "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" })
                                    ),
                                    createElement("span", null,
                                        "3.8k"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "message-square", "className": "lucide lucide-message-square icon" },
                                        createElement("path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" })
                                    ),
                                    createElement("span", null,
                                        "526"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "repeat-2", "className": "lucide lucide-repeat-2 icon" },
                                        createElement("path", { "d": "m2 9 3-3 3 3" }),
                                        createElement("path", { "d": "M13 18H7a2 2 0 0 1-2-2V6" }),
                                        createElement("path", { "d": "m22 15-3 3-3-3" }),
                                        createElement("path", { "d": "M11 6h6a2 2 0 0 1 2 2v10" })
                                    ),
                                    createElement("span", null,
                                        "转发"
                                    )
                                ),
                                createElement("button", { "className": "action" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "bookmark", "className": "lucide lucide-bookmark icon" },
                                        createElement("path", { "d": "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" })
                                    ),
                                    createElement("span", null,
                                        "收藏"
                                    )
                                )
                            ),
                            createElement("button", { "className": "action", "title": "分享" },
                                createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "send", "className": "lucide lucide-send icon" },
                                    createElement("path", { "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }),
                                    createElement("path", { "d": "m21.854 2.147-10.94 10.939" })
                                ),
                                createElement("span", null,
                                    "分享"
                                )
                            )
                        )
                    )
                ),
                createElement("aside", { "className": "rightbar", "aria-label": "右侧辅助信息" },
                    createElement("section", { "className": "side-card glass" },
                        createElement("div", { "className": "card-title" },
                            createElement("h2", null,
                                "实时热榜"
                            ),
                            createElement("span", null,
                                "更新于 17:42"
                            )
                        ),
                        createElement("ol", { "className": "trend-list" },
                            createElement("li", { "className": "trend-item" },
                                createElement("span", { "className": "rank" },
                                    "1"
                                ),
                                createElement("span", { "className": "trend-copy" },
                                    createElement("strong", null,
                                        "AI Agent 工作流"
                                    ),
                                    createElement("small", null,
                                        "12.8k 讨论"
                                    )
                                ),
                                createElement("span", { "className": "trend-state" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "arrow-up", "className": "lucide lucide-arrow-up icon" },
                                        createElement("path", { "d": "m5 12 7-7 7 7" }),
                                        createElement("path", { "d": "M12 19V5" })
                                    ),
                                    "28%"
                                )
                            ),
                            createElement("li", { "className": "trend-item" },
                                createElement("span", { "className": "rank" },
                                    "2"
                                ),
                                createElement("span", { "className": "trend-copy" },
                                    createElement("strong", null,
                                        "Liquid Glass UI"
                                    ),
                                    createElement("small", null,
                                        "9.4k 讨论"
                                    )
                                ),
                                createElement("span", { "className": "trend-state" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "arrow-up", "className": "lucide lucide-arrow-up icon" },
                                        createElement("path", { "d": "m5 12 7-7 7 7" }),
                                        createElement("path", { "d": "M12 19V5" })
                                    ),
                                    "16%"
                                )
                            ),
                            createElement("li", { "className": "trend-item" },
                                createElement("span", { "className": "rank" },
                                    "3"
                                ),
                                createElement("span", { "className": "trend-copy" },
                                    createElement("strong", null,
                                        "独立开发者周报"
                                    ),
                                    createElement("small", null,
                                        "6.1k 讨论"
                                    )
                                ),
                                createElement("span", { "className": "trend-state new" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "sparkle", "className": "lucide lucide-sparkle icon" },
                                        createElement("path", { "d": "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" })
                                    ),
                                    "New"
                                )
                            ),
                            createElement("li", { "className": "trend-item" },
                                createElement("span", { "className": "rank" },
                                    "4"
                                ),
                                createElement("span", { "className": "trend-copy" },
                                    createElement("strong", null,
                                        "远程协作工具"
                                    ),
                                    createElement("small", null,
                                        "4.7k 讨论"
                                    )
                                ),
                                createElement("span", { "className": "trend-state down" },
                                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "arrow-down", "className": "lucide lucide-arrow-down icon" },
                                        createElement("path", { "d": "M12 5v14" }),
                                        createElement("path", { "d": "m19 12-7 7-7-7" })
                                    ),
                                    "5%"
                                )
                            )
                        )
                    ),
                    createElement("section", { "className": "side-card glass" },
                        createElement("div", { "className": "card-title" },
                            createElement("h3", null,
                                "推荐关注"
                            ),
                            createElement("span", null,
                                "Refresh"
                            )
                        ),
                        createElement("div", { "className": "follow-list" },
                            createElement("div", { "className": "follow-item" },
                                createElement("div", { "className": "follow-person" },
                                    createElement("img", { "className": "avatar sm", "alt": "Alan Hu 头像", "src": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80" }),
                                    createElement("div", null,
                                        createElement("strong", null,
                                            "Alan Hu"
                                        ),
                                        createElement("span", null,
                                            "AI 产品经理 · 42k"
                                        )
                                    )
                                ),
                                createElement("button", { "className": "follow-btn" },
                                    "关注"
                                )
                            ),
                            createElement("div", { "className": "follow-item" },
                                createElement("div", { "className": "follow-person" },
                                    createElement("img", { "className": "avatar sm", "alt": "Jia Lin 头像", "src": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" }),
                                    createElement("div", null,
                                        createElement("strong", null,
                                            "Jia Lin"
                                        ),
                                        createElement("span", null,
                                            "设计系统研究 · 31k"
                                        )
                                    )
                                ),
                                createElement("button", { "className": "follow-btn" },
                                    "关注"
                                )
                            ),
                            createElement("div", { "className": "follow-item" },
                                createElement("div", { "className": "follow-person" },
                                    createElement("img", { "className": "avatar sm", "alt": "Pixel Lab 头像", "src": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" }),
                                    createElement("div", null,
                                        createElement("strong", null,
                                            "Pixel Lab"
                                        ),
                                        createElement("span", null,
                                            "创作者工具团队"
                                        )
                                    )
                                ),
                                createElement("button", { "className": "follow-btn" },
                                    "关注"
                                )
                            )
                        )
                    ),
                    createElement("section", { "className": "side-card glass" },
                        createElement("div", { "className": "card-title" },
                            createElement("h3", null,
                                "今日数据"
                            ),
                            createElement("span", null,
                                "Live"
                            )
                        ),
                        createElement("div", { "className": "stats-grid" },
                            createElement("div", { "className": "stat" },
                                createElement("strong", null,
                                    "28.6k"
                                ),
                                createElement("span", null,
                                    "阅读增量"
                                )
                            ),
                            createElement("div", { "className": "stat" },
                                createElement("strong", null,
                                    "1,842"
                                ),
                                createElement("span", null,
                                    "新发布"
                                )
                            ),
                            createElement("div", { "className": "stat" },
                                createElement("strong", null,
                                    "368"
                                ),
                                createElement("span", null,
                                    "活跃创作者"
                                )
                            ),
                            createElement("div", { "className": "stat" },
                                createElement("strong", null,
                                    "74%"
                                ),
                                createElement("span", null,
                                    "收藏转化"
                                )
                            )
                        ),
                        createElement("div", { "className": "spark", "aria-label": "社区活跃趋势" },
                            createElement("i", { "style": { "height": "42%" } }),
                            createElement("i", { "style": { "height": "58%" } }),
                            createElement("i", { "style": { "height": "48%" } }),
                            createElement("i", { "style": { "height": "76%" } }),
                            createElement("i", { "style": { "height": "64%" } }),
                            createElement("i", { "style": { "height": "88%" } }),
                            createElement("i", { "style": { "height": "70%" } })
                        )
                    ),
                    createElement("section", { "className": "side-card glass" },
                        createElement("div", { "className": "card-title" },
                            createElement("h3", null,
                                "社区活跃度"
                            ),
                            createElement("span", null,
                                "3.2k 在线"
                            )
                        ),
                        createElement("div", { "className": "live-list" },
                            createElement("div", { "className": "live-row" },
                                createElement("span", { "className": "pulse" }),
                                createElement("div", null,
                                    createElement("strong", null,
                                        "设计系统频道正在升温"
                                    ),
                                    createElement("span", null,
                                        "过去 10 分钟新增 86 条讨论"
                                    )
                                )
                            ),
                            createElement("div", { "className": "live-row" },
                                createElement("span", { "className": "pulse" }),
                                createElement("div", null,
                                    createElement("strong", null,
                                        "AI 产品 AMA 即将开始"
                                    ),
                                    createElement("span", null,
                                        "已有 1,204 人预约提醒"
                                    )
                                )
                            )
                        )
                    )
                )
            ),
            createElement("nav", { "className": "bottom-tabs glass", "aria-label": "移动端底部导航" },
                createElement("button", { "className": "tab active", "title": "首页", "aria-label": "首页" },
                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "home", "className": "lucide lucide-home icon" },
                        createElement("path", { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }),
                        createElement("path", { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" })
                    )
                ),
                createElement("button", { "className": "tab", "title": "发现", "aria-label": "发现" },
                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "compass", "className": "lucide lucide-compass icon" },
                        createElement("path", { "d": "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" }),
                        createElement("circle", { "cx": "12", "cy": "12", "r": "10" })
                    )
                ),
                createElement("button", { "className": "tab", "title": "发布", "aria-label": "发布" },
                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "plus", "className": "lucide lucide-plus icon" },
                        createElement("path", { "d": "M5 12h14" }),
                        createElement("path", { "d": "M12 5v14" })
                    )
                ),
                createElement("button", { "className": "tab", "title": "消息", "aria-label": "消息" },
                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "inbox", "className": "lucide lucide-inbox icon" },
                        createElement("polyline", { "points": "22 12 16 12 14 15 10 15 8 12 2 12" }),
                        createElement("path", { "d": "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" })
                    )
                ),
                createElement("button", { "className": "tab", "title": "我的", "aria-label": "我的" },
                    createElement("svg", { "xmlns": "http://www.w3.org/2000/svg", "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "data-lucide": "user", "className": "lucide lucide-user icon" },
                        createElement("path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
                        createElement("circle", { "cx": "12", "cy": "7", "r": "4" })
                    )
                )
            )
        )
    );
}
