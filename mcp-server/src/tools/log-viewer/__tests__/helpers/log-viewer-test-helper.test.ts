import { LogViewerTestHelper } from "./log-viewer-test-helper.js";
import { jest } from "@jest/globals";

const TEST_SAVED_SEARCH_NAME = "_Test Helper Saved Search";
const TEST_SAVED_SEARCH_QUERY = "Test Query";

describe("LogViewerTestHelper", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    await LogViewerTestHelper.cleanup(TEST_SAVED_SEARCH_NAME);
    console.error = originalConsoleError;
  });

  describe("findSavedSearch", () => {
    it("should return undefined for non-existent saved search", async () => {
      const search = await LogViewerTestHelper.findSavedSearch(
        "not-a-real-search"
      );
      expect(search).toBeUndefined();
    });

    it("should return saved search data for an existing search", async () => {
      // Create a test saved search first
      const client = await import("@/clients/umbraco-management-client.js");
      await client.UmbracoManagementClient.getClient().postLogViewerSavedSearch(
        {
          name: TEST_SAVED_SEARCH_NAME,
          query: TEST_SAVED_SEARCH_QUERY,
        }
      );

      const search = await LogViewerTestHelper.findSavedSearch(
        TEST_SAVED_SEARCH_NAME
      );
      expect(search).toBeDefined();
      expect(search.name).toBe(TEST_SAVED_SEARCH_NAME);
      expect(search.query).toBe(TEST_SAVED_SEARCH_QUERY);
    });
  });

  describe("cleanup", () => {
    it("should remove a saved search if it exists", async () => {
      // Create a test saved search first
      const client = await import("@/clients/umbraco-management-client.js");
      await client.UmbracoManagementClient.getClient().postLogViewerSavedSearch(
        {
          name: TEST_SAVED_SEARCH_NAME,
          query: TEST_SAVED_SEARCH_QUERY,
        }
      );

      // Should exist before cleanup
      const beforeCleanup = await LogViewerTestHelper.findSavedSearch(
        TEST_SAVED_SEARCH_NAME
      );
      expect(beforeCleanup).toBeDefined();

      await LogViewerTestHelper.cleanup(TEST_SAVED_SEARCH_NAME);

      // Should not exist after cleanup
      const afterCleanup = await LogViewerTestHelper.findSavedSearch(
        TEST_SAVED_SEARCH_NAME
      );
      expect(afterCleanup).toBeUndefined();
    });

    it("should not throw if saved search does not exist", async () => {
      await expect(
        LogViewerTestHelper.cleanup("not-a-real-search")
      ).resolves.not.toThrow();
    });
  });

  describe("verifyLogResponse", () => {
    it("should verify a valid log response", () => {
      const mockLogResponse = {
        total: 1,
        items: [
          {
            timestamp: "2024-01-01T00:00:00Z",
            level: "Information" as const,
            messageTemplate: "Test message",
            renderedMessage: "Test message",
            properties: [{ name: "test", value: "value" }],
            exception: null,
          },
        ],
      };

      expect(() =>
        LogViewerTestHelper.verifyLogResponse(mockLogResponse)
      ).not.toThrow();
    });

    it("should throw for invalid log response", () => {
      const invalidLogResponse = {
        total: 0,
        items: [],
      };

      expect(() =>
        LogViewerTestHelper.verifyLogResponse(invalidLogResponse)
      ).toThrow();
    });
  });

  describe("verifyMessageTemplateResponse", () => {
    it("should verify a valid message template response", () => {
      const mockMessageTemplateResponse = {
        total: 1,
        items: [
          {
            messageTemplate: "Test template",
            count: 1,
          },
        ],
      };

      expect(() =>
        LogViewerTestHelper.verifyMessageTemplateResponse(
          mockMessageTemplateResponse
        )
      ).not.toThrow();
    });
  });

  describe("verifySavedSearchResponse", () => {
    it("should verify a valid saved search response", () => {
      const mockSavedSearchResponse = {
        total: 1,
        items: [
          {
            name: TEST_SAVED_SEARCH_NAME,
            query: TEST_SAVED_SEARCH_QUERY,
          },
        ],
      };

      expect(() =>
        LogViewerTestHelper.verifySavedSearchResponse(mockSavedSearchResponse)
      ).not.toThrow();
    });
  });
});
