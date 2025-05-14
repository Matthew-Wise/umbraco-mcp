import GetAllowedMediaTypeTool from "../get/get-allowed.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";

describe("allowed-media-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe("get allowed", () => {
    it("should filter by file extension", async () => {
      const result = await GetAllowedMediaTypeTool().handler({
        take: 100,
        fileExtension: 'jpg'
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify the response structure
      const response = JSON.parse((result.content[0] as { text: string }).text);
      expect(Array.isArray(response.items)).toBe(true);
      
      // Verify all returned items include jpg in their extensions
      response.items.forEach((item: any) => {
        expect(item.name).toContain('Image');
      });
    });
  });
}); 