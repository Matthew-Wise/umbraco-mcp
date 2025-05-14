import RestoreFromRecycleBinTool from "../put/restore-from-recycle-bin.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

describe("restore-media-from-recycle-bin", () => {
  const TEST_MEDIA_NAME = "_Test Media Restore";
  let originalConsoleError: typeof console.error;
  let tempFileBuilder: TemporaryFileBuilder;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();

    await MediaTestHelper.emptyRecycleBin();

    tempFileBuilder = await new TemporaryFileBuilder()
      .withExampleFile()
      .create();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test media
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME);
  });

  it("should restore a media item from recycle bin", async () => {
    // Create a media item and move it to recycle bin
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    await builder.moveToRecycleBin();

    // Restore from recycle bin
    const result = await RestoreFromRecycleBinTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the media is back in the normal tree
    const found = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(found).toBeDefined();
    expect(found!.variants[0].name).toBe(TEST_MEDIA_NAME);
  });

  it("should handle non-existent media", async () => {
    const result = await RestoreFromRecycleBinTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 