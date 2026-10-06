// FASE INTEGRATION: entorno desplegado de verdad.
//   baseURL                    = INTEGRATION_CONTAINER_URL  (contenedor recien publicado)
//   INTEGRATION_MICROFRONT_URL = donde esta desplegado el microfront
// Valida el recorrido completo: contenedor -> navbar -> microfront -> backend real.
const { test, expect } = require('@playwright/test');

const MICRO_URL = process.env.INTEGRATION_MICROFRONT_URL;

test.describe('Integracion: contenedor + microfront + backend', () => {
  test('flujo completo contenedor -> navbar -> microfront -> backend', async ({ page }) => {
    // 1. Contenedor
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Hola mundo desde el Contenedor' })
    ).toBeVisible();

    // 2. Navbar -> microfront (Module Federation)
    await page.getByRole('link', { name: 'Microfront' }).click();
    await expect(page).toHaveURL(/\/microfront$/);
    await expect(page.getByTestId('backend-panel')).toBeVisible({ timeout: 30_000 });

    // 3. GET /hello contra el backend real
    const [helloRes] = await Promise.all([
      page.waitForResponse((r) => new URL(r.url()).pathname === '/api/hello'),
      page.getByTestId('btn-hello').click(),
    ]);
    expect(helloRes.status()).toBe(200);
    await expect(page.getByTestId('result-body')).toContainText('"message": "hola mundo"');

    // 4. POST /echo
    await page.getByTestId('input-echo').fill('flujo e2e');
    const [echoReq] = await Promise.all([
      page.waitForRequest((r) => new URL(r.url()).pathname === '/api/echo'),
      page.getByTestId('btn-echo').click(),
    ]);
    expect(echoReq.postDataJSON()).toEqual({ text: 'flujo e2e' });
    await expect(page.getByTestId('result-body')).toContainText('"text": "flujo e2e"');

    // 5. Endpoint que falla
    await page.getByTestId('btn-error').click();
    await expect(page.getByTestId('result-status')).toHaveText('500');

    // 6. Volver al contenedor
    await page.goBack();
    await expect(
      page.getByRole('heading', { name: 'Hola mundo desde el Contenedor' })
    ).toBeVisible();
  });

  test('el microfront desplegado expone su remoteEntry', async ({ request }) => {
    test.skip(!MICRO_URL, 'INTEGRATION_MICROFRONT_URL no definida');
    const res = await request.get(`${MICRO_URL}/_next/static/chunks/remoteEntry.js`);
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('BackendPanel');
  });
});
