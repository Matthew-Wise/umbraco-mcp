import GetMemberGroupByIdArrayTool from "../get/get-member-group-by-id-array.js";
import { MemberGroupBuilder } from "./helpers/member-group-builder.js";
import { MemberGroupTestHelper } from "./helpers/member-group-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("get-item-member-group", () => {
  const TEST_GROUP_NAME_1 = "_Test Item Member Group 1";
  const TEST_GROUP_NAME_2 = "_Test Item Member Group 2";
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
    await MemberGroupTestHelper.cleanup(TEST_GROUP_NAME_1);
    await MemberGroupTestHelper.cleanup(TEST_GROUP_NAME_2);
  });

  it("should get no member groups for empty request", async () => {
    const result = await GetMemberGroupByIdArrayTool().handler({}, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toMatchSnapshot();
  });

  it("should get single member group by ID", async () => {
    const builder = await new MemberGroupBuilder()
      .withName(TEST_GROUP_NAME_1)
      .create();
    const result = await GetMemberGroupByIdArrayTool().handler({ id: [builder.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe(TEST_GROUP_NAME_1);
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should get multiple member groups by ID", async () => {
    const builder1 = await new MemberGroupBuilder()
      .withName(TEST_GROUP_NAME_1)
      .create();
    const builder2 = await new MemberGroupBuilder()
      .withName(TEST_GROUP_NAME_2)
      .create();
    const result = await GetMemberGroupByIdArrayTool().handler({ id: [builder1.getId(), builder2.getId()] }, { signal: new AbortController().signal });
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