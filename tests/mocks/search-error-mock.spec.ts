
import { test, expect } from '@playwright/test';

test('search API error is handled', async ({ page }) => {
    let errorRequestIntercepted = false;

    await page.route('**/search.json**', async route => {
        const url = new URL(route.request().url());

        console.log('SEARCH JSON REQUEST:', url.href);

        if (url.searchParams.get('q') === 'MockServerError123') {
            errorRequestIntercepted = true;

            console.log('MOCKING ERROR:', url.href);

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

    const searchButton = page.getByRole('button', {
        name: 'Search',
    });

    await searchButton.click();

    const searchInput = page.getByPlaceholder(
        'Search books and authors…'
    );

    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('MockServerError123');
    await searchInput.press('Enter');

    await expect.poll(
        () => errorRequestIntercepted,
        { timeout: 15000 }
    ).toBe(true);

    console.log('ERROR REQUEST INTERCEPTED:', errorRequestIntercepted);
    console.log('Current URL:', page.url());
});
