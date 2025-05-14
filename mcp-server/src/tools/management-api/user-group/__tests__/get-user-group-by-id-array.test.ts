import GetUserGroupByIdArrayTool from "../get/get-user-group-by-id-array.js";
import { UserGroupBuilder } from "./helpers/user-group-builder.js";
import { UserGroupTestHelper } from "./helpers/user-group-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("get-user-group-by-id-array", () => {
  const TEST_GROUP_NAME_1 = "_Test User Group 1";
  const TEST_GROUP_NAME_2 = "_Test User Group 2";
  let originalConsoleError: typeof console.error;

  // Helper to parse response, handling empty string as empty array
  const parseItems = (text: string) => {
    if (!text || text.trim() === "") return [];
    return JSON.parse(text);
  };

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await UserGroupTestHelper.cleanup(TEST_GROUP_NAME_1);
    await UserGroupTestHelper.cleanup(TEST_GROUP_NAME_2);
  });

  it("should get single user group by ID", async () => {
    const builder = await new UserGroupBuilder()
      .withName(TEST_GROUP_NAME_1)
      .create();
    const result = await GetUserGroupByIdArrayTool().handler({ id: [builder.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe(TEST_GROUP_NAME_1);
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should get multiple user groups by ID", async () => {
    const builder1 = await new UserGroupBuilder()
      .withName(TEST_GROUP_NAME_1)
      .create();
    const builder2 = await new UserGroupBuilder()
      .withName(TEST_GROUP_NAME_2)
      .create();
    const result = await GetUserGroupByIdArrayTool().handler({ id: [builder1.getId(), builder2.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe(TEST_GROUP_NAME_1);
    expect(items[1].name).toBe(TEST_GROUP_NAME_2);
    items.forEach((item: any) => {
      item.id = BLANK_UUID;
    });
    expect(items).toMatchSnapshot();
  });
}); 