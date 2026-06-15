import type { ReactNode } from "react";
import { useEffect } from "react";
import {
    commentContent,
    deleteComment,
    favoriteContent,
    followUser,
    likeContent,
    publishArticle,
    unfavoriteContent,
    unfollowUser,
    unlikeContent,
    updateProfile
} from "./apiClient";
import { readAuthSession } from "./authStore";
import { navigateTo } from "./navigation";

type PageShellProps = {
    title: string;
    htmlClass: string;
    bodyClass: string;
    styles: string;
    children?: ReactNode;
};

export function PageShell({ title, htmlClass, bodyClass, styles, children }: PageShellProps) {
    useEffect(() => {
        document.title = title;
        document.documentElement.lang = "zh-CN";
        document.documentElement.className = htmlClass || "light";
        document.body.className = bodyClass;

        const styleElement = document.createElement("style");
        styleElement.dataset.pageStyle = "true";
        styleElement.textContent = styles;
        document.head.append(styleElement);

        ensureLegacyBrowserApis();

        return () => {
            styleElement.remove();
        };
    }, [bodyClass, htmlClass, styles, title]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            document.querySelector(".feed-transition")?.classList.add("feed-ready");
        });

        const onPageShow = () => {
            document.querySelector(".feed-transition")?.classList.remove("feed-leaving");
            document.querySelector(".feed-transition")?.classList.add("feed-ready");
        };

        const onClick = (event: MouseEvent) => {
            handleSelectableClick(event);
            handleComposeClick(event);
            handleFollowClick(event);
            handleReplyClick(event);
            handleReplySubmitClick(event);
            handleDeleteCommentClick(event);
            handleCommentSubmitClick(event);
            handleProfileSaveClick(event);
            handlePublishClick(event);
            handleActionClick(event);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            handleSearchSubmit(event);
        };

        const onFocusIn = (event: FocusEvent) => {
            if (event.target instanceof Element && event.target.matches(".search-box input")) {
                event.target.closest(".search-wrap")?.classList.add("focused");
            }
        };

        const onFocusOut = (event: FocusEvent) => {
            if (!(event.target instanceof Element) || !event.target.matches(".search-box input")) {
                return;
            }

            const wrapper = event.target.closest(".search-wrap");
            window.setTimeout(() => wrapper?.classList.remove("focused"), 160);
        };

        window.addEventListener("pageshow", onPageShow);
        document.addEventListener("click", onClick);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pageshow", onPageShow);
            document.removeEventListener("click", onClick);
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("focusin", onFocusIn);
            document.removeEventListener("focusout", onFocusOut);
        };
    }, []);

    return children;
}

function handleSelectableClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLElement>(".channel, .segment, .tab, .top-channel");
    if (!button) {
        return;
    }

    const link = button.closest<HTMLAnchorElement>("a[href]");
    const href = link?.getAttribute("href");
    if (href && href !== "#") {
        return;
    }

    event.preventDefault();
    const group = button.parentElement?.querySelectorAll<HTMLElement>(".active");
    group?.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
}

function handleActionClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button) {
        return;
    }

    const action = resolveContentAction(button);
    if (!action) {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    const contentId = resolveContentId(button);
    if (!contentId) {
        if (window.location.pathname === "/liquid-glass-feed") {
            applyLegacyLocalActionState(button, action);
        }
        return;
    }
    const contentUserId = resolveContentUserId(button);

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const snapshot = captureButtonState(button);
    button.dataset.pending = "true";
    button.disabled = true;
    applyOptimisticState(button, action);

    const request = action.kind === "like"
        ? action.nextActive ? likeContent({ contentId, contentUserId }) : unlikeContent({ contentId })
        : action.nextActive ? favoriteContent({ contentId }) : unfavoriteContent({ contentId });

    request.catch((error: unknown) => {
        restoreButtonState(button, snapshot);
        if (isAuthError(error)) {
            navigateToLogin();
        }
    }).finally(() => {
        button.disabled = false;
        delete button.dataset.pending;
    });
}

function handleFollowClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button || button.closest("form")) {
        return;
    }

    const label = button.textContent?.trim().replace(/\s+/g, "");
    if (label !== "关注" && label !== "关注作者" && label !== "已关注") {
        return;
    }

    const targetUserId = resolveTargetUserId(button);
    if (!targetUserId) {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const snapshot = captureButtonState(button);
    const nextFollowed = label !== "已关注";
    button.dataset.pending = "true";
    button.disabled = true;
    button.textContent = nextFollowed ? "已关注" : "关注";

    const request = nextFollowed ? followUser({ target_user_id: targetUserId }) : unfollowUser({ target_user_id: targetUserId });
    request.catch((error: unknown) => {
        restoreButtonState(button, snapshot);
        if (isAuthError(error)) {
            navigateToLogin();
        }
    }).finally(() => {
        button.disabled = false;
        delete button.dataset.pending;
    });
}

function handleCommentSubmitClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button || button.textContent?.trim() !== "发送") {
        return;
    }

    const composer = button.closest(".comment-row")?.querySelector<HTMLInputElement>('input[placeholder="写下你的观点，补充或提问..."]');
    if (!composer) {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    const comment = composer.value.trim();
    if (!comment) {
        showInlineStatus(button, "请输入评论内容", "error");
        return;
    }

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const contentId = resolveNumericContentIdFromPath();
    const contentUserId = resolveContentUserIdFromPath();
    if (!contentId || !contentUserId) {
        showInlineStatus(button, "评论失败，请重试", "error");
        return;
    }

    button.dataset.pending = "true";
    const previousText = button.textContent ?? "发送";
    button.textContent = "发送中";
    const pendingComment = insertPendingComment(button, comment);

    commentContent({
        content_id: contentId,
        scene: "content",
        comment,
        content_user_id: contentUserId
    }).then(() => {
        composer.value = "";
        pendingComment?.setAttribute("data-comment-state", "sent");
        showInlineStatus(button, "评论已发送", "success");
    }).catch((error: unknown) => {
        pendingComment?.remove();
        showInlineStatus(button, "评论失败，请重试", "error");
        if (isAuthError(error)) {
            navigateToLogin();
        }
    }).finally(() => {
        button.textContent = previousText;
        delete button.dataset.pending;
    });
}

function handleReplyClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button || button.closest("[data-reply-composer]")) {
        return;
    }

    const isReplyButton = button.getAttribute("aria-label") === "回复" || Array.from(button.querySelectorAll(".material-symbols-outlined"))
        .some((icon) => icon.textContent?.trim() === "reply");
    if (!isReplyButton) {
        return;
    }

    const row = button.closest<HTMLElement>(".comment-row");
    const metadata = row ? resolveCommentMetadata(row) : null;
    if (!row || !metadata) {
        return;
    }

    event.preventDefault();

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    row.querySelector("[data-reply-composer]")?.remove();
    row.append(createReplyComposer(metadata.authorName));
}

function handleReplySubmitClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    const composer = button?.closest<HTMLElement>("[data-reply-composer]");
    if (!button || !composer || button.textContent?.trim() !== "发送") {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    const row = composer.closest<HTMLElement>(".comment-row");
    const metadata = row ? resolveCommentMetadata(row) : null;
    const input = composer.querySelector<HTMLInputElement>("input");
    const comment = input?.value.trim() ?? "";
    if (!row || !metadata || !input) {
        return;
    }

    if (!comment) {
        showInlineStatus(button, "请输入回复内容", "error");
        return;
    }

    if (comment.length > 255) {
        showInlineStatus(button, "回复最多 255 字", "error");
        return;
    }

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const contentId = resolveNumericContentIdFromPath();
    const contentUserId = resolveContentUserIdFromPath();
    if (!contentId || !contentUserId) {
        showInlineStatus(button, "回复失败，请重试", "error");
        return;
    }

    button.dataset.pending = "true";
    const previousText = button.textContent ?? "发送";
    button.textContent = "发送中";
    const pendingReply = insertPendingReply(composer, comment);

    commentContent({
        content_id: contentId,
        scene: "content",
        comment,
        parent_id: metadata.commentId,
        root_id: metadata.rootId,
        reply_to_user_id: metadata.userId,
        content_user_id: contentUserId
    }).then(() => {
        input.value = "";
        pendingReply?.setAttribute("data-comment-state", "sent");
        showInlineStatus(button, "回复已发送", "success");
    }).catch((error: unknown) => {
        pendingReply?.remove();
        showInlineStatus(button, "回复失败，请重试", "error");
        if (isAuthError(error)) {
            navigateToLogin();
        }
    }).finally(() => {
        button.textContent = previousText;
        delete button.dataset.pending;
    });
}

function handleDeleteCommentClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>('button[aria-label="删除评论"]');
    if (!button) {
        return;
    }

    const row = button.closest<HTMLElement>(".comment-row");
    const metadata = row ? resolveCommentMetadata(row) : null;
    if (!row || !metadata) {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const contentId = resolveNumericContentIdFromPath();
    if (!contentId) {
        showInlineStatus(button, "删除失败，请重试", "error");
        return;
    }

    button.dataset.pending = "true";
    const parent = row.parentElement;
    const nextSibling = row.nextSibling;
    row.remove();

    deleteComment({
        comment_id: metadata.commentId,
        content_id: contentId,
        scene: "content",
        root_id: metadata.rootId
    }).catch((error: unknown) => {
        if (parent) {
            parent.insertBefore(row, nextSibling);
        }
        showInlineStatus(button, "删除失败，请重试", "error");
        if (isAuthError(error)) {
            navigateToLogin();
        }
    }).finally(() => {
        delete button.dataset.pending;
    });
}

function handleProfileSaveClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button || !button.textContent?.includes("保存")) {
        return;
    }

    const form = document.querySelector<HTMLFormElement>('form[data-profile-edit="true"]');
    if (!form) {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const nickname = getNamedFieldValue(form, "nickname");
    const bio = getNamedFieldValue(form, "bio");
    const email = getNamedFieldValue(form, "email");
    const errors = validateProfileFields({ nickname, bio, email });
    if (errors.length > 0) {
        showFormStatus(form, errors[0], "error");
        return;
    }

    button.dataset.pending = "true";
    button.disabled = true;
    const previousText = button.textContent ?? "保存";
    button.textContent = "保存中";

    updateProfile({
        nickname: optionalValue(nickname),
        bio: optionalValue(bio),
        email: optionalValue(email)
    }).then(() => {
        showFormStatus(form, "资料已保存", "success");
    }).catch((error: unknown) => {
        showFormStatus(form, "保存失败，请重试", "error");
        if (isAuthError(error)) {
            navigateToLogin();
        }
    }).finally(() => {
        button.textContent = previousText;
        button.disabled = false;
        delete button.dataset.pending;
    });
}

function handlePublishClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button || button.textContent?.trim() !== "发布") {
        return;
    }

    const form = button.closest<HTMLElement>('[data-compose-form="true"]');
    if (!form) {
        return;
    }

    event.preventDefault();

    if (button.dataset.pending === "true") {
        return;
    }

    if (!readAuthSession()) {
        navigateToLogin();
        return;
    }

    const title = getNamedFieldValue(form, "title");
    const content = getNamedFieldValue(form, "content");
    const errors = validatePublishFields({ title, content });
    if (errors.length > 0) {
        showFormStatus(form, errors[0], "error");
        return;
    }

    button.dataset.pending = "true";
    button.disabled = true;
    const previousText = button.textContent ?? "发布";
    button.textContent = "发布中";

    publishArticle<{ content_id?: number | string; contentId?: number | string }>({
        title,
        description: content,
        content,
        visibility: 1
    }).then((result) => {
        const contentId = result.content_id ?? result.contentId;
        window.setTimeout(() => navigateTo(`/content/${contentId ?? ""}`), 0);
    }).catch((error: unknown) => {
        showFormStatus(form, "发布失败，请重试", "error");
        button.textContent = previousText;
        button.disabled = false;
        delete button.dataset.pending;
        if (isAuthError(error)) {
            navigateToLogin();
        }
    });
}

function handleComposeClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>("button");
    if (!button || button.closest("form")) {
        return;
    }

    const icon = button.querySelector(".material-symbols-outlined")?.textContent?.trim();
    if (icon !== "add" || !button.textContent?.includes("发布")) {
        return;
    }

    event.preventDefault();
    navigateTo("/compose");
}

function handleSearchSubmit(event: KeyboardEvent) {
    if (event.key !== "Enter" || !(event.target instanceof HTMLInputElement)) {
        return;
    }

    if (event.target.type !== "search" && !event.target.closest(".search-shell, .search-box, .composer-shell")) {
        return;
    }

    const query = event.target.value.trim();
    if (!query) {
        navigateTo("/search");
        return;
    }

    navigateTo(`/search?${new URLSearchParams({ q: query }).toString()}`);
}

function resolveContentAction(button: HTMLElement) {
    const iconNames = Array.from(button.querySelectorAll(".material-symbols-outlined, [data-lucide]"))
        .map((icon) => icon.getAttribute("data-lucide") ?? icon.textContent?.trim() ?? "");

    if (iconNames.includes("favorite") || iconNames.includes("heart")) {
        return { kind: "like" as const, nextActive: !isLikeActive(button) };
    }

    if (iconNames.includes("bookmark")) {
        return { kind: "favorite" as const, nextActive: !isFavoriteActive(button) };
    }

    return null;
}

function resolveContentId(button: HTMLElement) {
    const explicitId = button.dataset.contentId;
    if (explicitId) {
        return explicitId;
    }

    if (window.location.pathname.startsWith("/content/")) {
        return mapRouteIdToApiId(window.location.pathname.split("/")[2] ?? "");
    }

    const container = button.closest("article, section, main") ?? document;
    const contentLink = container.querySelector<HTMLAnchorElement>('a[href^="/content/"]');
    return mapRouteIdToApiId(contentLink?.getAttribute("href")?.split("/")[2] ?? "");
}

function resolveContentUserId(button: HTMLElement) {
    const explicitId = button.dataset.contentUserId;
    if (explicitId) {
        return explicitId;
    }

    const container = button.closest("article, section, main") ?? document;
    const authorLink = container.querySelector<HTMLAnchorElement>('a[href^="/user/"]');
    const routeId = authorLink?.getAttribute("href")?.split("/")[2] ?? "";
    return mapRouteIdToApiId(routeId) || resolveContentUserIdFromPath();
}

function resolveTargetUserId(button: HTMLElement) {
    const explicitId = button.dataset.userId;
    if (explicitId) {
        return explicitId;
    }

    const pathname = window.location.pathname;
    if (pathname.startsWith("/user/")) {
        return mapRouteIdToApiId(pathname.split("/")[2] ?? "");
    }

    const link = button.closest("section, article, aside, main")?.querySelector<HTMLAnchorElement>('a[href^="/user/"]');
    const routeId = link?.getAttribute("href")?.split("/")[2] ?? "";
    return mapRouteIdToApiId(routeId);
}

function resolveNumericContentIdFromPath() {
    if (!window.location.pathname.startsWith("/content/")) {
        return "";
    }

    return mapRouteIdToApiId(window.location.pathname.split("/")[2] ?? "");
}

function resolveContentUserIdFromPath() {
    const contentId = window.location.pathname.split("/")[2] ?? "";
    if (contentId.includes("video")) {
        return "1002";
    }

    return "1001";
}

function mapRouteIdToApiId(routeId: string) {
    const ids: Record<string, string> = {
        jax: "1001",
        lin: "1002",
        nora: "1003",
        article: "1001",
        "article-1": "1001",
        video: "1002",
        "video-1": "1002"
    };

    if (/^\d+$/.test(routeId)) {
        return routeId;
    }

    return ids[routeId] ?? "";
}

