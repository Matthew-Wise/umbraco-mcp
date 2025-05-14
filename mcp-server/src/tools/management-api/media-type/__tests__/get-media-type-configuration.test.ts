import GetMediaTypeConfigurationTool from "../get/get-media-type-configuration.js";
import { jest } from "@jest/globals";

describe("get-media-type-configuration", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get the global media type configuration", async () => {
    const result = await GetMediaTypeConfigurationTool().handler({}, { signal: new AbortController().signal });
    const config = JSON.parse(result.content[0].text as string);
    expect(config).toMatchSnapshot();
  });
}); 