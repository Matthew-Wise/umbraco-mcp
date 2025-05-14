import { MemberTestHelper } from "./member-test-helper.js";
import { MemberBuilder } from "./member-builder.js";
import { jest } from "@jest/globals";
import { Default_Memeber_TYPE_ID } from "../../../constants.js";

const TEST_MEMBER_NAME = "_Test MemberHelper";
const TEST_MEMBER_EMAIL = "test@example.com";

describe("MemberTestHelper", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTestHelper.cleanup(TEST_MEMBER_EMAIL);
  });

  it("findMember should find a member by email", async () => {
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

  it("findMember should return undefined for non-existent member", async () => {
    const found = await MemberTestHelper.findMember("nonexistent@example.com");
    expect(found).toBeUndefined();
  });

  it("cleanup should remove a member", async () => {
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    // Ensure it exists
    let found = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(found).toBeDefined();

    // Cleanup
    await MemberTestHelper.cleanup(TEST_MEMBER_EMAIL);

    // Should not be found after cleanup
    found = await MemberTestHelper.findMember(TEST_MEMBER_EMAIL);
    expect(found).toBeUndefined();
  });

  it("cleanup should not throw for non-existent member", async () => {
    await expect(
      MemberTestHelper.cleanup("nonexistent@example.com")
    ).resolves.not.toThrow();
  });
});
