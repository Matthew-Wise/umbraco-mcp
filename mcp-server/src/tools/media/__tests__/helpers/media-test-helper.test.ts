import { MediaTestHelper } from "./media-test-helper.js";
import { MediaBuilder } from "./media-builder.js";
import { jest } from "@jest/globals";
import type { MediaTreeItemResponseModel } from "@/umb-management-api/schemas/mediaTreeItemResponseModel.js";
import { BLANK_UUID } from "../../../constants.js";
import { TemporaryFileBuilder } from "../../../temporary-file/__tests__/helpers/temporary-file-builder.js";

const TEST_MEDIA_NAME = "_Test MediaHelper";
const TEST_RECYCLE_BIN_MEDIA_NAME = "_Test MediaHelper RecycleBin";
const TEST_RESTORE_MEDIA_NAME = "_Test MediaHelper Restore";

describe("MediaTestHelper", () => {
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
    await MediaTestHelper.cleanup(TEST_RECYCLE_BIN_MEDIA_NAME);
    await MediaTestHelper.cleanup(TEST_RESTORE_MEDIA_NAME);
  });

  it("normaliseIds should blank out id for single and array", async () => {
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    const item = builder.getCreatedItem();
    const normSingle = MediaTestHelper.normaliseIds(item) as MediaTreeItemResponseModel;
    expect(normSingle.id).toBe(BLANK_UUID);
    const normArray = MediaTestHelper.normaliseIds([item]) as MediaTreeItemResponseModel[];
    expect(normArray[0].id).toBe(BLANK_UUID);
  });

  it("getNameFromItem should return the name from the first variant", async () => {
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    const item = builder.getCreatedItem();
    expect(MediaTestHelper.getNameFromItem(item)).toBe(TEST_MEDIA_NAME);
  });

  it("findMedia should find a media by variant name", async () => {
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    const found = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(found).toBeDefined();
    expect(MediaTestHelper.getNameFromItem(found!)).toBe(TEST_MEDIA_NAME);
  });

  it("cleanup should remove a media", async () => {
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    // Ensure it exists
    let found = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(found).toBeDefined();
    // Cleanup
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME);
    // Should not be found after cleanup
    found = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(found).toBeUndefined();
  });

  it("findMediaInRecycleBin should find a media moved to the recycle bin", async () => {
    // Create and move a media to the recycle bin
    const builder = await new MediaBuilder()
      .withName(TEST_RECYCLE_BIN_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    await builder.moveToRecycleBin();

    // Should not be found in normal tree
    const foundNormal = await MediaTestHelper.findMedia(TEST_RECYCLE_BIN_MEDIA_NAME);
    expect(foundNormal).toBeUndefined();
    // Should be found in recycle bin
    const foundRecycleBin = await MediaTestHelper.findMediaInRecycleBin(TEST_RECYCLE_BIN_MEDIA_NAME);
    expect(foundRecycleBin).toBeDefined();
    expect(foundRecycleBin!.variants[0].name).toBe(TEST_RECYCLE_BIN_MEDIA_NAME);
  });

  it("findMediaInRecycleBin should return undefined for non-existent media", async () => {
    const found = await MediaTestHelper.findMediaInRecycleBin("NonExistentRecycleBinMedia");
    expect(found).toBeUndefined();
  });

  it("emptyRecycleBin should remove all media from the recycle bin", async () => {
    // Create and move a media to the recycle bin
    const builder = await new MediaBuilder()
      .withName("_Test EmptyRecycleBin")
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    await builder.moveToRecycleBin();

    // Should be found in recycle bin
    let found = await MediaTestHelper.findMediaInRecycleBin("_Test EmptyRecycleBin");
    expect(found).toBeDefined();

    // Empty the recycle bin
    await MediaTestHelper.emptyRecycleBin();

    // Should not be found after emptying
    found = await MediaTestHelper.findMediaInRecycleBin("_Test EmptyRecycleBin");
    expect(found).toBeUndefined();
  });

  it("getChildren should return the correct media items in order", async () => {
    const rootName = "_Test getChildren Root";
    const childNames = ["_Test getChildren Child 1", "_Test getChildren Child 2"];
    // Create root folder
    const rootBuilder = await new MediaBuilder()
      .withName(rootName)
      .withFolderMediaType()
      .create();
    const rootId = rootBuilder.getId();
    // Create children
    const childIds: string[] = [];
    for (const name of childNames) {
      const childBuilder = await new MediaBuilder()
        .withName(name)
        .withImageMediaType()
        .withImageValue(tempFileBuilder.getId())
        .withParent(rootId)
        .create();
      childIds.push(childBuilder.getId());
    }
    // Assert getChildren returns the correct media items in order
    const fetchedMedia = await MediaTestHelper.getChildren(rootId, 10);
    expect(fetchedMedia.map(media => media.id)).toEqual(childIds);
    // Cleanup
    await MediaTestHelper.cleanup(rootName);
    for (const name of childNames) {
      await MediaTestHelper.cleanup(name);
    }
  });

  it("restoreFromRecycleBin should restore a media item from recycle bin", async () => {
    // Create and move a media to the recycle bin
    const builder = await new MediaBuilder()
      .withName(TEST_RESTORE_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    await builder.moveToRecycleBin();

    // Should be in recycle bin
    let foundInRecycleBin = await MediaTestHelper.findMediaInRecycleBin(TEST_RESTORE_MEDIA_NAME);
    expect(foundInRecycleBin).toBeDefined();
    expect(foundInRecycleBin!.variants[0].name).toBe(TEST_RESTORE_MEDIA_NAME);

    // Restore from recycle bin
    await MediaTestHelper.restoreFromRecycleBin(TEST_RESTORE_MEDIA_NAME);

    // Should be back in normal tree
    let foundInNormalTree = await MediaTestHelper.findMedia(TEST_RESTORE_MEDIA_NAME);
    expect(foundInNormalTree).toBeDefined();
    expect(foundInNormalTree!.variants[0].name).toBe(TEST_RESTORE_MEDIA_NAME);

    // Should not be in recycle bin anymore
    foundInRecycleBin = await MediaTestHelper.findMediaInRecycleBin(TEST_RESTORE_MEDIA_NAME);
    expect(foundInRecycleBin).toBeUndefined();
  });
}); 