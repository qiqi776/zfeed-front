import { expect, test } from "@playwright/test";

const routes = [
    ["/", "用 AI 构建产品：30 天从 0 到 1"],
    ["/following.html", "我关注的创作者今天都在用 AI 重构工作流"],
    ["/profile.html?user=me", "Mira Chen"],
    ["/detail.html?type=article", "用 AI 构建产品：30 天从 0 到 1"],
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
