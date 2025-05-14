import UpdateMediaTool from "../put/update-media.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

describe("update-media", () => {
  const TEST_MEDIA_NAME = "_Test Media Update";
  const UPDATED_MEDIA_NAME = "_Test Media Updated";
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
    // Clean up any test media
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME);
    await MediaTestHelper.cleanup(UPDATED_MEDIA_NAME);
  });

  it("should update a media item", async () => {
    // Create a media item to update
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    // Create update model using builder
    const updateModel = new MediaBuilder()
      .withName(UPDATED_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .build();

    // Update the media
    const result = await UpdateMediaTool().handler({
      id: builder.getId(),
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the media was updated
    const found = await MediaTestHelper.findMedia(UPDATED_MEDIA_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
    expect(MediaTestHelper.getNameFromItem(found!)).toBe(UPDATED_MEDIA_NAME);
  });

  it("should handle non-existent media", async () => {
    const updateModel = new MediaBuilder()
      .withName(UPDATED_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .build();

    const result = await UpdateMediaTool().handler({
      id: BLANK_UUID,
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should update media with new content", async () => {
    // Create a media item to update
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    // Create a new temporary file for the update
    const newTempFile = await new TemporaryFileBuilder()
      .withExampleFile()
      .create();

    // Create update model with new content
    const updateModel = new MediaBuilder()
      .withName(UPDATED_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(newTempFile.getId())
      .build();

    // Update the media
    const result = await UpdateMediaTool().handler({
      id: builder.getId(),
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the media was updated with new content
    const found = await MediaTestHelper.findMedia(UPDATED_MEDIA_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
    expect(MediaTestHelper.getNameFromItem(found!)).toBe(UPDATED_MEDIA_NAME);

    // Cleanup new temporary file
    await newTempFile.cleanup();
  });

  
}); 