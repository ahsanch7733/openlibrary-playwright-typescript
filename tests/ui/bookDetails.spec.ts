import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/searchPage';
import { BookDetailsPage } from '../../pages/bookDetailPage';
let selectedTitle: string = '';
test('@book book details match the selected search result', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await test.step('Search for The Hobbit', async () => {
        await searchPage.goto();
        await searchPage.search('The Hobbit');
        await searchPage.waitForResults();
    });

    await test.step('Open the first book result', async () => {
        const resultCount = await searchPage.getResultCount();
        expect(resultCount).toBeGreaterThan(0);

        selectedTitle = await searchPage.getResultTitle(0);
        expect(selectedTitle).not.toBe('');
        await searchPage.openResult(0);
        await searchPage.clickVerifyHumanButton();
        await page.waitForLoadState('domcontentloaded');

        await expect(page).toHaveURL(/\/works\/|\/books\//);
    });

    await test.step('Verify the details page title', async () => {
        const bookDetailsPage = new BookDetailsPage(page);
        await expect(bookDetailsPage.title.first()).toBeVisible();
        const detailsTitle = await bookDetailsPage.getTitle();
        expect(detailsTitle).toBe(selectedTitle);
        expect(detailsTitle).not.toBe('');
    });

    await test.step('Navigate back to search results', async () => {
        await page.goBack();
        await expect(page).toHaveURL(/search/);
        await expect(searchPage.resultCards.first()).toBeVisible();
        await expect(searchPage.searchScreenInput).toHaveValue('The Hobbit');
    });
});