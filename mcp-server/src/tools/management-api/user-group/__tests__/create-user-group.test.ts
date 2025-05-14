import CreateUserGroupTool from "../post/create-user-group.js";
import { UserGroupTestHelper } from "./helpers/user-group-helper.js";
import { jest } from "@jest/globals";

const TEST_GROUP_NAME = "_Test User Group Created";
const EXISTING_GROUP_NAME = "_Existing User Group";

describe("create-user-group", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await UserGroupTestHelper.cleanup(TEST_GROUP_NAME);
    await UserGroupTestHelper.cleanup(EXISTING_GROUP_NAME);
  });

  it("should create a user group", async () => {
    const result = await CreateUserGroupTool().handler({
      name: TEST_GROUP_NAME,
      alias: TEST_GROUP_NAME.toLowerCase().replace(/\s+/g, "-"),
      sections: ["content"],
      languages: [],
      hasAccessToAllLanguages: true,
      documentRootAccess: false,
      mediaRootAccess: false,
      fallbackPermissions: [],
      permissions: []
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();

    const items = await UserGroupTestHelper.findUserGroups(TEST_GROUP_NAME);
    items[0].id = "NORMALIZED_ID";
    expect(items).toMatchSnapshot();
  });

  it("should handle existing user group", async () => {
    // First create the group
    await CreateUserGroupTool().handler({
      name: EXISTING_GROUP_NAME,
      alias: EXISTING_GROUP_NAME.toLowerCase().replace(/\s+/g, "-"),
      sections: ["content"],
      languages: [],
      hasAccessToAllLanguages: true,
      documentRootAccess: false,
      mediaRootAccess: false,
      fallbackPermissions: [],
      permissions: []
    }, { signal: new AbortController().signal });

    // Try to create it again
    const result = await CreateUserGroupTool().handler({
      name: EXISTING_GROUP_NAME,
      alias: EXISTING_GROUP_NAME.toLowerCase().replace(/\s+/g, "-"),
      sections: ["content"],
      languages: [],
      hasAccessToAllLanguages: true,
      documentRootAccess: false,
      mediaRootAccess: false,
      fallbackPermissions: [],
      permissions: []
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 