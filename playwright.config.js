// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Dos fases, elegidas con TEST_PHASE (ver scripts de package.json):
 *
 *  - component   (npm run test:component)
 *      Prueba el contenedor AISLADO (home y navbar). Playwright levanta el
 *      contenedor dentro del runner. No necesita micro ni backend.
 *
 *  - integration (npm run test:integration)
 *      Prueba contra el entorno de integracion YA DESPLEGADO (contenedor + micro
 *      + backend reales). No levanta nada; solo necesita la URL.
 */
const phase = process.env.TEST_PHASE || 'component';
const isCI = !!process.env.CI;

const base = {
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: isCI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
};

if (phase === 'integration') {
  const url = process.env.INTEGRATION_CONTAINER_URL;
  if (!url) {
    throw new Error('Falta INTEGRATION_CONTAINER_URL (URL del contenedor desplegado en integracion).');
  }
  module.exports = defineConfig({
    ...base,
    testDir: './tests/e2e',
    use: { baseURL: url, trace: 'on-first-retry', screenshot: 'only-on-failure' },
  });
} else {
  const CONTAINER_URL = process.env.CONTAINER_URL || 'http://localhost:3000';
  module.exports = defineConfig({
    ...base,
    testDir: './tests/component',
    use: { baseURL: CONTAINER_URL, trace: 'on-first-retry', screenshot: 'only-on-failure' },
    webServer: {
      // En CI el build ya se hizo en un paso anterior
      command: isCI ? 'npm run start' : 'npm run dev',
      url: CONTAINER_URL,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  });
}
