import { expect, test } from "@playwright/test";

const routes = [
    ["/", "用 AI 构建产品：30 天从 0 到 1"],
    ["/pasted-html-original-copy.html", "用 AI 构建产品：30 天从 0 到 1"],
    ["/following.html", "我关注的创作者今天都在用 AI 重构工作流"],
    ["/profile.html?user=me", "Mira Chen"],
    ["/profile.html?user=jax", "Jax Lee"],
    ["/detail.html?type=article", "用 AI 构建产品：30 天从 0 到 1"],
    ["/detail.html?type=video", "创作工具的未来：AI 成为协作副驾"],
    ["/edit-profile.html?user=me", "编辑资料"],
    ["/liquid-glass-feed.html", "推荐 Feed"]
] as const;

for (const [route, text] of routes) {
    test(`renders ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.getByText(text).first()).toBeVisible();
        await expect(page.locator("body")).toHaveCSS("overflow-x", "hidden");
    });
}

test("captures stable desktop and mobile feed screenshots", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("用 AI 构建产品：30 天从 0 到 1").first()).toBeVisible();

    await page.screenshot({
        path: testInfo.outputPath(`feed-${testInfo.project.name}.png`),
        fullPage: false
    });
});

test("keeps migrated edit profile form values visible", async ({ page }) => {
    await page.goto("/edit-profile.html?user=me", { waitUntil: "domcontentloaded" });

    await expect(page.getByLabel("昵称")).toHaveValue("Mira Chen");
    await expect(page.getByLabel("简介")).toContainText("关注创作者工具");
});

test("keeps liquid glass feed delegated interactions", async ({ page }) => {
    await page.goto("/liquid-glass-feed.html", { waitUntil: "domcontentloaded" });

    const bookmark = page.locator(".action").filter({ has: page.locator('[data-lucide="bookmark"]') }).first();
    await expect(bookmark).toHaveText(/已收藏/);
    await bookmark.click();
    await expect(bookmark).toHaveText(/收藏/);
    await expect(bookmark).not.toHaveClass(/bookmarked/);

    const hotSegment = page.locator(".segment", { hasText: "最新" }).first();
    await hotSegment.click();
    await expect(hotSegment).toHaveClass(/active/);
});
