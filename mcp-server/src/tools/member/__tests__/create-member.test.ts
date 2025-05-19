import CreateMemberTool from "../post/create-member.js";
import { MemberBuilder } from "./helpers/member-builder.js";
import { MemberTestHelper } from "./helpers/member-test-helper.js";
import { jest } from "@jest/globals";
import { Default_Memeber_TYPE_ID } from "../../constants.js";
import { MemberTypeBuilder } from "../../member-type/__tests__/helpers/member-type-builder.js";
import { MemberTypeTestHelper } from "../../member-type/__tests__/helpers/member-type-helper.js";

const TEST_MEMBER_EMAIL = "test@example.com";
const TEST_MEMBER_TYPE_NAME = "Test Member Type";

describe("create-member", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_NAME);
    await MemberTestHelper.cleanup(TEST_MEMBER_EMAIL);
  });

  it("should create a member", async () => {
    // Create member model using builder
    const memberModel = new MemberBuilder()
      .withName("Test Member")
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .build();

    // Create the member
    const result = await CreateMemberTool().handler(memberModel, {
      signal: new AbortController().signal,
    });

    // Verify the created member exists and matches expected values
    const member = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(member).toBeDefined();
    const norm = MemberTestHelper.normalize(member!);
    expect(norm).toMatchSnapshot();
  });

  it("should create a member with additional properties", async () => {
    const memberType = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .withProperty("Custom Field")
      .create();

    const memberTypeId = memberType.getId();

    // Create a more complex member with additional values
    const memberModel = new MemberBuilder()
      .withName("Test Member")
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(memberTypeId)
      .withValue("customfield", "customValue")
      .build();

    const result = await CreateMemberTool().handler(memberModel, {
      signal: new AbortController().signal,
    });

    expect(result).toMatchSnapshot();

    const member = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(member).toBeDefined();
    const norm = MemberTestHelper.normalize(member!);
    expect(norm).toMatchSnapshot();
  });
});
