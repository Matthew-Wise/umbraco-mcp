import GetDocumentBlueprintByIdArrayTool from "../get/get-document-blueprint-by-id-array.js";
import { DocumentBlueprintBuilder } from "./helpers/document-blueprint-builder.js";
import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import { BLANK_UUID } from "../../constants.js";
import { jest } from "@jest/globals";

describe("get-item-document-blueprint", () => {
  const TEST_BLUEPRINT_NAME = "_Test Item Blueprint";
  const TEST_BLUEPRINT_NAME_2 = "_Test Item Blueprint2";
  let originalConsoleError: typeof console.error;

  // Helper to parse response, handling empty string as empty array
  const parseItems = (text: string) => {
    if (!text || text.trim() === "") return [];
    return JSON.parse(text);
  };

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME_2);
  });

  it("should get no document blueprints for empty request", async () => {
    // Get all document blueprints
    const result = await GetDocumentBlueprintByIdArrayTool().handler({}, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toMatchSnapshot();
  });

  it("should get single document blueprint by ID", async () => {
    // Create a document blueprint
    const builder = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
      .create();

    // Get by ID
    const result = await GetDocumentBlueprintByIdArrayTool().handler({ id: [builder.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe(TEST_BLUEPRINT_NAME);
    // Normalize for snapshot
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should get multiple document blueprints by ID", async () => {
    // Create first document blueprint
    const builder1 = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
      .create();

    // Create second document blueprint
    const builder2 = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME_2)
      .create();

    // Get by IDs
    const result = await GetDocumentBlueprintByIdArrayTool().handler({ 
      id: [builder1.getId(), builder2.getId()]
    }, { signal: new AbortController().signal });
    
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe(TEST_BLUEPRINT_NAME);
    expect(items[1].name).toBe(TEST_BLUEPRINT_NAME_2);
    
    // Normalize for snapshot
    items.forEach((item: any) => {
      item.id = BLANK_UUID;
    });
    expect(items).toMatchSnapshot();
  });
}); 