import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import CreateMediaTypeTool from "../post/create-media-type.js";
import {
  createSnapshotResult,
  normalizeErrorResponse,
} from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";

describe("create-media-type", () => {
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

  it("should create a media type", async () => {
    const builder = new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME)
      .withDescription("Test media type description")
      .withAllowedAsRoot(true);

    const result = await CreateMediaTypeTool().handler(builder.build(), {
      signal: new AbortController().signal,
    });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    expect(normalizedItems).toMatchSnapshot();

    // Verify the media type was created
    const items = await MediaTypeTestHelper.findMediaTypes(
      TEST_MEDIA_TYPE_NAME
    );
    expect(items.length).toBe(1);
    expect(items[0].name).toBe(TEST_MEDIA_TYPE_NAME);
  });

  it("should handle invalid media type data", async () => {
    const invalidModel = {
      name: TEST_MEDIA_TYPE_NAME,
      // Missing required fields
    };

    const result = await CreateMediaTypeTool().handler(invalidModel as any, {
      signal: new AbortController().signal,
    });

    expect(normalizeErrorResponse(result)).toMatchSnapshot();
  });
}); 