import FindMemberTool from "../get/find-member.js";
import { MemberBuilder } from "./helpers/member-builder.js";
import { MemberTestHelper } from "./helpers/member-test-helper.js";
import { Default_Memeber_TYPE_ID } from "../../constants.js";
import { jest } from "@jest/globals";

const TEST_MEMBER_NAME = "_Test FindMember";
const TEST_MEMBER_EMAIL = "findmember@example.com";
const TEST_MEMBER_USERNAME = "findmember@example.com";

describe("find-member", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTestHelper.cleanup(TEST_MEMBER_USERNAME);
  });

  it("should find a member by username filter", async () => {
    // Create a member
    await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_USERNAME)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    // Use the tool to find by username
    const result = await FindMemberTool().handler(
      { filter: TEST_MEMBER_USERNAME, orderBy: "username", take: 100 },
      { signal: new AbortController().signal }
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data.total).toBeGreaterThan(0);
    const found = data.items.find(
      (m: any) => m.username === TEST_MEMBER_USERNAME
    );
    expect(found).toBeTruthy();
    expect(found.email).toBe(TEST_MEMBER_EMAIL);
  });

  it("should return no results for a non-existent filter", async () => {
    const result = await FindMemberTool().handler(
      {
        filter: "nonexistentuser_" + Date.now(),
        orderBy: "username",
        take: 100,
      },
      { signal: new AbortController().signal }
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data.total).toBe(0);
    expect(data.items.length).toBe(0);
  });

  it("should support pagination (take)", async () => {
    // Create two members
    await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_USERNAME)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();
    await new MemberBuilder()
      .withName(TEST_MEMBER_NAME + "2")
      .withEmail("findmember2@example.com")
      .withUsername("findmember2@example.com")
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    // Use the tool to get only one result
    const result = await FindMemberTool().handler(
      { filter: "findmember@example.com", orderBy: "username", take: 1 },
      { signal: new AbortController().signal }
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data.items.length).toBeLessThanOrEqual(1);
  });
});