function insertPendingComment(button: HTMLElement, comment: string) {
    const comments = button.closest("section")?.querySelector(".flex.flex-col.gap-3");
    if (!comments) {
        return null;
    }

    const item = document.createElement("div");
    item.className = "comment-row rounded-2xl p-4";
    item.dataset.commentState = "pending";
    const session = readAuthSession();

    const row = document.createElement("div");
    row.className = "flex gap-3";

    const avatar = document.createElement("div");
    avatar.className = "w-10 h-10 rounded-full border border-white bg-white/55 shadow-sm";

    const body = document.createElement("div");
    body.className = "flex-1 min-w-0";

    const author = document.createElement("div");
    author.className = "font-headline-md text-[15px] text-on-surface";
    author.textContent = session?.user?.nickname ?? "我";

    const meta = document.createElement("div");
    meta.className = "font-meta-xs text-on-surface-variant mt-1";
    meta.textContent = "刚刚 · 发送中";

    const content = document.createElement("p");
    content.className = "font-body-md text-on-surface-variant mt-3";
    content.textContent = comment;

    body.append(author, meta, content);
    row.append(avatar, body);
    item.append(row);
    comments.prepend(item);
    return item;
}

function createReplyComposer(authorName: string) {
    const composer = document.createElement("div");
    composer.dataset.replyComposer = "true";
    composer.className = "mt-4 rounded-2xl bg-white/35 border border-white/40 px-4 py-3";

    const shell = document.createElement("div");
    shell.className = "composer-shell";

    const input = document.createElement("input");
    input.className = "w-full bg-transparent border-none text-body-md focus:ring-0 placeholder:text-on-surface-variant/60 transition-all duration-300";
    input.placeholder = `回复 ${authorName}...`;
    input.type = "text";
    input.maxLength = 255;

    const actions = document.createElement("div");
    actions.className = "flex items-center justify-end gap-2 mt-3";

    const cancel = document.createElement("button");
    cancel.className = "glass-button-ghost rounded-full px-4 py-2 text-primary font-label-sm active:scale-95";
    cancel.type = "button";
    cancel.textContent = "取消";
    cancel.addEventListener("click", () => composer.remove());

    const send = document.createElement("button");
    send.className = "glass-button-primary text-white font-label-sm px-4 py-2 rounded-full active:scale-95 transition-all duration-300";
    send.type = "button";
    send.textContent = "发送";

    shell.append(input);
    actions.append(cancel, send);
    composer.append(shell, actions);
    return composer;
}

function insertPendingReply(composer: HTMLElement, comment: string) {
    const item = document.createElement("div");
    item.dataset.commentState = "pending";
    item.className = "mt-3 rounded-2xl bg-white/35 border border-white/40 px-4 py-3 font-body-md text-on-surface-variant text-[13px]";
    item.textContent = comment;
    composer.append(item);
    return item;
}

function resolveCommentMetadata(row: HTMLElement) {
    const authorName = Array.from(row.querySelectorAll<HTMLElement>(".font-headline-md"))
        .map((item) => item.textContent?.trim() ?? "")
        .find(Boolean) ?? "";
    const map: Record<string, { authorName: string; commentId: string; rootId: string; userId: string }> = {
        "Chen Zhiyuan": { authorName: "Chen Zhiyuan", commentId: "3001", rootId: "3001", userId: "2001" },
        "Zhang Xiaolong": { authorName: "Zhang Xiaolong", commentId: "3002", rootId: "3002", userId: "2002" },
        "Mira Chen": { authorName: "Mira Chen", commentId: "3003", rootId: "3003", userId: "7" }
    };

    return map[authorName] ?? null;
}

function showInlineStatus(anchor: HTMLElement, message: string, type: "success" | "error") {
    const parent = anchor.parentElement;
    if (!parent) {
        return;
    }

    let status = parent.querySelector<HTMLElement>("[data-inline-status]");
    if (!status) {
        status = document.createElement("span");
        status.dataset.inlineStatus = "true";
        status.className = "ml-3 text-[12px] font-semibold";
        parent.append(status);
    }

    status.textContent = message;
    status.classList.toggle("text-primary", type === "success");
    status.classList.toggle("text-red-600", type === "error");
}

