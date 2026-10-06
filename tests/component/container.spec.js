// FASE COMPONENT: el contenedor aislado (baseURL = http://localhost:3000).
// El microfront NO esta disponible en esta fase, asi que aqui solo se prueba
// lo propio del contenedor: home, navbar y navegacion.
const { test, expect } = require('@playwright/test');

test.describe('Contenedor aislado', () => {
  test('contenedor carga correctamente', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Hola mundo desde el Contenedor' })
    ).toBeVisible();

    await expect(
      page.getByText('Usa el navbar para abrir el Microfront.')
    ).toBeVisible();
  });

  test('navbar tiene una sola opcion: Microfront', async ({ page }) => {
    await page.goto('/');

    const links = page.getByTestId('navbar').getByRole('link');
    await expect(links).toHaveCount(1);
    await expect(links.first()).toHaveText('Microfront');
    await expect(links.first()).toHaveAttribute('href', '/microfront');
  });

  test('navbar navega a la ruta del microfront', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Microfront' }).click();

    await expect(page).toHaveURL(/\/microfront$/);
    // El navbar sigue visible aunque el remoto no este disponible en esta fase
    await expect(page.getByTestId('navbar')).toBeVisible();
  });

  test('el agente de New Relic se sirve desde el contenedor', async ({ request }) => {
    const res = await request.get('/newrelic.js');
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('NREUM');
  });
});
