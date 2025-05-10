import GetMemberGroupRootTool from "../get/get-root.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { MemberGroupBuilder } from "./helpers/member-group-builder.js";
import { MemberGroupTestHelper } from "./helpers/member-group-helper.js";
import { jest } from "@jest/globals";

const TEST_GROUP_NAME_1 = "_Test Member Group Root 1";
const TEST_GROUP_NAME_2 = "_Test Member Group Root 2";

describe("get-member-group-root", () => {
  let originalConsoleError: typeof console.error;
  let builder1: MemberGroupBuilder;
  let builder2: MemberGroupBuilder;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder1 = new MemberGroupBuilder();
    builder2 = new MemberGroupBuilder();
    await builder1.withName(TEST_GROUP_NAME_1).create();
    await builder2.withName(TEST_GROUP_NAME_2).create();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberGroupTestHelper.cleanup(TEST_GROUP_NAME_1);
    await MemberGroupTestHelper.cleanup(TEST_GROUP_NAME_2);
  });

  it("should get the root of the member group tree and include created groups", async () => {
    const result = await GetMemberGroupRootTool().handler({ take: 100 }, { signal: new AbortController().signal });

    
    const text = typeof result.content[0].text === "string" ? result.content[0].text : "";
    const parsed = text ? JSON.parse(text) : { items: [] };
    const names = parsed.items ? parsed.items.map((item: any) => item.name) : [];
    expect(names).toEqual(expect.arrayContaining([TEST_GROUP_NAME_1, TEST_GROUP_NAME_2]));
  });
}); 