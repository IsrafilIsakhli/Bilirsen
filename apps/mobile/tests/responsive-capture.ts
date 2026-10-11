import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdir, rm } from 'node:fs/promises';

// Measure text itself, not only the document: the stage clips horizontal overflow.
export async function assertTextFits(page: Page) {
  const overflowing = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const failures: string[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || parent.closest('svg, script, style') || !node.textContent?.trim()) continue;
      const style = getComputedStyle(parent);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        !parent.getClientRects().length
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of Array.from(range.getClientRects())) {
        if (rect.top >= innerHeight || rect.bottom <= 0) continue;
        if (rect.left < -1 || rect.right > innerWidth + 1) failures.push(node.textContent.trim());
      }
    }
    return failures;
  });
  expect(overflowing, 'Visible text must stay inside the phone width').toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

export async function captureResponsive(page: Page, group: string, name: string) {
  if (!/^[a-z0-9-]+$/.test(group) || !/^[a-z0-9-]+$/.test(name))
    throw new Error('Invalid capture name');
  const directory = `output/testing/studio-polish/${group}`;
  await mkdir(directory, { recursive: true });
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 844 });
    await assertTextFits(page);
    await page.screenshot({ path: `${directory}/${name}-${width}.png`, animations: 'disabled' });
    const scrollable = page.locator('div').filter({ visible: true });
    // Walk the actual native ScrollView through its content; fullPage cannot expand it.
    const scrollIndex = await scrollable.evaluateAll((elements) =>
      elements.findIndex((element) => {
        const style = getComputedStyle(element);
        return (
          /auto|scroll/.test(style.overflowY) &&
          element.clientHeight > 180 &&
          element.scrollHeight > element.clientHeight + 4
        );
      }),
    );
    if (scrollIndex >= 0) {
      const view = scrollable.nth(scrollIndex);
      const steps = await view.evaluate((element) =>
        Math.ceil(element.scrollHeight / (element.clientHeight * 0.75)),
      );
      for (let step = 1; step <= steps; step++) {
        await view.evaluate((element, index) => {
          element.scrollTop = index * element.clientHeight * 0.75;
        }, step);
        await assertTextFits(page);
      }
      await page.screenshot({
        path: `${directory}/${name}-${width}-bottom.png`,
        animations: 'disabled',
      });
      await view.evaluate((element) => {
        element.scrollTop = 0;
      });
    } else {
      // A shorter new layout must not offer a stale bottom image from an earlier capture.
      await rm(`${directory}/${name}-${width}-bottom.png`, { force: true });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
}
