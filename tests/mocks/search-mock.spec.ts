
import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/searchPage';

test('mocked search should display two books', async ({ browser }) => {
    const context = await browser.newContext({
        baseURL: 'https://openlibrary.org',
    });

    let requestIntercepted = false;

    const mockHandler = async (route: any) => {
        const url = new URL(route.request().url());

        if (url.pathname !== '/search') {
            await route.continue();
            return;
        }

        console.log('MOCKED SEARCH PAGE:', url.href);
        requestIntercepted = true;

        await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: `
                <!DOCTYPE html>
                <html>
                  <body>
                    <ol>
                      <li class="searchResultItem">
                        <h3>
                          <a itemprop="name" href="/works/MOCK1">
                            Mock Book With Author
                          </a>
                        </h3>
                        <a itemprop="author" href="/authors/MOCKAUTHOR">
                          Mock Author
                        </a>
                      </li>
                      <li class="searchResultItem">
                        <h3>
                          <a itemprop="name" href="/works/MOCK2">
                            Mock Book Without Author
                          </a>
                        </h3>
                      </li>
                    </ol>
                  </body>
                </html>
            `,
        });
    };

    try {
        await context.route(
            'https://openlibrary.org/search**',
            mockHandler
        );

        const page = await context.newPage();
        const searchPage = new SearchPage(page);

        await test.step('Open Open Library', async () => {
            await searchPage.goto();
        });

        await test.step('Search for The Hobbit', async () => {
            await searchPage.mockSearch('The Hobbit');

            await expect(page).toHaveURL(
                /\/search\?q=The\+Hobbit/
            );
        });

        await test.step('Verify mock interception', async () => {
            expect(requestIntercepted).toBeTruthy();
        });

        await test.step('Verify mocked books', async () => {
            await expect(searchPage.resultCards).toHaveCount(2);

            expect(await searchPage.getResultTitle(0)).toBe(
                'Mock Book With Author'
            );

            expect(await searchPage.getResultAuthor(0)).toBe(
                'Mock Author'
            );

            expect(await searchPage.getResultTitle(1)).toBe(
                'Mock Book Without Author'
            );

            expect(await searchPage.getResultAuthor(1)).toBeNull();
        });
    } finally {
        await context.unroute(
            'https://openlibrary.org/search**',
            mockHandler
        );

        await context.close();
    }
});
