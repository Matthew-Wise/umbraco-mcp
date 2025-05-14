import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import GetMemberTypeTool from "../get/get-member-type.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("get-member-type", () => {
  const TEST_MEMBER_TYPE_NAME = "_Test Member Type";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_NAME);
  });

  it("should get a member type by id", async () => {
    // Create a member type first
    const builder = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .withDescription("Test member type description")
      .withAllowedAsRoot(true)
      .create();

    const result = await GetMemberTypeTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    // Replace the dynamic ID with a placeholder
    const normalizedResponse = JSON.parse(normalizedItems.content[0].text);
    normalizedResponse.id = "PLACEHOLDER_ID";
    normalizedItems.content[0].text = JSON.stringify(normalizedResponse);
    expect(normalizedItems).toMatchSnapshot();
  });

  it("should handle non-existent member type", async () => {
    const result = await GetMemberTypeTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 