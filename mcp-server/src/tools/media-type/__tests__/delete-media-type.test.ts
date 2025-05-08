import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import DeleteMediaTypeTool from "../delete/delete-media-type.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("delete-media-type", () => {
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

  it("should delete a media type", async () => {
    // Create a media type first
    const builder = await new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME)
      .withDescription("Test media type description")
      .withAllowedAsRoot(true)
      .create();

    const result = await DeleteMediaTypeTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    expect(normalizedItems).toMatchSnapshot();

    // Verify the media type was deleted
    const items = await MediaTypeTestHelper.findMediaTypes(TEST_MEDIA_TYPE_NAME);
    expect(items.length).toBe(0);
  });

  it("should handle non-existent media type", async () => {
    const result = await DeleteMediaTypeTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 