import { expect, test } from '@playwright/test';
async function hydrated(page: import('@playwright/test').Page) { await expect(page.locator('.oe-design[data-ready="true"]')).toBeVisible(); }
test('desktop exposes and renders every model through the visible graph library', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/graphs');
    await hydrated(page);
    const library = page.getByRole('navigation', { name: 'Graph library' });
    await expect(library).toBeVisible();
    const items = await page.locator('select option').evaluateAll(options => options.map(o => ({ id: (o as HTMLOptionElement).value, title: o.textContent ?? '' })));
    expect(items).toHaveLength(68);
    await expect(library.locator('button[data-graph-id]')).toHaveCount(items.length);
    await expect(library.getByText('AP Microeconomics', { exact: true })).toBeVisible();
    await expect(library.getByText('AP Macroeconomics', { exact: true })).toBeAttached();
    await expect(page.getByRole('searchbox', { name: 'Search graphs' })).toBeVisible();
    expect(await page.getByRole('searchbox', { name: 'Search graphs' }).evaluate(el => parseFloat(getComputedStyle(el).paddingLeft))).toBeGreaterThanOrEqual(30);
    await page.getByRole('searchbox', { name: 'Search graphs' }).fill('money');
    await expect.poll(() => library.locator('button[data-graph-id]').count()).toBeGreaterThan(0);
    expect(await library.locator('button[data-graph-id]').count()).toBeLessThan(68);
    await page.getByRole('searchbox', { name: 'Search graphs' }).fill('');
    await expect(library.locator('button[data-graph-id]')).toHaveCount(68);
    for (const item of items) {
        await library.locator(`button[data-graph-id="${item.id}"]`).click();
        await expect(page.getByRole('heading', { level: 2, name: item.title, exact: true })).toBeVisible();
        await expect(library.locator(`button[data-graph-id="${item.id}"]`)).toHaveAttribute('aria-current', 'page');
        const diagram = page.locator('[data-graph-diagram]');
        const drawing = diagram.locator('svg[role="img"], [data-graph-custom]').first();
        await expect(drawing, `${item.id}: visible drawing`).toBeVisible();
        const box = await drawing.boundingBox();
        expect(box?.width, `${item.id}: usable desktop drawing width`).toBeGreaterThan(350);
        expect(box?.height, `${item.id}: drawing is not collapsed`).toBeGreaterThan(150);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), item.id).toBe(true);
    }
});
test('PPC canvas and controls do not overlap at the reported wide desktop size', async ({ page }) => {
    await page.setViewportSize({ width: 2374, height: 1656 });
    await page.goto('/graphs');
    await hydrated(page);
    await expect(page.getByRole('navigation', { name: 'Graph library' })).toBeVisible();
    const canvas = page.locator('[data-graph-diagram] svg[role="img"]').first();
    await expect(canvas).toBeVisible();
    const drawing = await canvas.boundingBox();
    expect(drawing?.width).toBeGreaterThan(650);
    const reset = await page.getByRole('button', { name: 'Reset', exact: true }).boundingBox();
    expect(reset!.x).toBeGreaterThan(drawing!.x + drawing!.width);
    const slider = page.getByRole('slider').first();
    const initial = await slider.inputValue();
    await slider.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(slider).not.toHaveValue(initial);
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(slider).toHaveValue(initial);
});
test('narrow layouts expose the full picker and can switch to a macro model', async ({ page }) => {
    for (const width of [390, 900]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto('/graphs');
        await hydrated(page);
        const picker = page.getByRole('combobox', { name: 'Choose a graph' });
        await expect(picker).toBeVisible();
        await expect(picker.locator('option')).toHaveCount(68);
        await picker.selectOption('ad-as-model');
        await expect(page.getByRole('heading', { level: 2 })).toHaveText('The AD–AS Model');
        const canvas = page.locator('[data-graph-diagram] svg[role="img"]').first();
        await expect(canvas).toBeVisible();
        expect((await canvas.boundingBox())!.width).toBeGreaterThan(250);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
});
