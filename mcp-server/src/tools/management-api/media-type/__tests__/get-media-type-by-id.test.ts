import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import GetMediaTypeByIdTool from "../get/get-media-type-by-id.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("get-media-type-by-id", () => {
  const TEST_MEDIA_TYPE_NAME = "_Test Media Type";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MediaTypeTestHelper.cleanup(TEST_MEDIA_TYPE_NAME);
  });

  it("should get a media type by id", async () => {
    // Create a media type first
    const builder = await new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME)
      .withDescription("Test media type description")
      .withAllowedAsRoot(true)
      .create();

    const result = await GetMediaTypeByIdTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    // Replace the dynamic ID with a placeholder
    const normalizedResponse = JSON.parse(normalizedItems.content[0].text);
    normalizedResponse.id = "PLACEHOLDER_ID";
    normalizedItems.content[0].text = JSON.stringify(normalizedResponse);
    expect(normalizedItems).toMatchSnapshot();
  });

  it("should handle non-existent media type", async () => {
    const result = await GetMediaTypeByIdTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 