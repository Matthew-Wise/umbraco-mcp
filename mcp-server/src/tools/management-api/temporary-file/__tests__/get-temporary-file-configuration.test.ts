import GetTemporaryFileConfigurationTool from "../get/get-temporary-file-configuration.js";
import { jest } from "@jest/globals";

describe("get-temporary-file-configuration", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get the global temporary file configuration", async () => {
    const result = await GetTemporaryFileConfigurationTool().handler({}, { signal: new AbortController().signal });
    const config = JSON.parse(result.content[0].text as string);
    expect(config).toMatchSnapshot();
  });
}); 