import { normalizeErrorResponse } from "@/helpers/test-utils.js";
import ValidateDocumentTypePostTool from "../post/validate-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { jest } from "@jest/globals";

const TEST_DOCTYPE_NAME = "_Test ValidateDocumentTypePost";

describe("validate-document-type-post", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should validate a valid document type (POST)", async () => {
    const model = new DocumentTypeBuilder().withName(TEST_DOCTYPE_NAME).build();
    const result = await ValidateDocumentTypePostTool().handler(model, {
      signal: new AbortController().signal,
    });
    expect(result).toMatchSnapshot();
  });

  it("should handle invalid document type model (POST)", async () => {
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
    const result = await ValidateDocumentTypePostTool().handler(invalidModel, {
      signal: new AbortController().signal,
    });
    expect(normalizeErrorResponse(result)).toMatchSnapshot();
  });
});
