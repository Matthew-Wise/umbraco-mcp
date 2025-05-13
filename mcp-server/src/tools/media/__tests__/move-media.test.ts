import MoveMediaTool from "../put/move-media.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

const TEST_MEDIA_SOURCE_NAME = "_Test Media Move";
const TEST_MEDIA_TARGET_NAME = "_Test Media Move Target";
const TEST_MEDIA_CONTENT_NAME = "_Test Media Content";

describe("move-media", () => {
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
    await MediaTestHelper.cleanup(TEST_MEDIA_SOURCE_NAME);
    await MediaTestHelper.cleanup(TEST_MEDIA_TARGET_NAME);
    await MediaTestHelper.cleanup(TEST_MEDIA_CONTENT_NAME);
  });

  it("should move a media item to another folder", async () => {
    // Create two folder media items
    const folderSourceBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_SOURCE_NAME)
      .withFolderMediaType()
      .create();

    const folderTargetBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_TARGET_NAME)
      .withFolderMediaType()
      .create();

    // Create a media item in the source folder
    const contentBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_CONTENT_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .withParent(folderSourceBuilder.getId())
      .create();

    // Move the media item to be a child of the target folder
    const result = await MoveMediaTool().handler({
      id: contentBuilder.getId(),
      data: {
        target: {
          id: folderTargetBuilder.getId()
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the media item was moved
    const found = await MediaTestHelper.findMedia(TEST_MEDIA_CONTENT_NAME);
    expect(found).toBeDefined();
    expect(found!.parent?.id).toBe(folderTargetBuilder.getId());
  });

  it("should handle moving to non-existent target", async () => {
    // Create a folder and media item
    const folderSourceBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_SOURCE_NAME)
      .withFolderMediaType()
      .create();

    const contentBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_CONTENT_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .withParent(folderSourceBuilder.getId())
      .create();

    const result = await MoveMediaTool().handler({
      id: contentBuilder.getId(),
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle moving non-existent media", async () => {
    const result = await MoveMediaTool().handler({
      id: BLANK_UUID,
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 