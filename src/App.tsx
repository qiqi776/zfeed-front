import { useEffect, useState } from "react";
import { parseLegacyDocument, resolveLegacyRoute } from "./legacy/legacyHtml";
import type { ParsedLegacyDocument } from "./legacy/legacyHtml";
import "./styles/index.css";

const pages = import.meta.glob("../legacy-html/*.html", {
    query: "?raw",
    import: "default"
}) as Record<string, () => Promise<string>>;

export function App() {
    const route = resolveLegacyRoute(window.location.pathname);
    const [loadedPage, setLoadedPage] = useState<LoadedLegacyPage | null>(null);
    const [revision, setRevision] = useState(0);
    const routeKey = `${route}-${revision}`;

    useEffect(() => {
        let cancelled = false;
        pages[`../legacy-html/${route}.html`]().then((source) => {
            if (!cancelled) {
                setLoadedPage({
                    key: routeKey,
                    page: parseLegacyDocument(source)
                });
            }
        });

        return () => {
            cancelled = true;
        };
    }, [route, routeKey]);

    useEffect(() => {
        const onPopState = () => setRevision((current) => current + 1);
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    if (!loadedPage || loadedPage.key !== routeKey) {
        return null;
    }

    return <LegacyPage key={routeKey} page={loadedPage.page} />;
}

type LoadedLegacyPage = {
    key: string;
    page: ParsedLegacyDocument;
};

function LegacyPage({ page }: { page: ParsedLegacyDocument }) {
    useEffect(() => {
        document.title = page.title;
        document.documentElement.lang = "zh-CN";
        document.documentElement.className = page.htmlClass || "light";
        document.body.className = page.bodyClass;

        const styleElement = document.createElement("style");
        styleElement.dataset.legacyPageStyle = "true";
        styleElement.textContent = page.styles;
        document.head.append(styleElement);

        ensureLegacyBrowserApis();
        const cleanupScripts = page.scripts.map((script) => runLegacyScript(script));

        void renderLucideIcons(page.markup);

        return () => {
            styleElement.remove();
            cleanupScripts.forEach((cleanup) => cleanup());
        };
    }, [page]);

    return (
        <div
            className="legacy-page"
            dangerouslySetInnerHTML={{ __html: page.markup }}
        />
    );
}

function runLegacyScript(source: string) {
    const execute = new Function(source);
    execute.call(window);

    return () => undefined;
}

function ensureLegacyBrowserApis() {
    if (typeof window.matchMedia !== "function") {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => undefined,
                removeListener: () => undefined,
                addEventListener: () => undefined,
                removeEventListener: () => undefined,
                dispatchEvent: () => false
            })
        });
    }
}

async function renderLucideIcons(markup: string) {
    if (!markup.includes("data-lucide")) {
        return;
    }

    const { createIcons, icons } = await import("lucide");
    createIcons({ icons });
}