function showFormStatus(form: HTMLElement, message: string, type: "success" | "error") {
    let status = form.querySelector<HTMLElement>("[data-form-status]");
    if (!status) {
        status = document.createElement("div");
        status.dataset.formStatus = "true";
        status.className = "rounded-2xl border px-4 py-3 text-[13px] font-semibold";
        form.prepend(status);
    }

    status.textContent = message;
    status.classList.toggle("border-blue-200", type === "success");
    status.classList.toggle("bg-blue-50", type === "success");
    status.classList.toggle("text-primary", type === "success");
    status.classList.toggle("border-red-200", type === "error");
    status.classList.toggle("bg-red-50", type === "error");
    status.classList.toggle("text-red-700", type === "error");
}

function getNamedFieldValue(form: HTMLElement, name: string) {
    const field = form instanceof HTMLFormElement
        ? form.elements.namedItem(name)
        : form.querySelector(`[name="${name}"]`);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        return field.value.trim();
    }

    return "";
}

function validateProfileFields(fields: { nickname: string; bio: string; email: string }) {
    const errors: string[] = [];
    if (fields.nickname.length > 64) {
        errors.push("昵称最多 64 字");
    }

    if (fields.bio.length > 255) {
        errors.push("简介最多 255 字");
    }

    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        errors.push("请输入有效邮箱");
    }

    return errors;
}

function validatePublishFields(fields: { title: string; content: string }) {
    const errors: string[] = [];
    if (!fields.title) {
        errors.push("请输入标题");
    }

    if (!fields.content) {
        errors.push("请输入正文");
    }

    if (fields.title.length > 80) {
        errors.push("标题最多 80 字");
    }

    if (fields.content.length > 5000) {
        errors.push("正文最多 5000 字");
    }

    return errors;
}

function optionalValue(value: string) {
    return value || undefined;
}

function captureButtonState(button: HTMLElement) {
    return {
        className: button.className,
        text: button.textContent ?? ""
    };
}

function restoreButtonState(button: HTMLElement, snapshot: { className: string; text: string }) {
    button.className = snapshot.className;
    const label = findActionLabel(button);
    if (label && snapshot.text.includes("已保存")) {
        label.textContent = "已保存";
    } else if (label && snapshot.text.includes("收藏")) {
        label.textContent = "收藏";
    }
}

function applyOptimisticState(button: HTMLElement, action: { kind: "like" | "favorite"; nextActive: boolean }) {
    if (action.kind === "like") {
        setClassToken(button, "text-error", action.nextActive);
        setClassToken(button, "text-on-surface-variant", !action.nextActive);
        return;
    }

    setClassToken(button, "text-primary", action.nextActive);
    setClassToken(button, "text-on-surface-variant", !action.nextActive);
    const label = findActionLabel(button);
    if (label) {
        label.textContent = action.nextActive ? "已保存" : "收藏";
    }
}

function applyLegacyLocalActionState(button: HTMLElement, action: { kind: "like" | "favorite"; nextActive: boolean }) {
    if (action.kind === "like") {
        button.classList.toggle("selected", action.nextActive);
        return;
    }

    button.classList.toggle("bookmarked", action.nextActive);
    const label = Array.from(button.querySelectorAll("span")).find((item) => {
        const text = item.textContent?.trim();
        return text === "收藏" || text === "已收藏" || text === "已保存";
    });
    if (label) {
        label.textContent = action.nextActive ? "已收藏" : "收藏";
    }
}

function setClassToken(element: HTMLElement, token: string, enabled: boolean) {
    if (enabled) {
        element.classList.add(token);
    } else {
        element.classList.remove(token);
    }
}

function isLikeActive(button: HTMLElement) {
    return button.classList.contains("text-error") || button.classList.contains("selected");
}

function isFavoriteActive(button: HTMLElement) {
    return button.classList.contains("text-primary") || button.classList.contains("bookmarked") || (button.textContent ?? "").includes("已保存");
}

function findActionLabel(button: HTMLElement) {
    return Array.from(button.querySelectorAll("span")).find((item) => {
        const text = item.textContent?.trim();
        return text === "收藏" || text === "已保存";
    });
}

function navigateToLogin() {
    const next = `${window.location.pathname}${window.location.search}`;
    navigateTo(`/login?next=${encodeURIComponent(next)}`);
}

function isAuthError(error: unknown) {
    return typeof error === "object" && error !== null && "status" in error && (error.status === 401 || error.status === 403);
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
