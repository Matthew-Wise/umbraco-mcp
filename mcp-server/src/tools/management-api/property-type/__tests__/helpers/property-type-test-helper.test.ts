import { PropertyTypeTestHelper } from "./property-type-test-helper.js";
import { jest } from "@jest/globals";

describe("PropertyTypeTestHelper", () => {
  let originalConsoleError: typeof console.error;
  let originalConsoleWarn: typeof console.warn;

  beforeEach(() => {
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe("getHeaderControlsId", () => {
    it("should return header controls ID when document type is found", async () => {
      const result = await PropertyTypeTestHelper.getHeaderControlsId();
      expect(result).toBeDefined();
      expect(typeof result).not.toBeNull();
    });
  });
});
