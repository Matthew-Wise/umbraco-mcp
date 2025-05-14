import { DocumentTestHelper } from "./document-test-helper.js";
import { DocumentBuilder } from "./document-builder.js";
import { jest } from "@jest/globals";
import type { DocumentTreeItemResponseModel } from "../../../../api/umbraco/management/schemas/documentTreeItemResponseModel.js";
import { BLANK_UUID } from "../../../constants.js";
import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";

const TEST_DOCUMENT_NAME = "_Test DocumentHelper";
const TEST_RECYCLE_BIN_DOCUMENT_NAME = "_Test DocumentHelper RecycleBin";

describe("DocumentTestHelper", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_RECYCLE_BIN_DOCUMENT_NAME);
  });

  it("normaliseIds should blank out id for single and array", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()   
      .create();
    const item = builder.getCreatedItem();
    const normSingle = DocumentTestHelper.normaliseIds(item) as DocumentTreeItemResponseModel;
    expect(normSingle.id).toBe(BLANK_UUID);
    const normArray = DocumentTestHelper.normaliseIds([item]) as DocumentTreeItemResponseModel[];
    expect(normArray[0].id).toBe(BLANK_UUID);
  });

  it("getNameFromItem should return the name from the first variant", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    const item = builder.getCreatedItem();
    expect(DocumentTestHelper.getNameFromItem(item)).toBe(TEST_DOCUMENT_NAME);
  });

  it("findDocument should find a document by variant name", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(DocumentTestHelper.getNameFromItem(found!)).toBe(TEST_DOCUMENT_NAME);
  });

  it("cleanup should remove a document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    // Ensure it exists
    let found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    // Cleanup
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    // Should not be found after cleanup
    found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeUndefined();
  });

  it("findDocumentInRecycleBin should find a document moved to the recycle bin", async () => {
    // Create and move a document to the recycle bin
    const builder = await new DocumentBuilder()
      .withName(TEST_RECYCLE_BIN_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.moveToRecycleBin();

    // Should not be found in normal tree
    const foundNormal = await DocumentTestHelper.findDocument(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    expect(foundNormal).toBeUndefined();
    // Should be found in recycle bin
    const foundRecycleBin = await DocumentTestHelper.findDocumentInRecycleBin(TEST_RECYCLE_BIN_DOCUMENT_NAME);
    expect(foundRecycleBin).toBeDefined();
    expect(foundRecycleBin!.variants[0].name).toBe(TEST_RECYCLE_BIN_DOCUMENT_NAME);
  });

  it("findDocumentInRecycleBin should return undefined for non-existent document", async () => {
    const found = await DocumentTestHelper.findDocumentInRecycleBin("NonExistentRecycleBinDoc");
    expect(found).toBeUndefined();
  });

  it("emptyRecycleBin should remove all documents from the recycle bin", async () => {
    // Create and move a document to the recycle bin
    const builder = await new DocumentBuilder()
      .withName("_Test EmptyRecycleBin")
      .withRootDocumentType()
      .create();
    await builder.moveToRecycleBin();

    // Should be found in recycle bin
    let found = await DocumentTestHelper.findDocumentInRecycleBin("_Test EmptyRecycleBin");
    expect(found).toBeDefined();

    // Empty the recycle bin
    await DocumentTestHelper.emptyRecycleBin();

    // Should not be found after emptying
    found = await DocumentTestHelper.findDocumentInRecycleBin("_Test EmptyRecycleBin");
    expect(found).toBeUndefined();
  });

  it("getChildren should return the correct documents in order", async () => {
    const rootName = "_Test getChildren Root";
    const childNames = ["_Test getChildren Child 1", "_Test getChildren Child 2"];
    // Create root
    const rootBuilder = await new DocumentBuilder()
      .withName(rootName)
      .withRootDocumentType()
      .create();
    await rootBuilder.publish();
    const rootId = rootBuilder.getId();
    // Create children
    const childIds: string[] = [];
    for (const name of childNames) {
      const childBuilder = await new DocumentBuilder()
        .withName(name)
        .withContentDocumentType()
        .withParent(rootId)
        .create();
      await childBuilder.publish();
      childIds.push(childBuilder.getId());
    }
    // Assert getChildren returns the correct documents in order
    const fetchedDocs = await DocumentTestHelper.getChildren(rootId, 10);
    expect(fetchedDocs.map(doc => doc.id)).toEqual(childIds);
    // Cleanup
    await DocumentTestHelper.cleanup(rootName);
    for (const name of childNames) {
      await DocumentTestHelper.cleanup(name);
    }
  });

}); 