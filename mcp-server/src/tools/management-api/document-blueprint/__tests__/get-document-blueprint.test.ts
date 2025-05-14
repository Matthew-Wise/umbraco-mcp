import GetDocumentBlueprintTool from "../get/get-blueprint.js";
import { DocumentBlueprintBuilder } from "./helpers/document-blueprint-builder.js";
import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("get-document-blueprint", () => {
  const TEST_BLUEPRINT_NAME = "_Test Blueprint Get";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME);
  });

  it("should get a document blueprint by id", async () => {
    // Create a blueprint to get
    const builder = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
      .create();

    // Get the blueprint
    const result = await GetDocumentBlueprintTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Normalize dates and IDs in the response
    const normalizedResult = {
      ...result,
      content: result.content.map(content => {
        const parsed = JSON.parse(content.text as string);
        return {
          ...content,
          text: JSON.stringify({
            ...parsed,
            id: BLANK_UUID,
            documentType: {
              ...parsed.documentType,
              id: BLANK_UUID
            },
            variants: parsed.variants.map((variant: any) => ({
              ...variant,
              createDate: "2000-01-01T00:00:00.000Z",
              updateDate: "2000-01-01T00:00:00.000Z"
            }))
          })
        };
      })
    };
    
    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });

  it("should handle non-existent document blueprint", async () => {
    const result = await GetDocumentBlueprintTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 