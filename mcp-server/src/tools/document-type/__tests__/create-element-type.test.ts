import { normalizeErrorResponse } from "@/helpers/test-utils.js";
import CreateElementTypeTool from "../post/create-element-type.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";

const TEST_ELEMENT_NAME = "_Test ElementType Created";
const EXISTING_ELEMENT_NAME = "_Existing ElementType";

describe("create-element-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test element types
    await DocumentTypeTestHelper.cleanup(TEST_ELEMENT_NAME);
    await DocumentTypeTestHelper.cleanup(EXISTING_ELEMENT_NAME);
  });

  it("should create an element type", async () => {
    const elementModel = {
      name: TEST_ELEMENT_NAME,
      alias: TEST_ELEMENT_NAME.toLowerCase().replace(/\s+/g, ""),
      icon: "icon-document",
      compositions: [],
      properties: [],
    };

    // Create the element type
    const result = await CreateElementTypeTool().handler(elementModel, {
      signal: new AbortController().signal,
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const item = await DocumentTypeTestHelper.findDocumentType(
      TEST_ELEMENT_NAME
    );
    expect(item).toBeDefined();
    expect(DocumentTypeTestHelper.normaliseIds(item!)).toMatchSnapshot();
  });

  it("should handle existing element type", async () => {
    const elementModel = {
      name: EXISTING_ELEMENT_NAME,
      alias: EXISTING_ELEMENT_NAME.toLowerCase().replace(/\s+/g, ""),
      icon: "icon-document",
      compositions: [],
      properties: [],
    };

    // First create the element type
    const rsp = await CreateElementTypeTool().handler(elementModel, {
      signal: new AbortController().signal,
    });


    // Try to create it again
    const result = await CreateElementTypeTool().handler(elementModel, {
      signal: new AbortController().signal,
    });

    // Verify the error response using snapshot
    expect(normalizeErrorResponse(result)).toMatchSnapshot();
  });

  it("should create an element type with properties", async () => {
    const elementModel = {
      name: TEST_ELEMENT_NAME,
      alias: TEST_ELEMENT_NAME.toLowerCase().replace(/\s+/g, ""),
      icon: "icon-document",
      description: "Test element type with properties",
      compositions: [],
      properties: [
        {
          name: "Test Property",
          alias: "testProperty",
          dataTypeId: "0cc0eba1-9960-42c9-bf9b-60e150b429ae",
          tab: "Content",
          group: "General",
        },
      ],
    };

    const result = await CreateElementTypeTool().handler(elementModel, {
      signal: new AbortController().signal,
    });

    expect(result).toMatchSnapshot();

    const item = await DocumentTypeTestHelper.findDocumentType(
      TEST_ELEMENT_NAME
    );
    expect(item).toBeDefined();
    expect(DocumentTypeTestHelper.normaliseIds(item!)).toMatchSnapshot();
  });
});
