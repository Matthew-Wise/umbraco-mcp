import GetMediaByIdTool from "../get/get-media-by-id.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

const TEST_MEDIA_NAME = "_Test GetMediaById";

describe("get-media-by-id", () => {
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

  it("should get a media item by ID", async () => {
    // Create a media item
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    const id = builder.getId();

    // Get by ID
    const result = await GetMediaByIdTool().handler({ id }, { signal: new AbortController().signal });
    const media = JSON.parse(result.content[0].text as string);
    expect(media.id).toBe(id);
    expect(media.variants[0].name).toBe(TEST_MEDIA_NAME);
  });

  it("should return error for non-existent ID", async () => {
    const result = await GetMediaByIdTool().handler({ id: BLANK_UUID }, { signal: new AbortController().signal });
    expect(result.content[0].text).toMatch(/error/i);
  });

}); 