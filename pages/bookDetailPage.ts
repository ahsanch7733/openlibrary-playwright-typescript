import { Page, Locator, expect } from '@playwright/test';

export class BookDetailsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly author: Locator;
      readonly searchScreenInput: Locator;


  constructor(page: Page) {
    this.page = page;
    this.title = page.locator("div.work-title-and-author.desktop h1.work-title[itemprop='name']");
    this.author = page.locator('h2.edition-byline a[itemprop="author"]');
        this.searchScreenInput = page.getByPlaceholder('Search');

  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  async getAuthor(): Promise<string | null> {
    if (await this.author.count() === 0) {
      return null;
    }

    return (await this.author.first().textContent())?.trim() ?? null;
  }
}