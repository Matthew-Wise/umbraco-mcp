import CreateDocumentBlueprintTool from "../post/create-blueprint.js";
import { DocumentBlueprintBuilder } from "./helpers/document-blueprint-builder.js";
import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import { jest } from "@jest/globals";
import { ROOT_DOCUMENT_TYPE_ID } from "../../constants.js";
const TEST_BLUEPRINT_NAME = "_Test Blueprint Created";
const EXISTING_BLUEPRINT_NAME = "_Existing Blueprint";

describe("create-document-blueprint", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test blueprints
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME);
    await DocumentBlueprintTestHelper.cleanup(EXISTING_BLUEPRINT_NAME);
  });

  it("should create a document blueprint", async () => {
    // Create blueprint model using builder
    const blueprintModel = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .build();

    // Create the blueprint
    const result = await CreateDocumentBlueprintTool().handler(blueprintModel, { 
      signal: new AbortController().signal 
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const item = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(item).toBeDefined();
    expect(DocumentBlueprintTestHelper.normaliseIds(item!)).toMatchSnapshot();
  });

  it("should handle existing document blueprint", async () => {
    // Create blueprint model
    const blueprintModel = new DocumentBlueprintBuilder(EXISTING_BLUEPRINT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .build();

    // First create the blueprint
    await CreateDocumentBlueprintTool().handler(blueprintModel, { 
      signal: new AbortController().signal 
    });

    // Try to create it again
    const result = await CreateDocumentBlueprintTool().handler(blueprintModel, { 
      signal: new AbortController().signal 
    });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 