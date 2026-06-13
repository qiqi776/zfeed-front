export type LegacyPageId =
    | "pasted-html-original-copy"
    | "following"
    | "profile"
    | "detail"
    | "edit-profile"
    | "liquid-glass-feed";

export type ParsedLegacyDocument = {
    title: string;
    htmlClass: string;
    bodyClass: string;
    styles: string;
    markup: string;
    scripts: string[];
};

const routeMap: Record<string, LegacyPageId> = {
    "/": "pasted-html-original-copy",
    "/index.html": "pasted-html-original-copy",
    "/pasted-html-original-copy.html": "pasted-html-original-copy",
    "/following.html": "following",
    "/profile.html": "profile",
    "/detail.html": "detail",
    "/edit-profile.html": "edit-profile",
    "/liquid-glass-feed.html": "liquid-glass-feed"
};

export function resolveLegacyRoute(pathname: string): LegacyPageId {
    return routeMap[pathname] ?? "pasted-html-original-copy";
}

export function parseLegacyDocument(source: string): ParsedLegacyDocument {
    const title = source.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "zfeed";
    const htmlClass = source.match(/<html[^>]*\sclass=["']([^"']*)["'][^>]*>/i)?.[1] ?? "";
    const bodyClass = source.match(/<body[^>]*\sclass=["']([^"']*)["'][^>]*>/i)?.[1] ?? "";
    const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
        .map((match) => match[1].trim())
        .filter(Boolean)
        .join("\n\n");
    const scripts = [...source.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
        .filter((match) => !isIgnoredScript(match[1], match[2]))
        .map((match) => match[2].trim())
        .filter(Boolean);

    const markup = source
        .replace(/<!doctype[^>]*>/gi, "")
        .replace(/<html[^>]*>/gi, "")
        .replace(/<\/html>/gi, "")
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
        .replace(/<body[^>]*>/gi, "")
        .replace(/<\/body>/gi, "")
        .replace(/```html/g, "")
        .replace(/<meta[^>]*>/gi, "")
        .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
        .replace(/<link[^>]*>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .trim();

    return {
        title,
        htmlClass,
        bodyClass,
        styles,
        markup,
        scripts
    };
}

function isIgnoredScript(attributes: string, content: string) {
    return attributes.includes("src=") || attributes.includes("tailwind-config") || content.includes("tailwind.config =");
}
