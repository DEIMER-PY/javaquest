import { test, expect } from '@playwright/test';
const pairs = [
  ['--foreground', '--background'],
  ['--subtle', '--background'],
  ['--subtle', '--card'],
  ['--primary-foreground', '--primary'],
  ['--link', '--card'],
  ['--code-fg', '--code-bg'],
  ['--code-comment', '--code-bg'],
  ['--code-keyword', '--code-bg'],
  ['--code-string', '--code-bg'],
  ['--positive', '--positive-bg'],
  ['--negative', '--negative-bg'],
];
for (const theme of ['light', 'dark'])
  test(`${theme} text and syntax tokens meet WCAG AA contrast`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('javaquest-theme', value), theme);
    await page.goto('/es');
    const values = await page.evaluate((list) => {
      const css = getComputedStyle(document.documentElement);
      return list.map((pair) => pair.map((token) => css.getPropertyValue(token).trim()));
    }, pairs);
    const luminance = (hex: string) => {
      let value = hex.replace('#', '');
      if (value.length === 3)
        value = value
          .split('')
          .map((c) => c + c)
          .join('');
      const rgb = [0, 2, 4]
        .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    values.forEach(([fg, bg], index) => {
      const a = luminance(fg),
        b = luminance(bg);
      expect(
        (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        pairs[index].join(' on '),
      ).toBeGreaterThanOrEqual(4.5);
    });
  });
