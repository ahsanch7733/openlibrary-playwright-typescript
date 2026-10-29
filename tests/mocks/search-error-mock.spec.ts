import { test, expect } from '@playwright/test';

test('search API error is handled', async ({ page }) => {
    let errorRequestIntercepted = false;

    page.on('request', request => {
        if (request.url().includes('search')) {
            console.log('SEARCH REQUEST:', request.url());
        }
    });

    await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (
            url.hostname === 'openlibrary.org' &&
            url.pathname === '/search.json' &&
            url.searchParams.get('q') === 'MockServerError123'
        ) {
            console.log('MOCKING ERROR:', url.href);
            errorRequestIntercepted = true;
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'Internal Server Error',
                }),
            });

            return;
        }
        await route.continue();
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Search' }).click();
    const searchInput = page.getByPlaceholder(
        'Search books and authors…'
    );

    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill('MockServerError123');
    await page.waitForLoadState('domcontentloaded');
    console.log('ERROR REQUEST INTERCEPTED:', errorRequestIntercepted);
    
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveValue('MockServerError123');
});