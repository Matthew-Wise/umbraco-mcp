import CreateMediaTool from "../post/create-media.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

const TEST_MEDIA_NAME = "_Test Media Created";

describe("create-media", () => {
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
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME);
  });

  it("should create a media item", async () => {
    // Create media model using builder
    const mediaModel = new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .build();

    // Create the media
    const result = await CreateMediaTool().handler(mediaModel, {
      signal: new AbortController().signal
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const item = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(item).toBeDefined();
    const norm = { ...MediaTestHelper.normaliseIds(item!), createDate: "<normalized>" };
    expect(norm).toMatchSnapshot();
  });

  it("should create a media item with parent", async () => {
    // Create parent folder
    const parentBuilder = await new MediaBuilder()
      .withName("_Test Parent Folder")
      .withFolderMediaType()
      .create();

    // Create media model with parent
    const mediaModel = new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withParent(parentBuilder.getId())
      .withImageValue(tempFileBuilder.getId())
      .build();

    const result = await CreateMediaTool().handler(mediaModel, {
      signal: new AbortController().signal
    });

    expect(result).toMatchSnapshot();

    const item = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(item).toBeDefined();
    expect(item!.parent?.id).toBe(parentBuilder.getId());

    // Cleanup parent
    await MediaTestHelper.cleanup("_Test Parent Folder");
  });

  it("should handle invalid temporary file id", async () => {
    const mediaModel = new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue("invalid-temp-file-id")
      .build();

    const result = await CreateMediaTool().handler(mediaModel, {
      signal: new AbortController().signal
    });

    expect(result).toMatchSnapshot();
  });
}); 