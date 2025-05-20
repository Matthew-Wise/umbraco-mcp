import { MemberBuilder } from "./member-builder.js";
import { MemberTestHelper } from "./member-test-helper.js";
import { jest } from "@jest/globals";
import { Default_Memeber_TYPE_ID } from "../../../constants.js";
import { MemberTypeBuilder } from "../../../member-type/__tests__/helpers/member-type-builder.js";
import { MemberTypeTestHelper } from "../../../member-type/__tests__/helpers/member-type-helper.js";

const TEST_MEMBER_NAME = "_Test MemberBuilder";
const TEST_MEMBER_EMAIL = "test@example.com";
const TEST_MEMBER_TYPE_NAME = "_Test_MemberBuilder_Type";

describe("MemberBuilder", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTestHelper.cleanup(TEST_MEMBER_EMAIL);
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_NAME);
  });

  it("should create a member and find it by email", async () => {
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    const found = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(found).toBeDefined();
    expect(found.username).toBe(TEST_MEMBER_EMAIL);
  });

  it("should return the created member's id and item", async () => {
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    const id = builder.getId();
    const item = builder.getCreatedItem();
    expect(id).toBeDefined();
    expect(item).toBeDefined();
    expect(item.username).toBe(TEST_MEMBER_EMAIL);
  });

  it("should create a member with custom values", async () => {
    const memberType = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .withProperty("Custom Field")
      .create();

    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(memberType.getId())
      .withValue("customfield", "customValue")
      .create();

    const found = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(found).toBeDefined();
    expect(found.values).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alias: "customfield",
          value: "customValue",
        }),
      ])
    );
  });

  it("should throw if trying to get id before create", async () => {
    const builder = new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID);

    expect(() => builder.getId()).toThrow("No member has been created yet");
  });

  it("should throw if trying to get created item before create", async () => {
    const builder = new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID);

    expect(() => builder.getCreatedItem()).toThrow(
      "No member has been created yet"
    );
  });
});
