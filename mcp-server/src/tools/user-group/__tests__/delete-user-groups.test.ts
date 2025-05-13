import DeleteUserGroupsTool from "../delete/delete-user-groups.js";
import { UserGroupBuilder } from "./helpers/user-group-builder.js";
import { UserGroupTestHelper } from "./helpers/user-group-helper.js";
import { jest } from "@jest/globals";

const TEST_GROUP_NAMES = ["_Test User Group 1", "_Test User Group 2", "_Test User Group 3"];

describe("delete-user-groups", () => {
  let originalConsoleError: typeof console.error;
  let builders: UserGroupBuilder[];

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builders = [];
  });

  afterEach(async () => {
    // Clean up any remaining groups
    for (const builder of builders) {
      await builder.cleanup();
    }
    console.error = originalConsoleError;
  });

  it("should delete multiple user groups", async () => {
    // Create multiple test user groups
    for (const name of TEST_GROUP_NAMES) {
      const builder = new UserGroupBuilder();
      await builder.withName(name).create();
      builders.push(builder);
    }

    // Get all user groups to verify they exist
    const items = await UserGroupTestHelper.findUserGroups(TEST_GROUP_NAMES[0]);
    expect(items).toHaveLength(1);

    // Delete all test groups
    const result = await DeleteUserGroupsTool().handler({
      userGroupIds: builders.map(builder => ({ id: builder.getId() }))
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();

    // Verify all groups are deleted
    for (const name of TEST_GROUP_NAMES) {
      const items = await UserGroupTestHelper.findUserGroups(name);
      expect(items).toHaveLength(0);
    }
  });

  it("should handle empty array of user groups", async () => {
    const result = await DeleteUserGroupsTool().handler({
      userGroupIds: []
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 