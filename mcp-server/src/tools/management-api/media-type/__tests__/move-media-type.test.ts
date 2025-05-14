import MoveMediaTypeTool from "../put/move-media-type.js";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";
import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import { MediaTypeFolderBuilder } from "./helpers/media-type-folder-builder.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_MEDIATYPE_NAME = "_Test MediaType Move";
const TEST_FOLDER_NAME = "_Test Folder For Move";
const TEST_TARGET_FOLDER_NAME = "_Test Target Folder For Move";

describe("move-media-type", () => {
  let originalConsoleError: typeof console.error;
  let mediaTypeBuilder: MediaTypeBuilder;
  let sourceFolderBuilder: MediaTypeFolderBuilder;
  let targetFolderBuilder: MediaTypeFolderBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test media types and folders
    if (mediaTypeBuilder) {
      await mediaTypeBuilder.cleanup();
    }
    if (sourceFolderBuilder) {
      await sourceFolderBuilder.cleanup();
    }
    if (targetFolderBuilder) {
      await targetFolderBuilder.cleanup();
    }
  });

  it("should move a media type to a folder", async () => {
    // Create a source folder
    sourceFolderBuilder = await new MediaTypeFolderBuilder()
      .withName(TEST_FOLDER_NAME)
      .create();

    // Create a media type in the source folder
    mediaTypeBuilder = await new MediaTypeBuilder()
      .withName(TEST_MEDIATYPE_NAME)
      .withParent(sourceFolderBuilder.getId())
      .create();

    // Create a target folder
    targetFolderBuilder = await new MediaTypeFolderBuilder()
      .withName(TEST_TARGET_FOLDER_NAME)
      .create();

    // Move the media type
    const result = await MoveMediaTypeTool().handler({
      id: mediaTypeBuilder.getId(),
      data: {
        target: {
          id: targetFolderBuilder.getId()
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the media type was actually moved to the target folder
    const movedMediaTypes = await MediaTypeTestHelper.findMediaTypes(TEST_MEDIATYPE_NAME);
    expect(movedMediaTypes.length).toBeGreaterThan(0);
    const movedMediaType = movedMediaTypes[0];
    expect(movedMediaType.parent?.id).toBe(targetFolderBuilder.getId());
  });

  it("should move a media type to root", async () => {
    // Create a source folder
    sourceFolderBuilder = await new MediaTypeFolderBuilder()
      .withName(TEST_FOLDER_NAME)
      .create();

    // Create a media type in the source folder
    mediaTypeBuilder = await new MediaTypeBuilder()
      .withName(TEST_MEDIATYPE_NAME)
      .withIcon("icon-folder")
      .withParent(sourceFolderBuilder.getId())
      .create();

    // Move the media type to root (no target)
    const result = await MoveMediaTypeTool().handler({
      id: mediaTypeBuilder.getId(),
      data: {
        target: null
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the media type was actually moved to root
    const movedMediaTypes = await MediaTypeTestHelper.findMediaTypes(TEST_MEDIATYPE_NAME);
    expect(movedMediaTypes.length).toBeGreaterThan(0);
    const movedMediaType = movedMediaTypes[0];
    expect(movedMediaType.parent).toBeNull();
  });

  it("should handle non-existent media type", async () => {
    const result = await MoveMediaTypeTool().handler({
      id: BLANK_UUID,
      data: {
        target: null
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 