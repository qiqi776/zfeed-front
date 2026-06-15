import { expect, test } from "@playwright/test";

const routes = [
    ["/", "登录或注册 zfeed"],
    ["/home", "用 AI 构建产品：30 天从 0 到 1"],
    ["/following", "我关注的创作者今天都在用 AI 重构工作流"],
    ["/login", "登录 zfeed"],
    ["/register", "创建 zfeed 账号"],
    ["/me", "Mira Chen"],
    ["/user/jax", "Jax Lee"],
    ["/content/article-1", "用 AI 构建产品：30 天从 0 到 1"],
    ["/content/video-1", "创作工具的未来：AI 成为协作副驾"],
    ["/me/edit", "编辑资料"],
    ["/search", "搜索"],
    ["/compose", "发布"],
    ["/settings", "设置"],
    ["/liquid-glass-feed", "推荐 Feed"]
] as const;

for (const [route, text] of routes) {
    test(`renders ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.getByText(text).first()).toBeVisible();
        await expect(page.locator("body")).toHaveCSS("overflow-x", "hidden");
    });
}

test("captures stable desktop and mobile feed screenshots", async ({ page }, testInfo) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("用 AI 构建产品：30 天从 0 到 1").first()).toBeVisible();

    await page.screenshot({
        path: testInfo.outputPath(`feed-${testInfo.project.name}.png`),
        fullPage: false
    });
});

test("keeps migrated edit profile form values visible", async ({ page }) => {
    await page.goto("/me/edit", { waitUntil: "domcontentloaded" });

    await expect(page.getByLabel("昵称")).toHaveValue("Mira Chen");
    await expect(page.getByLabel("简介")).toContainText("关注创作者工具");
});

test("keeps liquid glass feed delegated interactions", async ({ page }) => {
    await page.goto("/liquid-glass-feed", { waitUntil: "domcontentloaded" });

    const bookmark = page.locator(".action").filter({ has: page.locator('[data-lucide="bookmark"]') }).first();
    await expect(bookmark).toHaveText(/已收藏/);
    await bookmark.click();
    await expect(bookmark).toHaveText(/收藏/);
    await expect(bookmark).not.toHaveClass(/bookmarked/);

    const hotSegment = page.locator(".segment", { hasText: "最新" }).first();
    await hotSegment.click();
    await expect(hotSegment).toHaveClass(/active/);
});

test("does not serve old .html URLs", async ({ page }) => {
    await page.goto("/following.html", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("页面不存在")).toBeVisible();
});

test("does not serve removed legacy product URLs", async ({ page }) => {
    await page.goto("/profile?user=me", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("页面不存在")).toBeVisible();

    await page.goto("/detail?type=article", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("页面不存在")).toBeVisible();

    await page.goto("/edit-profile?user=me", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("页面不存在")).toBeVisible();
});
