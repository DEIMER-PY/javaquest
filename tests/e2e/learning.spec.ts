import { test, expect } from '@playwright/test';
test('bilingual navigation, assessment, persistence, and mobile layout', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByRole('heading', { name: /Tu aventura con Java/ })).toBeVisible();
  await page.screenshot({ path: 'docs/images/dashboard-desktop.png', fullPage: true });
  await page.getByRole('link', { name: 'Comenzar mi aventura' }).click();
  await expect(page.getByRole('heading', { name: '¿Por qué Java?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /James Gosling/ }).click();
  await page.getByRole('button', { name: 'Comprobar respuesta' }).click();
  await expect(page.getByRole('status').filter({ hasText: '¡Bien hecho!' })).toBeVisible();
  await page.goto('/es/profile');
  await expect(page.getByRole('heading', { name: /25/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: /25/ })).toBeVisible();
  await page.getByRole('link', { name: 'Cambiar idioma' }).click();
  await expect(page.getByRole('heading', { name: 'See how far you have come.' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/es');
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'docs/images/dashboard-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.getByRole('link', { name: 'Ruta de aprendizaje', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Tu ruta de aprendizaje' })).toBeVisible();
});
test('API rejects invalid grading and cross-origin writes', async ({ request }) => {
  expect(
    (await request.post('/api/quiz', { data: { lessonId: 'unknown', answer: 0 } })).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/quiz', {
        data: { lessonId: 'java-story', answer: 0 },
        headers: { Origin: 'https://evil.example' },
      })
    ).status(),
  ).toBe(403);
  const result = await request.post('/api/quiz', { data: { lessonId: 'java-story', answer: 1 } });
  expect(await result.json()).toMatchObject({ correct: false });
});
test('own playground compiles Java, supports multiple files, reports errors, and stops loops', async ({
  page,
}) => {
  page.on('pageerror', (error) => console.log('PAGE ERROR:', error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') console.log('BROWSER ERROR:', message.text());
  });
  await page.goto('/es/playground');
  await expect(page.locator('.cm-content')).toBeVisible();
  // Stop during a cold start, then retry: a cancelled initializer must not resurrect a worker.
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click();
  await page.getByRole('button', { name: 'Detener', exact: true }).click();
  await expect(page.locator('.editor-output')).toContainText('Ejecución detenida');
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click();
  await expect(page.locator('.editor-output')).toContainText('Hola, JavaQuest!', {
    timeout: 100000,
  });
  await page.screenshot({ path: 'docs/images/playground.png', fullPage: true });
  const editor = page.locator('.cm-content');
  await editor.fill('public class Main { public static void main(String[] args) { int x = ; } }');
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click();
  await expect(page.locator('.editor-output')).toContainText('error');
  await editor.fill(
    'public class Main { public static void main(String[] args) { System.out.println(new Persona().nombre); } }',
  );
  await page.getByRole('textbox', { name: 'Nombre del nuevo archivo' }).fill('Persona.java');
  await page.getByRole('button', { name: 'Añadir archivo' }).click();
  await editor.fill('public class Persona { String nombre = "Ada"; }');
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click();
  await expect(page.locator('.editor-output')).toContainText('Ada');
  await page.getByRole('button', { name: 'Main.java', exact: true }).click();
  await editor.fill(
    'public class Main { public static void main(String[] args) { while(true) {} } }',
  );
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click();
  await expect(page.locator('.editor-output')).toContainText('exceeded 5 seconds', {
    timeout: 80000,
  });
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click();
  await page.getByRole('button', { name: 'Detener', exact: true }).click();
  await expect(page.locator('.editor-output')).toContainText('Ejecución detenida');
});
