import { MediaTestHelper } from "./helpers/media-test-helper.js";
import GetMediaByIdArrayTool from "../get/get-media-by-id-array.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaBuilder } from "./helpers/media-builder.js";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

describe("get-media-by-id-array", () => {
  const TEST_MEDIA_NAME = "_Test Media";
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

  it("should get media items by id array", async () => {
    // Create test media
    const mediaBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    const result = await GetMediaByIdArrayTool().handler({
      id: [mediaBuilder.getId()]
    }, { signal: new AbortController().signal });

    const normalizedItems = createSnapshotResult(result);
    expect(normalizedItems).toMatchSnapshot();
  });

  it("should handle non-existent media", async () => {
    const result = await GetMediaByIdArrayTool().handler({
      id: [BLANK_UUID]
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });

  it("should handle empty id array", async () => {
    const result = await GetMediaByIdArrayTool().handler({
      id: []
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 