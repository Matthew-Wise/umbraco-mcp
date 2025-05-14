import { TemporaryFileBuilder } from "../../../temporary-file/__tests__/helpers/temporary-file-builder.js";
import { MediaBuilder } from "./media-builder.js";
import { MediaTestHelper } from "./media-test-helper.js";
import { jest } from "@jest/globals";

const TEST_MEDIA_NAME = "_Test MediaBuilder";
const TEST_RECYCLE_BIN_MEDIA_NAME = "_Test MediaBuilder RecycleBin";
const TEST_UPDATE_MEDIA_NAME = "_Test Media Builder Update";
const TEST_UPDATED_MEDIA_NAME = "_Test Media Builder Updated";

describe("MediaBuilder", () => {
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
    await MediaTestHelper.cleanup(TEST_UPDATE_MEDIA_NAME);
    await MediaTestHelper.cleanup(TEST_UPDATED_MEDIA_NAME);
  });

  it("should create a media and find it by name", async () => {

    await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    const found = await MediaTestHelper.findMedia(TEST_MEDIA_NAME);
    expect(found).toBeDefined();
    expect(MediaTestHelper.getNameFromItem(found)).toBe(TEST_MEDIA_NAME);
  });

  it("should return the created media's id and item", async () => {
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    const id = builder.getId();
    const item = builder.getCreatedItem();
    expect(id).toBeDefined();
    expect(item).toBeDefined();
    expect(MediaTestHelper.getNameFromItem(item)).toBe(TEST_MEDIA_NAME);
  });

  it("moveToRecycleBin should move a created media to the recycle bin", async () => {

    const builder = await new MediaBuilder()
      .withName(TEST_RECYCLE_BIN_MEDIA_NAME)
      .withImageMediaType()      
      .withImageValue(tempFileBuilder.getId())
      .create();

    await builder.moveToRecycleBin();
    const foundNormal = await MediaTestHelper.findMedia(TEST_RECYCLE_BIN_MEDIA_NAME);
    expect(foundNormal).toBeUndefined();

    const foundRecycleBin = await MediaTestHelper.findMediaInRecycleBin(TEST_RECYCLE_BIN_MEDIA_NAME);
    expect(foundRecycleBin).toBeDefined();
    expect(foundRecycleBin!.variants[0].name).toBe(TEST_RECYCLE_BIN_MEDIA_NAME);
  });

  it("moveToRecycleBin should throw if called before create", async () => {
    const builder = new MediaBuilder().withName("_Test MoveToRecycleBin Error").withImageMediaType();
    await expect(builder.moveToRecycleBin()).rejects.toThrow(/No media has been created yet/);
  });

  it("should update a media name", async () => {
    const builder = await new MediaBuilder()
      .withName(TEST_UPDATE_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();

    await builder.updateName(TEST_UPDATED_MEDIA_NAME);

    const item = builder.getCreatedItem();
    expect(item).toBeDefined();
    expect(MediaTestHelper.getNameFromItem(item)).toBe(TEST_UPDATED_MEDIA_NAME);

    const found = await MediaTestHelper.findMedia(TEST_UPDATED_MEDIA_NAME);
    expect(found).toBeDefined();
    expect(MediaTestHelper.getNameFromItem(found)).toBe(TEST_UPDATED_MEDIA_NAME);
  });

  it("should create media with parent", async () => {
    // Create parent folder
    const parentBuilder = await new MediaBuilder()
      .withName("_Test Parent Folder")
      .withFolderMediaType()
      .create();
    
    // Create child media
    await new MediaBuilder()
      .withName("_Test Child Media")
      .withImageMediaType()
      .withParent(parentBuilder.getId())
      .withImageValue(tempFileBuilder.getId())
      .create();

    const found = await MediaTestHelper.findMedia("_Test Child Media");
    expect(found).toBeDefined();
    expect(found!.parent?.id).toBe(parentBuilder.getId());

    // Cleanup
    await MediaTestHelper.cleanup("_Test Child Media");
    await MediaTestHelper.cleanup("_Test Parent Folder");
  });

}); 