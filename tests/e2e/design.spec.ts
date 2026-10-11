import { test, expect } from '@playwright/test';
const routes = [
  '',
  '/dashboard',
  '/learn',
  '/glossary',
  '/lessons/java-story',
  '/lessons/jdk-jvm',
  '/playground',
  '/projects',
  '/projects/task-manager',
  '/resources',
  '/profile',
  '/login',
];
test('public curriculum, glossary, theme persistence, and keyboard navigation', async ({
  page,
}) => {
  await page.goto('/es');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('heading', { name: /De cero a/ })).toBeVisible();
  await page.getByRole('link', { name: 'Ver temario', exact: true }).first().click();
  await expect(page.locator('#temario')).toBeInViewport();
  await page.getByRole('button', { name: 'Expandir todo' }).click();
  await expect(page.locator('.curriculum-toggle[aria-expanded="true"]')).toHaveCount(6);
  await page.getByRole('button', { name: 'Contraer todo' }).click();
  await expect(page.locator('.curriculum-toggle[aria-expanded="true"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Glosario', exact: true }).click();
  await expect(page.locator('.glossary-card')).toHaveCount(30);
  await page.getByRole('searchbox', { name: 'Buscar conceptos' }).fill('ENCAPSULACION');
  await expect(page.locator('.glossary-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Encapsulación', exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Buscar conceptos' }).fill('concepto-inexistente-xyz');
  await expect(page.getByRole('heading', { name: 'Ese concepto aún no aparece.' })).toBeVisible();
  await page.getByRole('button', { name: 'Ver todos los conceptos' }).click();
  await page.getByRole('button', { name: 'Objetos', exact: true }).click();
  await expect(page.locator('.glossary-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Activar modo claro' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Activar modo oscuro' })).toBeVisible();
  await page.getByRole('link', { name: 'Cambiar idioma' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: /Understand the words/ })).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});
for (const theme of ['light', 'dark'] as const)
  for (const locale of ['es', 'en'] as const) {
    test(`${locale}/${theme}: all screens fit mobile, tablet, and desktop`, async ({ page }) => {
      test.setTimeout(300000);
      await page.addInitScript((value) => localStorage.setItem('javaquest-theme', value), theme);
      for (const width of [320, 360, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const route of routes) {
          await page.goto(`/${locale}${route}`, { waitUntil: 'domcontentloaded' });
          await expect(page.locator('h1')).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          if (route === '/playground') await expect(page.locator('.cm-editor')).toBeVisible();
          const controls = await page.locator('[data-slot="button"]').evaluateAll((elements) =>
            elements
              .map((e) => e.getBoundingClientRect())
              .filter((r) => r.width > 0 && r.height > 0)
              .map((r) => r.height),
          );
          expect(
            controls.every((height) => height >= 43.5),
            `touch targets: ${locale}/${theme}/${width}${route}`,
          ).toBe(true);
          const size = await page.evaluate(() => ({
            viewport: innerWidth,
            document: document.documentElement.scrollWidth,
          }));
          expect(size.document, `${locale}/${theme}/${width}${route}`).toBeLessThanOrEqual(
            size.viewport + 1,
          );
          expect(await page.locator('html').getAttribute('class')).toBe(
            theme === 'dark' ? 'dark' : '',
          );
        }
      }
    });
  }
