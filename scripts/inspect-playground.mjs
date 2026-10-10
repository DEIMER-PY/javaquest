import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE', m.text());
  });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  page.on('requestfailed', (r) => console.log('REQUEST FAILED', r.url(), r.failure()));
  page.on('worker', (worker) => {
    console.log('WORKER', worker.url());
    worker.on('close', () => console.log('WORKER CLOSED'));
  });
  await page.goto('http://localhost:3000/es/playground');
  const run = page.getByRole('button', { name: 'Ejecutar', exact: true });
  await run.click({ timeout: 30000 });
  await page.waitForTimeout(15000);
  console.log('STATUS', await page.locator('.editor-status').innerText());
  console.log('OUTPUT', await page.locator('.editor-output').innerText());
} finally {
  await browser.close();
}
