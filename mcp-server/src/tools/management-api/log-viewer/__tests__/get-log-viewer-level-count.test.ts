import GetLogViewerLevelCountTool from "../get/get-log-viewer-level-count.js";
import { jest } from "@jest/globals";

describe("get-log-viewer-level-count", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get log viewer level counts with default parameters", async () => {
    const result = await GetLogViewerLevelCountTool().handler(
      {},
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = JSON.parse(result.content[0].text as string);

    // Verify the response structure
    expect(response).toEqual(
      expect.objectContaining({
        information: expect.any(Number),
        debug: expect.any(Number),
        warning: expect.any(Number),
        error: expect.any(Number),
        fatal: expect.any(Number),
      })
    );
  });

  it("should get log viewer level counts with date range", async () => {
    const result = await GetLogViewerLevelCountTool().handler(
      {
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-12-31T23:59:59Z",
      },
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = JSON.parse(result.content[0].text as string);

    // Verify the response structure
    expect(response).toEqual(
      expect.objectContaining({
        information: expect.any(Number),
        debug: expect.any(Number),
        warning: expect.any(Number),
        error: expect.any(Number),
        fatal: expect.any(Number),
      })
    );
  });
});
