import { getUserGroupByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import GetUserGroupTool from "../get/get-user-group.js";
import { UserGroupBuilder } from "./helpers/user-group-builder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_GROUP_NAME = "_Test User Group Get";

describe("get-user-group", () => {
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
  });

  it("should get a user group by id", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const params = getUserGroupByIdParams.parse({ id: builder.getId() });
    const result = await GetUserGroupTool().handler(params, { signal: new AbortController().signal });
    expect(createSnapshotResult(result, builder.getId())).toMatchSnapshot();
  });

  it("should handle non-existent user group", async () => {
    const params = getUserGroupByIdParams.parse({ id: BLANK_UUID });
    const result = await GetUserGroupTool().handler(params, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 