import GetDocumentPublicAccessTool from "../get/get-document-public-access.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { MemberGroupBuilder } from "../../member-group/__tests__/helpers/member-group-builder.js";
import { MemberGroupTestHelper } from "../../member-group/__tests__/helpers/member-group-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test GetPublicAccessDocument";
const TEST_MEMBER_GROUP_NAME = "_Test PublicAccess MemberGroup";

describe("get-document-public-access", () => {
  let originalConsoleError: typeof console.error;
  let docId: string;
  let memberGroupBuilder: MemberGroupBuilder;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    memberGroupBuilder = new MemberGroupBuilder();
    await memberGroupBuilder.withName(TEST_MEMBER_GROUP_NAME).create();
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.setPublicAccess(TEST_MEMBER_GROUP_NAME);
    docId = builder.getId();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await MemberGroupTestHelper.cleanup(TEST_MEMBER_GROUP_NAME);
  });

  it("should get public access for a valid document", async () => {
    const result = await GetDocumentPublicAccessTool().handler({ id: docId }, { signal: new AbortController().signal });
    // Normalize IDs in the response for snapshot
    const text = result.content[0].text as string;
    const parsed = JSON.parse(text);
    parsed.loginDocument.id = BLANK_UUID;
    parsed.errorDocument.id = BLANK_UUID;
    if (Array.isArray(parsed.groups)) {
      parsed.groups.forEach((g: any) => { g.id = BLANK_UUID; });
    }
    result.content[0].text = JSON.stringify(parsed);
    expect(result).toMatchSnapshot();
  });

  it("should handle non-existent document", async () => {
    const result = await GetDocumentPublicAccessTool().handler({ id: BLANK_UUID }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
    const text = result.content[0].text as string;
    expect(text.startsWith("Error:")).toBe(true);
  });
}); 