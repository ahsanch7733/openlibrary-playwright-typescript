
# Open Library Playwright Automation Assessment

## Overview

This project contains UI, API, and API-to-UI integration tests for [Open Library](https://openlibrary.org), implemented using Playwright Test and TypeScript.

The tests cover book searching, search result validation, book details, API responses, pagination, empty search results, and mocked frontend responses.

## Tech Stack

- Node.js
- TypeScript
- Playwright Test
- Open Library Search API
- HTML test report

## Prerequisites

- Node.js and npm installed
- Git installed (optional, for version control)

## Test Coverage

### 1. UI Tests

The UI tests cover:

- Searching for `The Hobbit`
- Verifying that search results are displayed
- Validating at least five book titles
- Checking author information when available
- Opening a book's details page
- Verifying book details against the selected search result
- Returning to the search results and checking the search context

### 2. API Tests

The API tests cover:

- Sending a GET request to `/search.json`
- Verifying the HTTP 200 response
- Checking that `numFound` is numeric and greater than zero
- Validating that search results are not empty
- Validating the first five book titles
- Handling optional author information
- Searching for a nonexistent book and verifying empty results
- Retrieving separate result pages using an explicit limit
- Checking that page results do not exceed the requested limit
- Checking for duplicate book keys across pages

### 3. API-to-UI Integration Test

The integration test:

1. Retrieves a book title from the Open Library Search API.
2. Searches for `The Hobbit` in the UI.
3. Compares the API title against the visible UI results.
4. Verifies that the API title appears in the UI search results.

File: `tests/integration/api-ui.spec.ts`

### 4. Mocked Tests

The mocked tests cover frontend behavior using controlled responses rather than depending entirely on live API data.

- Successful mocked search with two distinct books
- A mocked book with author information
- A mocked book without author information
- An empty search response
- An HTTP 500 error response
- Verification that the expected request is intercepted
- Verification of the resulting UI behavior

Mocked tests are maintained separately under `tests/mocks/`.

## How to Execute Tests

Run commands from the project root directory.

### Run all tests

```bash
npx playwright test
```

### Run UI tests

```bash
npx playwright test tests/ui
```

### Run API tests

```bash
npx playwright test tests/api
```

### Run API-to-UI integration tests

```bash
npx playwright test tests/integration/api-ui.spec.ts
```

### Run all mocked tests

```bash
npx playwright test tests/mocks
```

### Run the successful search mock

Use the actual filename for the successful mock test:

```bash
npx playwright test tests/mocks/search-mock.spec.ts
```

### Run the error-response mock

```bash
npx playwright test tests/mocks/search-error-mock.spec.ts
```

### Run tests in parallel

```bash
npx playwright test --workers=4
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Run a specific test file

```bash
npx playwright test path/to/your-test.spec.ts
```

## Test Reports

The project is configured to generate an HTML report.

Run the test suite:

```bash
npx playwright test
```

Open the report:

```bash
npx playwright show-report
```

To use a specific port:

```bash
npx playwright show-report --port 9323
```

## Debugging and Failure Artifacts

The Playwright configuration should retain traces and capture screenshots on failure.

To inspect a trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Check the `test-results` directory for failure artifacts. The exact files generated depend on the configured Playwright settings and the test outcome.

## Configuration

The Playwright configuration is maintained in:

```text
playwright.config.ts
```

It defines the test directory, browser project, base URL, reporter, parallel execution, and failure artifact settings.

## Project Structure

```text
project-root/
├── pages/
│   └── searchPage.ts
├── tests/
│   ├── ui/
│   ├── api/
│   ├── integration/
│   │   └── api-ui.spec.ts
│   └── mocks/
│       ├── search-mock.spec.ts
│       └── search-error-mock.spec.ts
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```
