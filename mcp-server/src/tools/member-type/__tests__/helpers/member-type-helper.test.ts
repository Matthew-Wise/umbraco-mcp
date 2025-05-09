import { MemberTypeBuilder } from "./member-type-builder.js";
import { MemberTypeTestHelper } from "./member-type-helper.js";
import { jest } from "@jest/globals";

describe("MemberTypeTestHelper", () => {
  let builder: MemberTypeBuilder;
  const TEST_TYPE_NAME = "_Test MemberTypeHelper";

  beforeEach(() => {
    builder = new MemberTypeBuilder();
  });

  afterEach(async () => {
    await MemberTypeTestHelper.cleanup(TEST_TYPE_NAME);
  });

  it("should verify a created member type", async () => {
    await builder.withName(TEST_TYPE_NAME).create();
    const id = builder.getId();
    expect(await MemberTypeTestHelper.verifyMemberType(id)).toBe(true);
  });

  it("should find member types by name", async () => {
    await builder.withName(TEST_TYPE_NAME).create();
    const found = await MemberTypeTestHelper.findMemberTypes(TEST_TYPE_NAME);
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].name).toBe(TEST_TYPE_NAME);
  });

  it("cleanup should remove all member types with the test name", async () => {
    await builder.withName(TEST_TYPE_NAME).create();
    await MemberTypeTestHelper.cleanup(TEST_TYPE_NAME);
    const found = await MemberTypeTestHelper.findMemberTypes(TEST_TYPE_NAME);
    expect(found.length).toBe(0);
  });

  it("should normalize IDs in an item", () => {
    const item = {
      id: "123",
      parent: { id: "456" },
      name: "Test"
    };
    const normalized = MemberTypeTestHelper.normaliseIds(item);
    expect(normalized.id).toBe("00000000-0000-0000-0000-000000000000");
    expect(normalized.parent.id).toBe("00000000-0000-0000-0000-000000000000");
    expect(normalized.name).toBe("Test");
  });
}); 