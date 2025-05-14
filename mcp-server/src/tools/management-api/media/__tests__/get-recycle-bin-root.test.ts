import GetRecycleBinMediaRootTool from "../items/get/get-recycle-bin-root.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

describe("get-recycle-bin-media-root", () => {
  const TEST_MEDIA_NAME = "_Test Media Root";
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

  it("should get root items from recycle bin", async () => {
    // Create a media item and move it to recycle bin
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    await builder.moveToRecycleBin();

    // Get root items
    const result = await GetRecycleBinMediaRootTool().handler({
      take: 10
    }, { signal: new AbortController().signal });

    // Parse and normalize the response for snapshot
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

    // Verify the normalized response using snapshot
    expect(normalizedResponse).toMatchSnapshot();

  });
}); 