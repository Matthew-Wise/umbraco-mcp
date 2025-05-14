import GetLogViewerLogTool from "../get/get-log-viewer-log.js";
import { LogViewerTestHelper } from "./helpers/log-viewer-test-helper.js";
import { jest } from "@jest/globals";

describe("get-log-viewer-log", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get log viewer logs with default parameters", async () => {
    const result = await GetLogViewerLogTool().handler(
      { take: 100 },
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = JSON.parse(result.content[0].text as string);
    LogViewerTestHelper.verifyLogResponse(response);
  });

  it("should get log viewer logs with custom parameters", async () => {
    // Use current date range instead of hardcoded 2024
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const result = await GetLogViewerLogTool().handler(
      {
        skip: 0, // Start from the beginning
        take: 10, // Get more items to increase chances of finding matches
        orderDirection: "Descending",
        filterExpression: "", // Remove filter to get any logs
        logLevel: ["Error", "Warning", "Information"], // Include more log levels
        startDate: oneMonthAgo.toISOString(),
        endDate: now.toISOString(),
      },
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = JSON.parse(result.content[0].text as string);
    LogViewerTestHelper.verifyLogResponse(response);

    // Verify the items are within the date range
    const itemDate = new Date(response.items[0].timestamp).getTime();
    expect(itemDate).toBeGreaterThanOrEqual(oneMonthAgo.getTime());
    expect(itemDate).toBeLessThanOrEqual(now.getTime());
  });
});
