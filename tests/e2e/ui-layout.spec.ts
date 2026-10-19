import { expect, test } from '@playwright/test';

for (const width of [320, 768, 1440]) {
  test(`public and learning layouts fit ${width}px screens`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/people', '/contact', '/terms', '/courses', '/learn/olympiad', '/learn/saved']) {
      await page.goto(route);
      await expect(page.locator('[data-ready="true"]')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
      expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)), route).toBe(true);
    }
    const footer = await page.locator('.oe-learning-footer').boundingBox();
    expect(footer!.y + footer!.height).toBeGreaterThanOrEqual(899);
    await page.goto('/learn/olympiad');
    const hero = await page.locator('.studio-hero').boundingBox();
    const tabs = await page.locator('.tabs').boundingBox();
    expect(tabs!.y - (hero!.y + hero!.height)).toBeLessThan(50);
    expect(hero!.height).toBeLessThan(260);
  });
}

test('mobile learning drawer leaves no shadow or interactive obstruction when closed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/learn');
  await expect(page.locator('[data-ready="true"]')).toBeVisible();
  const drawer = page.locator('#learning-nav');
  await expect(drawer).toBeHidden();
  const toggle = page.getByRole('button', { name: 'Toggle learning navigation' });
  await toggle.click();
  await expect(drawer).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await page.getByRole('button', { name: 'Close learning navigation', exact: true }).click({ position: { x: 370, y: 100 } });
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await toggle.click();
  await page.getByRole('link', { name: 'Courses', exact: true }).click();
  await expect(page).toHaveURL(/\/courses$/);
  await expect(drawer).toBeHidden();
});

test('course cards use readable full-width titles and aligned actions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/courses');
  const cards = page.locator('.oe-course-tile');
  await expect(cards).toHaveCount(4);
  const first = await cards.nth(0).locator('.text-link').boundingBox();
  const second = await cards.nth(1).locator('.text-link').boundingBox();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(2);
  await expect(page.getByRole('textbox', { name: 'Search courses' })).toHaveCSS('padding', '0px');
  await page.getByRole('textbox', { name: 'Search courses' }).fill('macroeconomics');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('AP Macroeconomics');
});

test('lesson listings and direct lesson links show the launch placeholder', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/learn/lessons');
  await expect(page.getByRole('heading', { name: 'Coming soon' })).toBeVisible();
  await expect(page.locator('.lesson-row')).toHaveCount(0);
  await page.goto('/course/ap-microeconomics');
  await expect(page.getByRole('heading', { name: 'Coming soon' })).toBeVisible();
  await expect(page.locator('.lesson-row')).toHaveCount(0);
  await page.goto('/course/ap-microeconomics/scarcity-and-economic-thinking');
  await expect(page.getByRole('heading', { name: 'Coming soon' })).toBeVisible();
  await expect(page.getByText('Step 1 of 7', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
