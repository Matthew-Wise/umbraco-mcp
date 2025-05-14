import CreateMemberGroupTool from "../post/create-member-group.js";
import { MemberGroupTestHelper } from "./helpers/member-group-helper.js";
import { jest } from "@jest/globals";

const TEST_GROUP_NAME = "_Test Member Group Created";
const EXISTING_GROUP_NAME = "_Existing Member Group";

describe("create-member-group", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberGroupTestHelper.cleanup(TEST_GROUP_NAME);
    await MemberGroupTestHelper.cleanup(EXISTING_GROUP_NAME);
  });

  it("should create a member group", async () => {
    const result = await CreateMemberGroupTool().handler({
      name: TEST_GROUP_NAME
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();

    const items = await MemberGroupTestHelper.findMemberGroups(TEST_GROUP_NAME);
    expect(items).toEqual([{
      id: expect.any(String),
      name: TEST_GROUP_NAME
    }]);
  });

  it("should handle existing member group", async () => {
    // First create the group
    await CreateMemberGroupTool().handler({
      name: EXISTING_GROUP_NAME
    }, { signal: new AbortController().signal });

    // Try to create it again
    const result = await CreateMemberGroupTool().handler({
      name: EXISTING_GROUP_NAME
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 