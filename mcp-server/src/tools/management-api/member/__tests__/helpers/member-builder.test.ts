import { MemberBuilder } from "./member-builder.js";
import { MemberTestHelper } from "./member-test-helper.js";
import { jest } from "@jest/globals";
import { Default_Memeber_TYPE_ID } from "../../../constants.js";

const TEST_MEMBER_NAME = "_Test MemberBuilder";
const TEST_MEMBER_EMAIL = "test@example.com";

describe("MemberBuilder", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTestHelper.cleanup(TEST_MEMBER_EMAIL);
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
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .withValue("customField", "customValue")
      .create();

    const found = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(found).toBeDefined();
    expect(found.values).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alias: "customField",
          value: "customValue",
        }),
      ])
    );
  });

  it("should create a member with multiple variants", async () => {
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .withVariant("Variant 1")
      .withVariant("Variant 2")
      .create();

    const found = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(found).toBeDefined();
    expect(found.variants).toHaveLength(2);
    expect(found.variants[0].name).toBe("Variant 1");
    expect(found.variants[1].name).toBe("Variant 2");
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
