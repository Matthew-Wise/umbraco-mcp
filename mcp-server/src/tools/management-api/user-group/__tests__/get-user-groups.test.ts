import { getUserGroupQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import GetUserGroupsTool from "../get/get-user-groups.js";
import { UserGroupBuilder } from "./helpers/user-group-builder.js";

describe("GetUserGroupsTool", () => {
  let builder: UserGroupBuilder;

  beforeEach(() => {
    builder = new UserGroupBuilder();
  });

  afterEach(async () => {
    await builder.cleanup();
  });

  it("should get all user groups", async () => {
    // Create a test user group
    await builder.withName("Test User Group").create();

    // Get all user groups
    const params = getUserGroupQueryParams.parse({ skip: 0, take: 100 });
    await GetUserGroupsTool().handler(params, { signal: new AbortController().signal });

    // No need to test this result as it's dependant on what Umbraco has set up
  });

  it("should handle empty result", async () => {
    // Get all user groups with no groups created
    const params = getUserGroupQueryParams.parse({ skip: 0, take: 100 });
    const result = await GetUserGroupsTool().handler(params, { signal: new AbortController().signal });

    // Verify the response
    expect(result).toMatchSnapshot();
  });
}); 