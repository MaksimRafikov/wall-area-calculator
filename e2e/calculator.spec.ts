import { test, expect } from "@playwright/test";

test.describe("Калькулятор площади стен", () => {
  test("загрузка пресета Видинеевский и таблица сметы", async ({ page }) => {
    await page.goto("/");
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Видинеевский", exact: true }).click();

    await expect(page.getByRole("textbox", { name: "Название помещения" })).toHaveCount(7);
    await expect(page.getByRole("heading", { name: "Таблица для сметы" })).toBeVisible();
    await expect(page.locator(".summary-card--highlight .summary-card__value")).not.toHaveText("0,00");
  });

  test("экспорт CSV не блокируется", async ({ page }) => {
    await page.goto("/");
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Видинеевский", exact: true }).click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Экспорт CSV" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/смета\.csv$/i);
  });
});
