import DeleteDocumentBlueprintTool from "../delete/delete-blueprint.js";
import { DocumentBlueprintBuilder } from "./helpers/document-blueprint-builder.js";
import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
describe("delete-document-blueprint", () => {
  const TEST_BLUEPRINT_NAME = "_Test Blueprint Delete";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any remaining test blueprints
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME);
  });

  it("should delete a document blueprint", async () => {
    // Create a blueprint to delete
    const builder = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
      .create();

    // Delete the blueprint
    const result = await DeleteDocumentBlueprintTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the blueprint no longer exists
    const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(found).toBeUndefined();
  });

  it("should handle non-existent document blueprint", async () => {
    const result = await DeleteDocumentBlueprintTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 