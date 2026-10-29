import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/searchPage';

test('@apiui API book result should match a UI search result', async ({ page, request,}) => {
    let apiTitle = '';
    await test.step('Get a book title from the API', async () => {
        const response = await request.get('/search.json', {
            params: {
                q: 'The Hobbit',
                limit: 5,
            },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.docs.length).toBeGreaterThan(0);
        apiTitle = body.docs[0].title;
        expect(apiTitle).toBeTruthy();
    });

    await test.step('Search for the book in the UI', async () => {
        const searchPage = new SearchPage(page);
        await searchPage.goto();
        await searchPage.search('The Hobbit');
        await searchPage.waitForResults();
        const count = await searchPage.getResultCount();
        expect(count).toBeGreaterThan(0);
        let titleFound = false;
        for (let i = 0; i < count; i++) {
            const uiTitle = await searchPage.getResultTitle(i);
            if (uiTitle.trim().toLowerCase() === apiTitle.trim().toLowerCase()) {
                titleFound = true;
                break;
            }
        }
        expect(
            titleFound,
            `API title "${apiTitle}" should appear in the UI search results`,
        ).toBeTruthy();
    });
});