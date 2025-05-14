import { getLanguageByIsoCodeParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import GetLanguageByIsoCodeTool from "../get/get-language-by-iso-code.js";
import { LanguageBuilder } from "./helpers/language-builder.js";
import { jest } from "@jest/globals";

const TEST_LANGUAGE_NAME = "_Test Language";
const TEST_LANGUAGE_ISO = "en-Gb";

// Optionally, you can create a snapshot utility similar to createSnapshotResult if needed
function createSnapshotResult(result: any) {
  // If result.content[0].text is JSON, parse it for stable snapshotting
  try {
    const parsed = JSON.parse(result.content[0].text);
    return parsed;
  } catch {
    return result;
  }
}

describe("get-language-by-iso-code", () => {
  let originalConsoleError: typeof console.error;
  let builder: LanguageBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new LanguageBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await builder.cleanup();
  });

  it("should get a language by isoCode", async () => {
    await builder
      .withName(TEST_LANGUAGE_NAME)
      .withIsoCode(TEST_LANGUAGE_ISO)
      .withIsDefault(false)
      .withIsMandatory(false)
      .create();
    const params = getLanguageByIsoCodeParams.parse({ isoCode: builder.getIsoCode() });
    const result = await GetLanguageByIsoCodeTool().handler(params, { signal: new AbortController().signal });
    expect(createSnapshotResult(result)).toMatchSnapshot();
  });

  it("should handle non-existent language", async () => {
    const params = getLanguageByIsoCodeParams.parse({ isoCode: "does-not-exist" });
    const result = await GetLanguageByIsoCodeTool().handler(params, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 