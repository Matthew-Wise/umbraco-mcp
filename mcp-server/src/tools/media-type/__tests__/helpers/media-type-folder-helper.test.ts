import { MediaTypeFolderBuilder } from "./media-type-folder-builder.js";
import { MediaTypeFolderTestHelper } from "./media-type-folder-helper.js";
import { jest } from "@jest/globals";

describe("MediaTypeFolderTestHelper", () => {
  let builder: MediaTypeFolderBuilder;
  const TEST_FOLDER_NAME = "_Test MediaTypeFolderHelper";

  beforeEach(() => {
    builder = new MediaTypeFolderBuilder();
  });

  afterEach(async () => {
    await MediaTypeFolderTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  it("should verify a created folder", async () => {
    await builder
      .withName(TEST_FOLDER_NAME)
      .create();
    const id = builder.getId();
    expect(await MediaTypeFolderTestHelper.verifyFolder(id)).toBe(true);
  });

  it("should get a created folder by id", async () => {
    await builder
      .withName(TEST_FOLDER_NAME)
      .create();
    const id = builder.getId();
    const folder = await MediaTypeFolderTestHelper.getFolder(id);
    expect(folder).toBeDefined();
    expect(folder.name).toBe(TEST_FOLDER_NAME);
    expect(folder.id).toBe(id);
  });

  it("should find folders by name", async () => {
    await builder
      .withName(TEST_FOLDER_NAME)
      .create();
    const found = await MediaTypeFolderTestHelper.findFolders(TEST_FOLDER_NAME);
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].name).toBe(TEST_FOLDER_NAME);
    expect(found[0].isFolder).toBe(true);
  });

  it("cleanup should remove all folders with the test name", async () => {
    await builder
      .withName(TEST_FOLDER_NAME)
      .create();
    await MediaTypeFolderTestHelper.cleanup(TEST_FOLDER_NAME);
    const found = await MediaTypeFolderTestHelper.findFolders(TEST_FOLDER_NAME);
    expect(found.length).toBe(0);
  });
}); 