import GetLogViewerSavedSearchByNameTool from "../get/get-log-viewer-saved-search-by-name.js";
import { LogViewerSavedSearchBuilder } from "./helpers/log-viewer-saved-search-builder.js";
import { LogViewerTestHelper } from "./helpers/log-viewer-test-helper.js";
import { jest } from "@jest/globals";

const TEST_SEARCH_NAME = "_Test Saved Search";

describe("get-log-viewer-saved-search-by-name", () => {
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

  it("should get a saved search by name", async () => {
    // Create test saved search
    const builder = await new LogViewerSavedSearchBuilder()
      .withName(TEST_SEARCH_NAME)
      .withQuery("level:Error")
      .create();

    const result = await GetLogViewerSavedSearchByNameTool().handler(
      { name: TEST_SEARCH_NAME },
      { signal: new AbortController().signal }
    );

    // Verify the response using snapshot
    expect(result).toMatchSnapshot();

    // Parse the response and verify structure
    const response = JSON.parse(result.content[0].text as string);
    expect(response).toBeDefined();
    expect(response.name).toBe(TEST_SEARCH_NAME);
    expect(response.query).toBe("level:Error");
  });

  it("should handle non-existent saved search", async () => {
    const result = await GetLogViewerSavedSearchByNameTool().handler(
      { name: "NonExistentSearch" },
      { signal: new AbortController().signal }
    );

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle empty name parameter", async () => {
    const result = await GetLogViewerSavedSearchByNameTool().handler(
      { name: "" },
      { signal: new AbortController().signal }
    );

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
});
