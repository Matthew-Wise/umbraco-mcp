import UpdateUserGroupTool from "../put/update-user-group.js";
import { UserGroupBuilder } from "./helpers/user-group-builder.js";
import { UserGroupTestHelper } from "./helpers/user-group-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_GROUP_NAME = "_Test User Group Update";
const UPDATED_GROUP_NAME = "_Updated User Group";
const NON_EXISTENT_GROUP_NAME = "_Non Existent User Group";

describe("update-user-group", () => {
  let originalConsoleError: typeof console.error;
  let builder: UserGroupBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new UserGroupBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await builder.cleanup();
    await UserGroupTestHelper.cleanup(UPDATED_GROUP_NAME);
  });

  it("should update a user group", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const result = await UpdateUserGroupTool().handler({
      id: builder.getId(),
      data: {
        name: UPDATED_GROUP_NAME,
        alias: UPDATED_GROUP_NAME.toLowerCase().replace(/\s+/g, "-"),
        sections: ["content"],
        languages: [],
        hasAccessToAllLanguages: true,
        documentRootAccess: false,
        mediaRootAccess: false,
        fallbackPermissions: [],
        permissions: []
      }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
    const items = await UserGroupTestHelper.findUserGroups(UPDATED_GROUP_NAME);
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should handle non-existent user group", async () => {
    const result = await UpdateUserGroupTool().handler({
      id: BLANK_UUID,
      data: {
        name: NON_EXISTENT_GROUP_NAME,
        alias: NON_EXISTENT_GROUP_NAME.toLowerCase().replace(/\s+/g, "-"),
        sections: ["content"],
        languages: [],
        hasAccessToAllLanguages: true,
        documentRootAccess: false,
        mediaRootAccess: false,
        fallbackPermissions: [],
        permissions: []
      }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 