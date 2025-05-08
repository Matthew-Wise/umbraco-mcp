import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import GetMediaTypeByIdsTool from "../get/get-media-type-by-ids.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("get-media-type-by-ids", () => {
  const TEST_MEDIA_TYPE_NAME_1 = "_Test Media Type 1";
  const TEST_MEDIA_TYPE_NAME_2 = "_Test Media Type 2";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MediaTypeTestHelper.cleanup(TEST_MEDIA_TYPE_NAME_1);
    await MediaTypeTestHelper.cleanup(TEST_MEDIA_TYPE_NAME_2);
  });

  it("should get media types by ids", async () => {
    // Create two media types
    const builder1 = await new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME_1)
      .withDescription("Test media type 1 description")
      .withAllowedAsRoot(true)
      .create();

    const builder2 = await new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME_2)
      .withDescription("Test media type 2 description")
      .withAllowedAsRoot(true)
      .create();

    const result = await GetMediaTypeByIdsTool().handler({
      ids: [builder1.getId(), builder2.getId()]
    }, { signal: new AbortController().signal });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    // Replace the dynamic IDs with placeholders
    const normalizedResponse = JSON.parse(normalizedItems.content[0].text);
    normalizedResponse.forEach((item: any) => {
      item.id = "PLACEHOLDER_ID";
    });
    normalizedItems.content[0].text = JSON.stringify(normalizedResponse);
    expect(normalizedItems).toMatchSnapshot();
  });

  it("should handle non-existent media types", async () => {
    const result = await GetMediaTypeByIdsTool().handler({
      ids: [BLANK_UUID]
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 