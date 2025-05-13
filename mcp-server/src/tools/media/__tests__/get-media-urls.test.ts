import GetMediaUrlsTool from "../get/get-media-urls.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";

const TEST_MEDIA_NAME = "_Test Media URLs";

describe("get-media-urls", () => {
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

  it("should get media URLs", async () => {
    const mediaBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    const result = await GetMediaUrlsTool().handler({
      id: [mediaBuilder.getId()]
    }, { signal: new AbortController().signal });
    
    const normalizedItems = createSnapshotResult(result);
    expect(normalizedItems).toMatchSnapshot();
  });

  it("should handle non-existent media", async () => {
    const result = await GetMediaUrlsTool().handler({
      id: [BLANK_UUID]
    }, { signal: new AbortController().signal });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result).toMatchSnapshot();
  });
}); 