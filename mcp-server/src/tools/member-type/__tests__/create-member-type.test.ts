import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import CreateMemberTypeTool from "../post/create-member-type.js";
import {
  createSnapshotResult,
  normalizeErrorResponse,
} from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";

describe("create-member-type", () => {
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

  it("should create a member type", async () => {
    const builder = new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .withDescription("Test member type description")
      .withAllowedAsRoot(true);

    const result = await CreateMemberTypeTool().handler(builder.build(), {
      signal: new AbortController().signal,
    });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    expect(normalizedItems).toMatchSnapshot();

    // Verify the member type was created
    const items = await MemberTypeTestHelper.findMemberTypes(
      TEST_MEMBER_TYPE_NAME
    );
    expect(items.length).toBe(1);
    expect(items[0].name).toBe(TEST_MEMBER_TYPE_NAME);
  });

  it("should handle invalid member type data", async () => {
    const invalidModel = {
      name: TEST_MEMBER_TYPE_NAME,
      // Missing required fields
    };

    const result = await CreateMemberTypeTool().handler(invalidModel as any, {
      signal: new AbortController().signal,
    });

    expect(normalizeErrorResponse(result)).toMatchSnapshot();
  });
}); 