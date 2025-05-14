import DeleteMemberGroupTool from "../delete/delete-member-group.js";
import { MemberGroupBuilder } from "./helpers/member-group-builder.js";
import { MemberGroupTestHelper } from "./helpers/member-group-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_GROUP_NAME = "_Test Member Group Delete";

describe("delete-member-group", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
  });

  it("should delete a member group", async () => {
    const builder = await new MemberGroupBuilder()
        .withName(TEST_GROUP_NAME)
        .create();
    const result = await DeleteMemberGroupTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
    const items = await MemberGroupTestHelper.findMemberGroups(TEST_GROUP_NAME);
    expect(items).toHaveLength(0);
  });

  it("should handle non-existent member group", async () => {
    const result = await DeleteMemberGroupTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 