import { expect, test } from "@playwright/test";

test("IT budget dashboard can record an expense", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "IT budget overview" })).toBeVisible();
  await expect(page.getByText("$11,610")).toBeVisible();

  await page.getByRole("button", { name: "Add expense" }).click();
  const dialog = page.getByRole("dialog", { name: "Add an expense" });
  await dialog.getByLabel("Vendor").fill("Datadog");
  await dialog.getByLabel("System").selectOption("Cloud");
  await dialog.getByLabel("Amount").fill("2250");
  await dialog.getByRole("button", { name: "Save expense" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("$13,860")).toBeVisible();
  await expect(page.getByText("$6,950")).toBeVisible();
  await expect(page.getByText("Datadog")).toBeVisible();
});

test("health endpoint is ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toMatchObject({ status: "ok" });
});
