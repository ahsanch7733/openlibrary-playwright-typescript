import { test, expect } from '@playwright/test';

test.describe('@api Open Library Search API', () => {

    test('should return valid results for The Hobbit', async ({ request }) => {
        const response = await request.get('/search.json', {
            params: {
                q: 'The Hobbit',
            },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(typeof body.numFound).toBe('number');
        expect(body.numFound).toBeGreaterThan(0);
        expect(Array.isArray(body.docs)).toBeTruthy();
        expect(body.docs.length).toBeGreaterThan(0);
    });

    test('should validate the first five The Hobbit results', async ({ request }) => {
        const response = await request.get('/search.json', {
            params: {
                q: 'The Hobbit',
                limit: 5,
            },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.docs.length).toBeGreaterThanOrEqual(5);
        for (let i = 0; i < 5; i++) {
            const book = body.docs[i];
            expect(book.title, `Result ${i + 1} should have a title`)
                .toBeTruthy();
            console.log(`Result ${i + 1}: ${book.title}`);
            if (book.author_name) {
                console.log(`Author: ${book.author_name.join(', ')}`);
            } else {
                console.log('Author: not provided');
            }
        }
    });

    test('should return empty results for a nonsense query', async ({ request }) => {
        const response = await request.get('/search.json', {
            params: {
                q: 'xyznonexistentbook987654321',
            },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(typeof body.numFound).toBe('number');
        expect(body.numFound).toBe(0);
        expect(Array.isArray(body.docs)).toBeTruthy();
        expect(body.docs.length).toBe(0);
    });

    test('should return different books on consecutive pages', async ({ request }) => {
        const pageSize = 5;
        const response1 = await request.get('/search.json', {
            params: {
                q: 'The Hobbit',
                limit: pageSize,
                offset: 0,
            },
        });
        const response2 = await request.get('/search.json', {
            params: {
                q: 'The Hobbit',
                limit: pageSize,
                offset: pageSize,
            },
        });
        expect(response1.status()).toBe(200);
        expect(response2.status()).toBe(200);
        const page1 = await response1.json();
        const page2 = await response2.json();
        expect(page1.docs).toHaveLength(pageSize);
        expect(page2.docs).toHaveLength(pageSize);
        for (const book1 of page1.docs) {
            for (const book2 of page2.docs) {
                expect(book1.key).not.toBe(book2.key);
            }
        }
    });

    test('@apiq limit parameter should control the number of returned books', async ({ request, }) => {
        const limit = 5;
        const response = await request.get(
            'https://openlibrary.org/search.json?q=The%20Hobbit&limit=' + limit
        );
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.numFound).toBeGreaterThan(0);
        expect(body.docs).toHaveLength(limit);
        console.log('Requested limit:', limit);
        console.log('Returned books:', body.docs.length);
    });

test(' sorting by publication year should change result order', async ({
  request,
}) => {
  const defaultResponse = await request.get('/search.json', {
    params: {
      q: 'The Hobbit',
      limit: 10,
    },
  });

  const sortedResponse = await request.get('/search.json', {
    params: {
      q: 'The Hobbit',
      sort: 'old',
      limit: 10,
    },
  });

  expect(defaultResponse.status()).toBe(200);
  expect(sortedResponse.status()).toBe(200);

  const defaultBody = await defaultResponse.json();
  const sortedBody = await sortedResponse.json();

  expect(defaultBody.docs.length).toBeGreaterThan(0);
  expect(sortedBody.docs.length).toBeGreaterThan(0);

  const defaultKeys: string[] = [];
  const sortedKeys: string[] = [];

  for (const book of defaultBody.docs) {
    if (book.key) {
      defaultKeys.push(book.key);
    }
  }

  for (const book of sortedBody.docs) {
    if (book.key) {
      sortedKeys.push(book.key);
    }
  }

  console.log('Default order:', defaultKeys);
  console.log('Oldest-first order:', sortedKeys);

  expect(sortedKeys).not.toEqual(defaultKeys);
});
});