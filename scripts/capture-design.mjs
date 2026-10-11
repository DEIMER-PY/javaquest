import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch(process.env.CI ? {} : { channel: 'chrome' });
const base = process.env.BASE_URL ?? 'http://localhost:3000';
await mkdir('docs/images', { recursive: true });
try {
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext();
    await context.addInitScript((value) => localStorage.setItem('javaquest-theme', value), theme);
    const page = await context.newPage();
    for (const [name, route, width] of [
      ['landing-desktop', '/es', 1440],
      ['landing-mobile', '/es', 390],
      ['glossary', '/es/glossary', 1440],
      ['dashboard-desktop', '/es/dashboard', 1440],
      ['dashboard-mobile', '/es/dashboard', 390],
      ['playground', '/es/playground', 1440],
      ['lesson', '/es/lessons/jdk-jvm', 1440],
      ['resources-mobile', '/es/resources', 360],
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      if (name === 'playground') {
        await page.getByRole('button', { name: 'Ejecutar', exact: true }).click();
        await page.waitForFunction(
          () => document.querySelector('.editor-output')?.textContent?.includes('Hola, JavaQuest!'),
          undefined,
          { timeout: 90000 },
        );
      }
      await page.screenshot({ path: `docs/images/${name}-${theme}.png`, fullPage: true });
      if (
        theme === 'dark' &&
        ['dashboard-desktop', 'dashboard-mobile', 'playground'].includes(name)
      )
        await page.screenshot({ path: `docs/images/${name}.png`, fullPage: true });
      console.log(`${theme}: ${name}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
