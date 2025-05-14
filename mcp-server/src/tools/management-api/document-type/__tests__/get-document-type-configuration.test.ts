import GetDocumentTypeConfigurationTool from "../get/get-document-type-configuration.js";
import { jest } from "@jest/globals";

describe("get-document-type-configuration", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get the global document type configuration", async () => {
    const result = await GetDocumentTypeConfigurationTool().handler({}, { signal: new AbortController().signal });
    const config = JSON.parse(result.content[0].text as string);
    expect(config).toMatchSnapshot();
  });
}); 