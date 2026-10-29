import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/searchPage';

test.describe('@search Open Library UI Search', () => {

    test(' search for The Hobbit and display at least five results', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await test.step('Open Open Library', async () => {
            await searchPage.goto();
        });
        await test.step('Search for The Hobbit', async () => {
            await searchPage.search('The Hobbit');
        });
        await test.step('Verify search results', async () => {
            await searchPage.waitForResults();
            const count = await searchPage.getResultCount();
            console.log('Result count:', count);
            expect(count).toBeGreaterThanOrEqual(5);
            console.log('Result count:', count);
        });
        await test.step('Validate first five results', async () => {
            expect(await searchPage.getResultCount()).toBeGreaterThanOrEqual(5);
            for (let i = 0; i < 5; i++) {
                const title = await searchPage.getResultTitle(i);
                const author = await searchPage.getResultAuthor(i);

                expect(title).not.toBe('');
                console.log(`Title: ${title}`);
                if (author) {
                    console.log(`Author: ${author}`);
                } else {
                    console.log('Author: not provided');
                }
            }
        });
    });
});