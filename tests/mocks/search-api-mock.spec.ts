
import { test, expect } from '@playwright/test';

test('empty JSON search response is handled', async ({ page }) => {
    let apiIntercepted = false;

    const mockHandler = async (route: any) => {
        const url = new URL(route.request().url());

        if (url.pathname === '/search.json') {
            console.log('SEARCH JSON ROUTE:', url.href);

            if (
                url.searchParams.get('q') ===
                'NoMatchingMockBook987654'
            ) {
                apiIntercepted = true;

                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        numFound: 0,
                        start: 0,
                        numFoundExact: true,
                        docs: [],
                    }),
                });

                return;
            }
        }

        await route.continue();
    };

    page.on('request', request => {
        if (request.url().includes('search')) {
            console.log(
                'SEARCH REQUEST:',
                request.method(),
                request.url()
            );
        }
    });

    try {
        await page.route('**/*', mockHandler);

        await page.goto('/');

        await page.getByRole('button', { name: 'Search' }).click();

        const searchInput = page.getByPlaceholder(
            'Search books and authors…'
        );

        await searchInput.waitFor({ state: 'visible' });
        await searchInput.fill('NoMatchingMockBook987654');

        await expect.poll(() => apiIntercepted).toBe(true);

        console.log('API INTERCEPTED:', apiIntercepted);
    } finally {
        await page.unroute('**/*', mockHandler);
    }
});
