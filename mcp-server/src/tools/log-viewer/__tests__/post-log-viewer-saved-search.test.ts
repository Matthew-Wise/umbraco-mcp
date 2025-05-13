import PostLogViewerSavedSearchTool from "../post/post-log-viewer-saved-search.js";
import { LogViewerSavedSearchBuilder } from "./helpers/log-viewer-saved-search-builder.js";
import { LogViewerTestHelper } from "./helpers/log-viewer-test-helper.js";
import { jest } from "@jest/globals";

const TEST_SEARCH_NAME = "_Test Saved Search";
const EXISTING_SEARCH_NAME = "_Existing Saved Search";

describe("post-log-viewer-saved-search", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    // Clean up any test saved searches
    await LogViewerTestHelper.cleanup(TEST_SEARCH_NAME);
    await LogViewerTestHelper.cleanup(EXISTING_SEARCH_NAME);
    console.error = originalConsoleError;
  });

  it("should create a saved search", async () => {
    // Create saved search model using builder
    const searchModel = new LogViewerSavedSearchBuilder()
      .withName(TEST_SEARCH_NAME)
      .withQuery("level:Error")
      .build();

    // Create the saved search
    const result = await PostLogViewerSavedSearchTool().handler(searchModel, {
      signal: new AbortController().signal,
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const item = await LogViewerTestHelper.findSavedSearch(TEST_SEARCH_NAME);
    expect(item).toBeDefined();
    expect(item.name).toBe(TEST_SEARCH_NAME);
    expect(item.query).toBe("level:Error");
  });

  it("should handle existing saved search", async () => {
    // Create saved search model
    const searchModel = new LogViewerSavedSearchBuilder()
      .withName(EXISTING_SEARCH_NAME)
      .withQuery("level:Error")
      .build();

    // First create the saved search
    await PostLogViewerSavedSearchTool().handler(searchModel, {
      signal: new AbortController().signal,
    });

    // Try to create it again
    const result = await PostLogViewerSavedSearchTool().handler(searchModel, {
      signal: new AbortController().signal,
    });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should create a saved search with complex query", async () => {
    // Create a more complex saved search
    const searchModel = new LogViewerSavedSearchBuilder()
      .withName(TEST_SEARCH_NAME)
      .withQuery("level:Error AND message:test")
      .build();

    const result = await PostLogViewerSavedSearchTool().handler(searchModel, {
      signal: new AbortController().signal,
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    const item = await LogViewerTestHelper.findSavedSearch(TEST_SEARCH_NAME);
    expect(item).toBeDefined();
    expect(item.name).toBe(TEST_SEARCH_NAME);
    expect(item.query).toBe("level:Error AND message:test");
  });
});
