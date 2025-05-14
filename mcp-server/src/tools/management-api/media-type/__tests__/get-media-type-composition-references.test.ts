import GetMediaTypeCompositionReferencesTool from "../get/get-media-type-composition-references.js";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";
import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import { jest } from "@jest/globals";
import { createSnapshotResult } from "@/helpers/test-utils.js";

const TEST_MEDIA_TYPE_NAME = "_Test MediaType Composition";
const TEST_COMPOSITION_NAME = "_Test Composition MediaType";

describe("get-media-type-composition-references", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test media types
    await MediaTypeTestHelper.cleanup(TEST_MEDIA_TYPE_NAME);
    await MediaTypeTestHelper.cleanup(TEST_COMPOSITION_NAME);
  });

  it("should get composition references for a media type", async () => {
    // Create a media type to be used as a composition
    const compositionBuilder = await new MediaTypeBuilder()
      .withName(TEST_COMPOSITION_NAME)
      .create();

    // Create a parent media type that uses the composition
    const parentBuilder = await new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME)
      .withComposition(compositionBuilder.getId())
      .create();

    // Get the composition references
    const result = await GetMediaTypeCompositionReferencesTool().handler({
      id: compositionBuilder.getId()
    }, { signal: new AbortController().signal });

    // Parse the response to get the ID to normalize
    const parsed = JSON.parse(result.content[0].text as string);
    const idToNormalize = parsed[0]?.id;

    // Normalize IDs and dates for snapshot testing
    const normalizedResult = createSnapshotResult(result, idToNormalize);

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });

  it("should handle media type with no composition references", async () => {
    // Create a media type that isn't used as a composition
    const mediaTypeBuilder = await new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME)
      .create();

    // Get the composition references
    const result = await GetMediaTypeCompositionReferencesTool().handler({
      id: mediaTypeBuilder.getId()
    }, { signal: new AbortController().signal });

    // Parse the response to get the ID to normalize
    const parsed = JSON.parse(result.content[0].text as string);
    const idToNormalize = parsed[0]?.id;

    // Normalize IDs and dates for snapshot testing
    const normalizedResult = createSnapshotResult(result, idToNormalize);

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });
}); 