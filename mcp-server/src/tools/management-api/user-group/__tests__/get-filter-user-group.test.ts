import { getFilterUserGroupQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import GetFilterUserGroupTool from "../get/get-filter-user-group.js";
import { UserGroupBuilder } from "./helpers/user-group-builder.js";
import { PagedUserGroupResponseModel } from "@/umb-management-api/schemas/pagedUserGroupResponseModel.js";


const TEST_GROUP_NAMES = [
  "_Test User Group Filter 1",
  "_Test User Group Filter 2",
  "_Test User Group Filter 3",
  "_Other User Group 1",
  "_Other User Group 2"
];

describe("GetFilterUserGroupTool", () => {
  let builders: UserGroupBuilder[];

  beforeEach(async () => {
    builders = [];
    // Create test user groups
    for (const name of TEST_GROUP_NAMES) {
      const builder = new UserGroupBuilder();
      await builder.withName(name).create();
      builders.push(builder);
    }
  });

  afterEach(async () => {
    // Clean up all test groups
    for (const builder of builders) {
      await builder.cleanup();
    }
  });

  it("should filter user groups by name", async () => {
    const params = getFilterUserGroupQueryParams.parse({ 
      skip: 0, 
      take: 100,
      filter: "Filter" 
    });
    const result = await GetFilterUserGroupTool().handler(params, { signal: new AbortController().signal });

    // Verify the response contains only groups with "Filter" in the name
    const response = JSON.parse(result.content[0].text as string) as PagedUserGroupResponseModel;
    expect(response.items).toHaveLength(3);
    expect(response.items.every((item: { name: string }) => item.name.includes("Filter"))).toBe(true);
  });

  it("should handle empty filter", async () => {
    const params = getFilterUserGroupQueryParams.parse({ 
      skip: 0, 
      take: 100 
    });
    const result = await GetFilterUserGroupTool().handler(params, { signal: new AbortController().signal });

    // Verify the response contains all groups
    const response = JSON.parse(result.content[0].text as string) as PagedUserGroupResponseModel;
    expect(response.items.length).toBeGreaterThanOrEqual(TEST_GROUP_NAMES.length);
  });

  it("should handle pagination", async () => {
    const params = getFilterUserGroupQueryParams.parse({ 
      skip: 2, 
      take: 2 
    });
    const result = await GetFilterUserGroupTool().handler(params, { signal: new AbortController().signal });

    // Verify the response contains only 2 items
    const response = JSON.parse(result.content[0].text as string) as PagedUserGroupResponseModel;
    expect(response.items).toHaveLength(2);
  });
}); 