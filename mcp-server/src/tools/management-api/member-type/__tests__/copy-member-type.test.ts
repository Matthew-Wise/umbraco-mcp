import CopyMemberTypeTool from "../post/copy-member-type.js";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";
import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_MEMBER_TYPE_NAME = "_Test MemberType Copy";
const TEST_MEMBER_TYPE_COPY_NAME = "_Test MemberType Copy (copy)";

describe("copy-member-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test member types
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_NAME);
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_COPY_NAME);
  });

  it("should copy a member type", async () => {
    // Create a member type to copy
    const memberTypeBuilder = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .withIcon("icon-user")
      .create();

    // Copy the member type
    const result = await CopyMemberTypeTool().handler({
      id: memberTypeBuilder.getId(),
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the member type was actually copied
    const copiedMemberTypes = await MemberTypeTestHelper.findMemberTypes(TEST_MEMBER_TYPE_COPY_NAME);
    expect(copiedMemberTypes.length).toBeGreaterThan(0);
  });

  it("should handle non-existent member type", async () => {
    const result = await CopyMemberTypeTool().handler({
      id: BLANK_UUID,
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 