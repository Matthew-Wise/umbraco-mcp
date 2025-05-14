import DeleteMediaTool from "../delete/delete-media.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

const TEST_MEDIA_NAME = "_Test Media Delete";

describe("delete-media", () => {
  let originalConsoleError: typeof console.error;
  let tempFileBuilder: TemporaryFileBuilder;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();

    tempFileBuilder = await new TemporaryFileBuilder()
      .withExampleFile()
      .create();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any remaining test media
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME);
  });

  it("should delete a media item", async () => {
    // Create a media item to delete
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    // Delete the media
    const result = await DeleteMediaTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the media no longer exists
    const found = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(found).toBeUndefined();
  });

  it("should handle non-existent media", async () => {
    const result = await DeleteMediaTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 