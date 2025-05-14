import GetLogViewerValidateLogsSizeTool from "../get/get-log-viewer-validate-logs-size.js";
import { jest } from "@jest/globals";

describe("get-log-viewer-validate-logs-size", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should validate logs size with default parameters", async () => {
    const result = await GetLogViewerValidateLogsSizeTool().handler(
      {},
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = result.content[0].text as string;
    expect(response).toEqual("allowed access");
  });

  it("should validate logs size with custom date range", async () => {
    // Use current date range instead of hardcoded dates
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const result = await GetLogViewerValidateLogsSizeTool().handler(
      {
        startDate: oneMonthAgo.toISOString(),
        endDate: now.toISOString(),
      },
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = result.content[0].text as string;
    expect(response).toEqual("allowed access");
  });
});
