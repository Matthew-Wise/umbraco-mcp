import DeleteLogViewerSavedSearchByNameTool from "../delete/delete-log-viewer-saved-search-by-name.js";
import { LogViewerSavedSearchBuilder } from "./helpers/log-viewer-saved-search-builder.js";
import { LogViewerTestHelper } from "./helpers/log-viewer-test-helper.js";
import { jest } from "@jest/globals";

const TEST_SEARCH_NAME = "_Test Saved Search";

describe("delete-log-viewer-saved-search-by-name", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    // Clean up any test saved searches
    await LogViewerTestHelper.cleanup(TEST_SEARCH_NAME);
    console.error = originalConsoleError;
  });

  it("should delete a saved search by name", async () => {
    // Create test saved search
    await new LogViewerSavedSearchBuilder()
      .withName(TEST_SEARCH_NAME)
      .withQuery("level:Error")
      .create();

    const result = await DeleteLogViewerSavedSearchByNameTool().handler(
      { name: TEST_SEARCH_NAME },
      { signal: new AbortController().signal }
    );

    // Verify the response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the saved search is deleted
    const item = await LogViewerTestHelper.findSavedSearch(TEST_SEARCH_NAME);
    expect(item).toBeUndefined();
  });

  it("should handle non-existent saved search", async () => {
    const result = await DeleteLogViewerSavedSearchByNameTool().handler(
      { name: "NonExistentSearch" },
      { signal: new AbortController().signal }
    );

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle empty name parameter", async () => {
    const result = await DeleteLogViewerSavedSearchByNameTool().handler(
      { name: "" },
      { signal: new AbortController().signal }
    );

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
});
