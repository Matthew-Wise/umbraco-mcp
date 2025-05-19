import { BLANK_UUID, Default_Memeber_TYPE_ID } from "../../constants.js";
import UpdateMemberTool from "../put/update-member.js";
import { MemberBuilder } from "./helpers/member-builder.js";
import { MemberTestHelper } from "./helpers/member-test-helper.js";
import { jest } from "@jest/globals";

const TEST_MEMBER_NAME = "_Test UpdateMember";
const TEST_MEMBER_EMAIL = "test@example.com";
const UPDATED_MEMBER_EMAIL = "updated@example.com";

describe("update-member", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTestHelper.cleanup(TEST_MEMBER_EMAIL);
    await MemberTestHelper.cleanup(UPDATED_MEMBER_EMAIL);
  });

  it("should update a member by ID", async () => {
    // Create a member
    const builder = await new MemberBuilder()
      .withName(TEST_MEMBER_NAME)
      .withEmail(TEST_MEMBER_EMAIL)
      .withUsername(TEST_MEMBER_EMAIL)
      .withPassword("test123@Longer")
      .withMemberType(Default_Memeber_TYPE_ID)
      .create();

    const id = builder.getId();

    // Update the member
    const updateData = {
      email: UPDATED_MEMBER_EMAIL,
      username: UPDATED_MEMBER_EMAIL,
      values: [],
      variants: [
        {
          name: "Updated Name",
        },
      ],
      memberType: { id: Default_Memeber_TYPE_ID },
      isApproved: true,
      isLockedOut: false,
      isTwoFactorEnabled: false,
    };

    const result = await UpdateMemberTool().handler(
      { id, data: updateData },
      { signal: new AbortController().signal }
    );
    expect(result.content[0].text).not.toMatch(/error/i);

    // Verify the member is updated
    const member = await MemberTestHelper.findMember(UPDATED_MEMBER_EMAIL);
    expect(member).toBeDefined();
    expect(member.email).toBe(UPDATED_MEMBER_EMAIL);
    expect(member.username).toBe(UPDATED_MEMBER_EMAIL);
    expect(member.variants[0].name).toBe("Updated Name");
  });

  it("should return error for non-existent ID", async () => {
    const updateData = {
      email: UPDATED_MEMBER_EMAIL,
      username: UPDATED_MEMBER_EMAIL,
      values: [],
      variants: [
        {
          culture: null,
          segment: null,
          name: "Updated Name",
        },
      ],
      isApproved: true,
      isLockedOut: false,
      isTwoFactorEnabled: false,
    };

    const result = await UpdateMemberTool().handler(
      { id: BLANK_UUID, data: updateData },
      { signal: new AbortController().signal }
    );
    expect(result).toMatchSnapshot();
  });
});
