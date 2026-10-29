import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;

  readonly searchInput: Locator;
    readonly searchScreenInput: Locator;

  readonly searchButton: Locator;
  readonly resultCards: Locator;
  readonly seeAllProductsButton: Locator;
    readonly verifyHumanButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByPlaceholder('Search books and authors…');
    this.searchScreenInput = page.locator('.searchbox input.searchbox__input');

    this.searchButton = page.getByRole('button', {
      name: 'Search',
    });
    this.seeAllProductsButton = page.getByRole('button', {
      name: /See all \d+ books/i,
    });

    this.resultCards = page.locator('li.searchResultItem');

    this.verifyHumanButton = page.locator('#verify-human-btn');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {        
        await this.searchButton.waitFor({ state: 'visible' });
        await this.searchButton.click();
        await this.searchInput.waitFor({ state: 'visible' });

    await this.searchInput.fill(term);
    await this.seeAllProductsButton.click();
  }

 async mockSearch(term: string) {
  await this.searchButton.waitFor({ state: 'visible' });
  await this.searchButton.click();

  await this.searchInput.waitFor({ state: 'visible' });
  await this.searchInput.fill(term);

  console.log(
    'Before See All:',
    await this.searchInput.inputValue()
  );

  await this.seeAllProductsButton.waitFor({ state: 'visible' });

  console.log(
    'See All button:',
    await this.seeAllProductsButton.getAttribute('aria-label')
  );

  await this.seeAllProductsButton.click();

  console.log('URL after click:', this.page.url());
}
    async waitForResults() {
    await expect(this.resultCards.first()).toBeVisible();
  }

  async getResultCount() {
    return this.resultCards.count();
  }

  async getResultTitle(index: number) {
    const card = this.resultCards.nth(index);

    return (
        await card.locator('[itemprop="name"]').first().textContent()
    )?.trim() ?? '';
}

async getResultAuthor(index: number) {
    const card = this.resultCards.nth(index);

    const author = card.locator('[itemprop="author"]');

    if (await author.count() === 0) {
        return null;
    }

    return (await author.first().textContent())?.trim() ?? null;
}


async openResult(index: number): Promise<void> {
  const card = this.resultCards.nth(index);
  await card.locator('a').first().click();
}
async clickVerifyHumanButton() {
    await this.verifyHumanButton.waitFor({ state: 'visible' });
    await this.verifyHumanButton.click();
  }
}