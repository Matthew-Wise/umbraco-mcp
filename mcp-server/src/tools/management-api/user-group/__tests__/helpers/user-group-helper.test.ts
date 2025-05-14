import { UserGroupBuilder } from "./user-group-builder.js";
import { UserGroupTestHelper } from "./user-group-helper.js";
import { jest } from "@jest/globals";

describe("UserGroupTestHelper", () => {
  let builder: UserGroupBuilder;
  const TEST_GROUP_NAME = "_Test UserGroupHelper";

  beforeEach(() => {
    builder = new UserGroupBuilder();
  });

  afterEach(async () => {
    await UserGroupTestHelper.cleanup(TEST_GROUP_NAME);
  });

  it("should verify a created user group", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const id = builder.getId();
    expect(await UserGroupTestHelper.verifyUserGroup(id)).toBe(true);
  });

  it("should find user groups by name", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const found = await UserGroupTestHelper.findUserGroups(TEST_GROUP_NAME);
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].name).toBe(TEST_GROUP_NAME);
  });

  it("cleanup should remove all user groups with the test name", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    await UserGroupTestHelper.cleanup(TEST_GROUP_NAME);
    const found = await UserGroupTestHelper.findUserGroups(TEST_GROUP_NAME);
    expect(found.length).toBe(0);
  });
}); 