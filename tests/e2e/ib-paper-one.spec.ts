import { expect, test } from '@playwright/test';

const topics = [
  { route: '/practice/ib/1-1', title: 'What is economics?', count: 20 },
  { route: '/practice/ib/2-1', title: 'Demand', count: 50 },
  { route: '/practice/ib/4-10', title: 'Growth and Development Strategies', count: 50 },
];

test('lists the complete IB Paper 1 bank by supplied topic', async ({ page }) => {
  await page.goto('/practice/ib');
  await expect(page.getByRole('heading', { name: 'IB Economics' })).toBeVisible();
  await expect(page.locator('.practice-topic-row')).toHaveCount(30);
  await expect(page.locator('.practice-catalog-summary')).toContainText('1,290');
  for (const topic of topics) {
    await page.goto(topic.route);
    await expect(page.getByRole('heading', { name: topic.title, exact: true })).toBeVisible();
    await expect(page.getByText(`Question 1 of ${topic.count}`, { exact: false })).toBeVisible();
    await expect(page.getByText('10 marks', { exact: true })).toBeVisible();
    await expect(page.getByText('15 marks', { exact: true })).toBeVisible();
  }
});

test('filters HL questions and restores both response drafts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/practice/ib/2-1?q=41');
  await expect(page.getByText('QUESTION 41 OF 50')).toBeVisible();
  await expect(page.locator('article').getByText('HL', { exact: true })).toBeVisible();
  await page.getByLabel('Syllabus level').getByRole('button', { name: 'HL', exact: true }).click();
  await expect(page.getByLabel('Jump to question').locator('option')).toHaveCount(10);
  await page.getByLabel('Your response').first().fill('The diagram shows a movement along demand.');
  await page.getByLabel('Your response').last().fill('A real-world case requires conditional evaluation.');
  await expect(page.getByRole('status')).toContainText('Saved on this device');
  await page.reload();
  await expect(page.getByLabel('Your response').first()).toHaveValue('The diagram shows a movement along demand.');
  await expect(page.getByLabel('Your response').last()).toHaveValue('A real-world case requires conditional evaluation.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('shows the shared design and restores saved questions and responses', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/practice/ib/1-1');
  const submit = page.getByRole('button', { name: 'Submit for grading', exact: true });
  await expect(submit).toBeDisabled();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByLabel('Your response').first().fill('Resources remain scarce relative to unlimited wants.');
  await page.getByLabel('Your response').last().fill('Technological progress increases output but does not eliminate opportunity cost.');
  await expect(page.getByText('1 of 20 questions answered', { exact: true })).toBeVisible();
  await expect(submit).toBeEnabled();
  await expect(page.getByRole('status')).toContainText('Saved on this device');
  await page.screenshot({ path: 'test-results/ib-design-desktop.png', fullPage: true });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Your response').first()).toHaveValue('Resources remain scarce relative to unlimited wants.');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(submit).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/ib-design-mobile.png', fullPage: true });
});
