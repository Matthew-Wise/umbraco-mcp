import SortMediaTool from "../put/sort-media.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

const TEST_MEDIA_NAME = "_Test Media Sort";
const TEST_MEDIA_NAME_2 = "_Test Media Sort 2";

describe("sort-media", () => {
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
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME_2);
  });

  it("should sort media items", async () => {
    const folderBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withFolderMediaType()
      .create();

    const media1Builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .withParent(folderBuilder.getId())
      .create();

    const media2Builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME_2)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .withParent(folderBuilder.getId())
      .create();

    const result = await SortMediaTool().handler({
      parent: {
        id: folderBuilder.getId()
      },
      sorting: [
        { id: media2Builder.getId(), sortOrder: 0 },
        { id: media1Builder.getId(), sortOrder: 1 }
      ]
    }, { signal: new AbortController().signal });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result).toMatchSnapshot();
  });

  it("should handle non-existent parent", async () => {
    const result = await SortMediaTool().handler({
      parent: {
        id: BLANK_UUID
      },
      sorting: []
    }, { signal: new AbortController().signal });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
    expect(result).toMatchSnapshot();
  });
}); 