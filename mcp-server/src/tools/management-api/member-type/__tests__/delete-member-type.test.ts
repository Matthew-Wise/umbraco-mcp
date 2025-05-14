import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import DeleteMemberTypeTool from "../delete/delete-member-type.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("delete-member-type", () => {
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

  it("should delete a member type", async () => {
    // Create a member type first
    const builder = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .withDescription("Test member type description")
      .withAllowedAsRoot(true)
      .create();

    const result = await DeleteMemberTypeTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    expect(normalizedItems).toMatchSnapshot();

    // Verify the member type was deleted
    const items = await MemberTypeTestHelper.findMemberTypes(TEST_MEMBER_TYPE_NAME);
    expect(items.length).toBe(0);
  });

  it("should handle non-existent member type", async () => {
    const result = await DeleteMemberTypeTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 