import { MemberGroupBuilder } from "./member-group-builder.js";
import { MemberGroupTestHelper } from "./member-group-helper.js";
import { jest } from "@jest/globals";

describe("MemberGroupTestHelper", () => {
  let builder: MemberGroupBuilder;
  const TEST_GROUP_NAME = "_Test MemberGroupHelper";

  beforeEach(() => {
    builder = new MemberGroupBuilder();
  });

  afterEach(async () => {
    await MemberGroupTestHelper.cleanup(TEST_GROUP_NAME);
  });

  it("should verify a created member group", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const id = builder.getId();
    expect(await MemberGroupTestHelper.verifyMemberGroup(id)).toBe(true);
  });

  it("should find member groups by name", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const found = await MemberGroupTestHelper.findMemberGroups(TEST_GROUP_NAME);
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].name).toBe(TEST_GROUP_NAME);
  });

  it("cleanup should remove all member groups with the test name", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    await MemberGroupTestHelper.cleanup(TEST_GROUP_NAME);
    const found = await MemberGroupTestHelper.findMemberGroups(TEST_GROUP_NAME);
    expect(found.length).toBe(0);
  });
}); 