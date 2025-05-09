import { BLANK_UUID, Default_Memeber_TYPE_ID } from "../../constants.js";
import GetMemberTool from "../get/get-member.js";
import { MemberBuilder } from "./helpers/member-builder.js";
import { MemberTestHelper } from "./helpers/member-test-helper.js";
import { jest } from "@jest/globals";

const TEST_MEMBER_NAME = "_Test GetMember";

describe("get-member", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTestHelper.cleanup(TEST_MEMBER_NAME);
  });

  it("should get a member by ID", async () => {
    // Create a member
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail("test@example.com")
      .withUsername("test@example.com")
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    const id = builder.getId();

    // Get by ID
    const result = await GetMemberTool().handler(
      { id },
      { signal: new AbortController().signal }
    );
    const member = JSON.parse(result.content[0].text as string);

    expect(member.id).toBe(id);
    expect(member.username).toBe("test@example.com");
  });

  it("should return error for non-existent ID", async () => {
    const result = await GetMemberTool().handler(
      { id: BLANK_UUID },
      { signal: new AbortController().signal }
    );
    expect(result.content[0].text).toMatch(/error/i);
  });
});
