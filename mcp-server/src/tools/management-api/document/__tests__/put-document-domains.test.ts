import PutDocumentDomainsTool from "../put/put-document-domains.js";
import { DocumentBuilder, TEST_DOMAIN } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import GetDocumentDomainsTool from "../get/get-document-domains.js";

const TEST_DOCUMENT_NAME = "_Test PutDomainsDocument";

describe("put-document-domains", () => {
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

  it("should add a domain for a valid document", async () => {
    const result = await PutDocumentDomainsTool().handler({
      id: docId,
      data: { defaultIsoCode: null, domains: [TEST_DOMAIN] }
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
    
    const text = result.content[0].text as string;
    expect(text).not.toContain("Error:");

    // Get the domains back to verify
    const getResult = await GetDocumentDomainsTool().handler({
      id: docId
    }, { signal: new AbortController().signal });

    const domains = JSON.parse(getResult.content[0].text as string);
    expect(domains.domains).toEqual(
      expect.arrayContaining([
        expect.objectContaining(TEST_DOMAIN)
      ])
    );
  });

  it("should handle non-existent document", async () => {
    const result = await PutDocumentDomainsTool().handler({
      id: BLANK_UUID,
      data: { defaultIsoCode: "en", domains: [TEST_DOMAIN] }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 