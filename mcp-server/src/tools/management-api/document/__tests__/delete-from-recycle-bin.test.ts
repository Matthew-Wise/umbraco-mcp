import DeleteFromRecycleBinTool from "../delete/delete-from-recycle-bin.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("delete-from-recycle-bin", () => {
  const TEST_RECYCLE_BIN_NAME = "_Test DeleteFromRecycleBinTool";
  let originalConsoleError: typeof console.error;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    await DocumentTestHelper.emptyRecycleBin();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_RECYCLE_BIN_NAME);
  });

  it("should delete a document from the recycle bin by id", async () => {
    // Create and move a document to the recycle bin
    const builder = await new DocumentBuilder()
      .withName(TEST_RECYCLE_BIN_NAME)
      .withRootDocumentType()
      .create();
    await builder.moveToRecycleBin();

    // Should be found in recycle bin
    let found = await DocumentTestHelper.findDocumentInRecycleBin(TEST_RECYCLE_BIN_NAME);
    expect(found).toBeDefined();

    // Call the tool
    const result = await DeleteFromRecycleBinTool().handler({ id: found!.id }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();

    // Should not be found after deletion
    found = await DocumentTestHelper.findDocumentInRecycleBin(TEST_RECYCLE_BIN_NAME);
    expect(found).toBeUndefined();
  });

  it("should handle deleting a non-existent document from the recycle bin", async () => {
    const result = await DeleteFromRecycleBinTool().handler({ id: BLANK_UUID }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 