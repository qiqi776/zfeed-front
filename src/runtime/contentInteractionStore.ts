import { useSyncExternalStore } from "react";

export type ContentInteractionFields = {
    content_id: string | number;
    like_count?: number;
    favorite_count?: number;
    comment_count?: number;
    is_liked?: boolean;
    is_favorited?: boolean;
};

export type ContentReactionKind = "like" | "favorite";

type ContentInteractionOverride = {
    like_count?: number;
    favorite_count?: number;
    comment_count?: number;
    is_liked?: boolean;
    is_favorited?: boolean;
};

const overrides = new Map<string, ContentInteractionOverride>();
const listeners = new Set<() => void>();
let version = 0;

export function useContentInteractionVersion() {
    return useSyncExternalStore(subscribeContentInteractions, getContentInteractionVersion, getContentInteractionVersion);
}

export function mergeContentInteractionState<T extends ContentInteractionFields>(item: T): T {
    const contentId = normalizeContentId(item.content_id);
    const override = contentId ? overrides.get(contentId) : undefined;
    if (!override) {
        return item;
    }

    return {
        ...item,
        ...definedValues(override)
    };
}

export function setContentReactionOverride(contentId: string, kind: ContentReactionKind, nextActive: boolean, nextCount: number) {
    const normalizedId = normalizeContentId(contentId);
    const previous = cloneOverride(overrides.get(normalizedId));
    const next = {
        ...previous,
        ...(kind === "like"
            ? { is_liked: nextActive, like_count: nextCount }
            : { is_favorited: nextActive, favorite_count: nextCount })
    };

    overrides.set(normalizedId, next);
    notifyContentInteractionSubscribers();
    return previous;
}

export function restoreContentInteractionOverride(contentId: string, previous: ContentInteractionOverride | undefined) {
    const normalizedId = normalizeContentId(contentId);
    if (previous) {
        overrides.set(normalizedId, previous);
    } else {
        overrides.delete(normalizedId);
    }

    notifyContentInteractionSubscribers();
}

export function resetContentInteractionState() {
    overrides.clear();
    notifyContentInteractionSubscribers();
}

function subscribeContentInteractions(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getContentInteractionVersion() {
    return version;
}

function notifyContentInteractionSubscribers() {
    version += 1;
    listeners.forEach((listener) => listener());
}

function cloneOverride(override: ContentInteractionOverride | undefined) {
    return override ? { ...override } : undefined;
}

function definedValues(override: ContentInteractionOverride) {
    return Object.fromEntries(Object.entries(override).filter(([, value]) => value !== undefined));
}

function normalizeContentId(contentId: string | number) {
    return String(contentId).trim();
}
