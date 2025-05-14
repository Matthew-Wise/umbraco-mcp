import GetDocumentTypeAllowedAtRootTool from "../get/get-document-type-allowed-at-root.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { DocumentTypeResponseModel } from "@/umb-management-api/schemas/index.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCTYPE_NAME = "_Test DocumentType Root";

describe("get-document-type-allowed-at-root", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
  });

  it("should get document types allowed at root", async () => {
    // Create test document types
    await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .allowAsRoot(true)
      .create();

    // Get document types allowed at root
    const result = await GetDocumentTypeAllowedAtRootTool().handler({
      skip: 0,
      take: 10
    }, { signal: new AbortController().signal });

    // Parse and find our test document type
    const parsed = JSON.parse(result.content[0].text as string) as { items: DocumentTypeResponseModel[] };
    const testDocType = parsed.items.find(item => item.name === TEST_DOCTYPE_NAME);

    if (!testDocType) {
      throw new Error("Test document type not found in results");
    }

    // Normalize the ID
    testDocType.id = BLANK_UUID;

    // Verify just the test document type
    expect(testDocType).toMatchSnapshot();
  });

}); 