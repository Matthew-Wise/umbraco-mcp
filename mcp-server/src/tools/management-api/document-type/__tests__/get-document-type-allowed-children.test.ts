import GetDocumentTypeAllowedChildrenTool from "../get/get-document-type-allowed-children.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("get-document-type-allowed-children", () => {
  const TEST_PARENT_NAME = "_Test Parent DocumentType";
  const TEST_CHILD_NAME = "_Test Child DocumentType";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types
    await DocumentTypeTestHelper.cleanup(TEST_PARENT_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_CHILD_NAME);
  });

  it("should get allowed children for a document type", async () => {
    // Create parent document type
    const parentBuilder = await new DocumentTypeBuilder()
      .withName(TEST_PARENT_NAME)
      .withIcon("icon-document")
      .create();

    // Create child document type
    const childBuilder = await new DocumentTypeBuilder()
      .withName(TEST_CHILD_NAME)
      .withIcon("icon-document")
      .create();

    // Update parent to allow child as allowed document type
    parentBuilder.withAllowedDocumentType(childBuilder.getId());
    await parentBuilder.update();

    // Get allowed children
    const result = await GetDocumentTypeAllowedChildrenTool().handler({
      id: parentBuilder.getId(),
      skip: 0,
      take: 100
    }, { signal: new AbortController().signal });

    // Parse the response
    const response = JSON.parse(result.content[0].text as string);
    
    // Verify the response contains our child document type
    const foundChild = response.items.find((item: any) => item.name === TEST_CHILD_NAME);
    expect(foundChild).toBeDefined();
    expect(foundChild.name).toBe(TEST_CHILD_NAME);

    // Verify the total count
    expect(response.total).toBe(1);

    // Create normalized snapshot for API response structure verification
    const normalizedResult = createSnapshotResult(result);
    expect(normalizedResult).toMatchSnapshot();
  });

  it("should handle non-existent document type", async () => {
    const result = await GetDocumentTypeAllowedChildrenTool().handler({
      id: BLANK_UUID,
      skip: 0,
      take: 100
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });

  it("should handle document type with no allowed children", async () => {
    // Create parent document type with no allowed children
    const parentBuilder = await new DocumentTypeBuilder()
      .withName(TEST_PARENT_NAME)
      .withIcon("icon-document")
      .create();

    const result = await GetDocumentTypeAllowedChildrenTool().handler({
      id: parentBuilder.getId(),
      skip: 0,
      take: 100
    }, { signal: new AbortController().signal });

    // Parse and verify empty response
    const response = JSON.parse(result.content[0].text as string);
    expect(response.total).toBe(0);
    expect(response.items).toHaveLength(0);

    // Create normalized snapshot for API response structure verification
    const normalizedResult = createSnapshotResult(result);
    expect(normalizedResult).toMatchSnapshot();
  });
}); 