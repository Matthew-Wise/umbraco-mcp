import GetDocumentAuditLogTool from "../get/get-document-audit-log.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test AuditLogDocument";

describe("get-document-audit-log", () => {
  let originalConsoleError: typeof console.error;
  let docId: string;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    // Create a document
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    docId = builder.getId();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should return audit logs for a valid document", async () => {
    const result = await GetDocumentAuditLogTool().handler({
      id: docId,
      data: {
        orderDirection: "Ascending",
        sinceDate: new Date().toISOString(),
        skip: 0,
        take: 100
      }
    }, { signal: new AbortController().signal });
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
  });

  it("should handle non-existent document", async () => {
    const result = await GetDocumentAuditLogTool().handler({
      id: BLANK_UUID,
      data: {
        orderDirection: "Ascending",
        sinceDate: new Date().toISOString(),
        skip: 0,
        take: 100
      }
    }, { signal: new AbortController().signal });
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
  });
}); 