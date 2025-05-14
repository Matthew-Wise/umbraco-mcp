import GetDocumentConfigurationTool from "../get/get-document-configuration.js";
import { jest } from "@jest/globals";

describe("get-document-configuration", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get the document configuration", async () => {
    const result = await GetDocumentConfigurationTool().handler({}, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
    const parsed = JSON.parse(result.content[0].text as string);
    expect(parsed).toHaveProperty("disableDeleteWhenReferenced");
    expect(parsed).toHaveProperty("disableUnpublishWhenReferenced");
    expect(parsed).toHaveProperty("allowEditInvariantFromNonDefault");
    expect(parsed).toHaveProperty("allowNonExistingSegmentsCreation");
    expect(parsed).toHaveProperty("reservedFieldNames");
    expect(Array.isArray(parsed.reservedFieldNames)).toBe(true);
  });
}); 