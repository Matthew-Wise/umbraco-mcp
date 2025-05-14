import { LogViewerSavedSearchBuilder } from "./log-viewer-saved-search-builder.js";
import { LogViewerTestHelper } from "./log-viewer-test-helper.js";
import { jest } from "@jest/globals";

describe("LogViewerSavedSearchBuilder", () => {
  const TEST_SEARCH_NAME = "_Test Builder Saved Search";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    await LogViewerTestHelper.cleanup(TEST_SEARCH_NAME);
    console.error = originalConsoleError;
  });

  describe("construction", () => {
    it("should create a builder with default values", () => {
      const builder = new LogViewerSavedSearchBuilder();
      const model = builder.build();

      expect(model).toEqual({
        name: "",
        query: "",
      });
    });
  });

  describe("builder methods", () => {
    let builder: LogViewerSavedSearchBuilder;

    beforeEach(() => {
      builder = new LogViewerSavedSearchBuilder();
    });

    it("should set name", () => {
      builder.withName(TEST_SEARCH_NAME);
      const model = builder.build();

      expect(model.name).toBe(TEST_SEARCH_NAME);
    });

    it("should set query", () => {
      const query = "level:Error";
      builder.withQuery(query);
      const model = builder.build();

      expect(model.query).toBe(query);
    });

    it("should chain builder methods", () => {
      const query = "level:Error AND message:test";

      builder.withName(TEST_SEARCH_NAME).withQuery(query);

      const model = builder.build();

      expect(model).toMatchObject({
        name: TEST_SEARCH_NAME,
        query,
      });
    });
  });

  describe("creation and retrieval", () => {
    it("should create and retrieve a saved search", async () => {
      const builder = await new LogViewerSavedSearchBuilder()
        .withName(TEST_SEARCH_NAME)
        .withQuery("level:Error")
        .create();

      const item = builder.getCreatedItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_SEARCH_NAME);
      expect(item.query).toBe("level:Error");
    });

    it("should require name and query for creation", async () => {
      const builder = new LogViewerSavedSearchBuilder();
      await expect(builder.create()).rejects.toThrow(
        "Name and query are required"
      );
    });
  });

  describe("error handling", () => {
    it("should handle duplicate saved search", async () => {
      // Create first saved search
      await new LogViewerSavedSearchBuilder()
        .withName(TEST_SEARCH_NAME)
        .withQuery("level:Error")
        .create();

      // Try to create duplicate
      const builder = new LogViewerSavedSearchBuilder()
        .withName(TEST_SEARCH_NAME)
        .withQuery("level:Error");

      await expect(builder.create()).rejects.toThrow();
    });

    it("should throw error when getting created item before creation", () => {
      const builder = new LogViewerSavedSearchBuilder()
        .withName(TEST_SEARCH_NAME)
        .withQuery("level:Error");

      expect(() => builder.getCreatedItem()).toThrow(
        "No saved search has been created yet"
      );
    });
  });

  describe("cleanup", () => {
    it("should delete a created saved search", async () => {
      const builder = await new LogViewerSavedSearchBuilder()
        .withName(TEST_SEARCH_NAME)
        .withQuery("level:Error")
        .create();

      await builder.delete();

      // Verify it's deleted
      const item = await LogViewerTestHelper.findSavedSearch(TEST_SEARCH_NAME);
      expect(item).toBeUndefined();
    });
  });
});
