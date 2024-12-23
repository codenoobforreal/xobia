import { test, expect } from "@playwright/test";

test("should set correct count", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("count").click();
  await expect(page.getByTestId("count")).toContainText("count:1");
});
