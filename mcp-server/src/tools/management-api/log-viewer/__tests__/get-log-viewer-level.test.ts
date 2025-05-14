import GetLogViewerLevelTool from "../get/get-log-viewer-level.js";
import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { jest } from "@jest/globals";

describe("get-log-viewer-level", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get log viewer levels with default parameters", async () => {
    const result = await GetLogViewerLevelTool().handler(
      { take: 100 },
      { signal: new AbortController().signal }
    );

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should get log viewer levels with custom pagination", async () => {
    const result = await GetLogViewerLevelTool().handler(
      {
        skip: 1,
        take: 2,
      },
      { signal: new AbortController().signal }
    );

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();
  });
});
