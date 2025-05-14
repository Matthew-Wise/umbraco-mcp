import PostDocumentPublicAccessTool from "../post/post-document-public-access.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { MemberGroupBuilder } from "../../member-group/__tests__/helpers/member-group-builder.js";
import { MemberGroupTestHelper } from "../../member-group/__tests__/helpers/member-group-helper.js";
import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test PostPublicAccessDocument";
const TEST_MEMBER_GROUP_NAME = "_Test PostPublicAccess MemberGroup";

describe("post-document-public-access", () => {
  let originalConsoleError: typeof console.error;
  let docId: string;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    await new MemberGroupBuilder().withName(TEST_MEMBER_GROUP_NAME).create();
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    docId = builder.getId();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await MemberGroupTestHelper.cleanup(TEST_MEMBER_GROUP_NAME);
  });

  it("should add public access for a valid document using the post tool", async () => {
    const postResult = await PostDocumentPublicAccessTool().handler({
      id: docId,
      data: {
        loginDocument: { id: docId },
        errorDocument: { id: docId },
        memberUserNames: [],
        memberGroupNames: [TEST_MEMBER_GROUP_NAME]
      }
    }, { signal: new AbortController().signal });
    expect(postResult).toMatchSnapshot();
    // Fetch public access using the client and normalize
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentByIdPublicAccess(docId);
    response.loginDocument.id = BLANK_UUID;
    response.errorDocument.id = BLANK_UUID;
    if (Array.isArray(response.groups)) {
      response.groups.forEach((g: any) => { g.id = BLANK_UUID; });
    }
    expect(response).toMatchSnapshot();
  });

  it("should handle non-existent document", async () => {
    const postResult = await PostDocumentPublicAccessTool().handler({
      id: BLANK_UUID,
      data: {
        loginDocument: { id: BLANK_UUID },
        errorDocument: { id: BLANK_UUID },
        memberUserNames: [],
        memberGroupNames: [TEST_MEMBER_GROUP_NAME]
      }
    }, { signal: new AbortController().signal });
    expect(postResult).toMatchSnapshot();
  });
}); 