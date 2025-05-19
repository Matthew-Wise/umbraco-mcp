import { normalizeErrorResponse } from "@/helpers/test-utils.js";
import ValidateDocumentTypeTool from "../put/validate-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";

const TEST_DOCTYPE_NAME = "_Test ValidateDocumentType";

describe("validate-document-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
  });

  it("should validate a valid document type", async () => {
    const builder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .create();
    const model = builder.build();
    const result = await ValidateDocumentTypeTool().handler(
      {
        id: builder.getId(),
        data: model,
      },
      { signal: new AbortController().signal }
    );
    expect(result).toMatchSnapshot();
  });

  it("should handle invalid document type model", async () => {
    // Invalid model: missing required fields
    const invalidModel = {
      name: "",
      alias: "",
      icon: "",
      allowedAsRoot: false,
      variesByCulture: false,
      variesBySegment: false,
      isElement: false,
      properties: [],
      containers: [],
      allowedTemplates: [],
      cleanup: { preventCleanup: false },
      allowedDocumentTypes: [],
      compositions: [],
    };
    const result = await ValidateDocumentTypeTool().handler(
      {
        id: "00000000-0000-0000-0000-000000000000",
        data: invalidModel,
      },
      { signal: new AbortController().signal }
    );
    expect(normalizeErrorResponse(result)).toMatchSnapshot();
  });
});
