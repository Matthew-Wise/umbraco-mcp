import MoveDocumentBlueprintTool from "../put/move-blueprint.js";
import { DocumentBlueprintBuilder } from "./helpers/document-blueprint-builder.js";
import { DocumentBlueprintFolderBuilder } from "./helpers/document-blueprint-folder-builder.js";
import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("move-document-blueprint", () => {
  const TEST_BLUEPRINT_NAME = "_Test Blueprint Move";
  const TEST_FOLDER_NAME = "_Test Folder";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test blueprints
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  it("should move a document blueprint", async () => {
    // Create a folder
    const folderBuilder = await new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME)
      .create();

    // Create a blueprint to move
    const builder = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
      .create();

    // Move the blueprint
    const result = await MoveDocumentBlueprintTool().handler({
      id: builder.getId(),
      data: {
        target: {
          id: folderBuilder.getId()
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the blueprint was moved
    const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_BLUEPRINT_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
  });

  it("should handle moving to non-existent folder", async () => {
    // Create a blueprint to move
    const builder = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
      .create();

    const result = await MoveDocumentBlueprintTool().handler({
      id: builder.getId(),
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle moving non-existent blueprint", async () => {
    const result = await MoveDocumentBlueprintTool().handler({
      id: BLANK_UUID,
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 