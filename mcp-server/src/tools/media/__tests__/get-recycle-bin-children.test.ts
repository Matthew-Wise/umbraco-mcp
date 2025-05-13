import GetRecycleBinMediaChildrenTool from "../items/get/get-recycle-bin-children.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

describe("get-recycle-bin-media-children", () => {
  const TEST_MEDIA_NAME = "_Test Media Children";
  const TEST_CHILD_NAME = "_Test Media Child";
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
    await MediaTestHelper.emptyRecycleBin();
  });

  it("should get children of a media item in recycle bin", async () => {
    // Create a parent media item
    const parentBuilder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withFolderMediaType()
      .create();

    // Create a child media item
    const childBuilder = await new MediaBuilder()
      .withName(TEST_CHILD_NAME)
      .withImageMediaType()
      .withParent(parentBuilder.getId())
      .withImageValue(tempFileBuilder.getId())
      .create();

    // Move parent to recycle bin (children will be moved automatically)
    await parentBuilder.moveToRecycleBin();

    // Get children
    const result = await GetRecycleBinMediaChildrenTool().handler({
      parentId: parentBuilder.getId(),
      take: 10
    }, { signal: new AbortController().signal });

    const response = JSON.parse(result.content[0].text as string);
    const normalizedResponse = {
        ...response,
        items: response.items.map((item: any) => ({
        ...item,
        id: "normalized-id",
        createDate: "normalized-date",
        parent: item.parent ? { id: "normalized-parent-id" } : null
        }))
    };

    // Verify the handler response using snapshot
    expect(normalizedResponse).toMatchSnapshot();

    expect(response.items).toHaveLength(1);
    expect(response.items[0].variants[0].name).toBe(TEST_CHILD_NAME);
  });

  it("should handle non-existent media", async () => {
    const result = await GetRecycleBinMediaChildrenTool().handler({
      parentId: BLANK_UUID,
      take: 10
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 