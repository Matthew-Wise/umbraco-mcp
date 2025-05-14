import DeleteUserGroupTool from "../delete/delete-user-group.js";
import { UserGroupBuilder } from "./helpers/user-group-builder.js";
import { UserGroupTestHelper } from "./helpers/user-group-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_GROUP_NAME = "_Test User Group Delete";

describe("delete-user-group", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
  });

  it("should delete a user group", async () => {
    const builder = await new UserGroupBuilder()
        .withName(TEST_GROUP_NAME)
        .create();
    const result = await DeleteUserGroupTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
    const items = await UserGroupTestHelper.findUserGroups(TEST_GROUP_NAME);
    expect(items).toHaveLength(0);
  });

  it("should handle non-existent user group", async () => {
    const result = await DeleteUserGroupTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 