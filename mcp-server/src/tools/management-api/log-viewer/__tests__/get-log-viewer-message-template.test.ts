import GetLogViewerMessageTemplateTool from "../get/get-log-viewer-message-template.js";
import { LogViewerTestHelper } from "./helpers/log-viewer-test-helper.js";
import { jest } from "@jest/globals";

describe("get-log-viewer-message-template", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get log viewer message templates with default parameters", async () => {
    const result = await GetLogViewerMessageTemplateTool().handler(
      { take: 100 },
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = JSON.parse(result.content[0].text as string);
    LogViewerTestHelper.verifyMessageTemplateResponse(response);
  });

  it("should get log viewer message templates with custom parameters", async () => {
    // Use current date range instead of hardcoded dates
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const result = await GetLogViewerMessageTemplateTool().handler(
      {
        skip: 0,
        take: 10,
        startDate: oneMonthAgo.toISOString(),
        endDate: now.toISOString(),
      },
      { signal: new AbortController().signal }
    );

    // Parse the response
    const response = JSON.parse(result.content[0].text as string);
    LogViewerTestHelper.verifyMessageTemplateResponse(response);
  });
});
