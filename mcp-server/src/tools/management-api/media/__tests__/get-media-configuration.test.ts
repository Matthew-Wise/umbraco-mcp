import GetMediaConfigurationTool from "../get/get-media-configuration.js";
import { jest } from "@jest/globals";

describe("get-media-configuration", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get media configuration", async () => {
    const result = await GetMediaConfigurationTool().handler({}, { signal: new AbortController().signal });
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result).toMatchSnapshot();
  });
}); 