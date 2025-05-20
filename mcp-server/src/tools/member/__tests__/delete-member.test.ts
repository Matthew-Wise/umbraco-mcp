import { BLANK_UUID, Default_Memeber_TYPE_ID } from "../../constants.js";
import DeleteMemberTool from "../delete/delete-member.js";
import { MemberBuilder } from "./helpers/member-builder.js";
import { MemberTestHelper } from "./helpers/member-test-helper.js";
import { jest } from "@jest/globals";

const TEST_MEMBER_NAME = "_Test DeleteMember";

describe("delete-member", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
  });

  it("should delete a member by ID", async () => {
    // Create a member
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail("test@example.com")
      .withUsername("test@example.com")
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    const id = builder.getId();

    // Delete the member
    const result = await DeleteMemberTool().handler(
      { id },
      { signal: new AbortController().signal }
    );
    expect(result).toMatchSnapshot();

    // Verify the member is deleted
    const member = await MemberTestHelper.findMember("test@example.com");
    expect(member).toBeUndefined();
  });

  it("should return error for non-existent ID", async () => {
    const result = await DeleteMemberTool().handler(
      { id: BLANK_UUID },
      { signal: new AbortController().signal }
    );
    expect(result).toMatchSnapshot();
  });
});
