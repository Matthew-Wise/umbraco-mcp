import GetMemberTypesByIdArrayTool from "../get/get-member-type-by-id-array.js";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";
import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("get-member-types-by-id-array", () => {
  const TEST_MEMBER_TYPE_NAME = "_Test Item MemberType";
  const TEST_MEMBER_TYPE_NAME_2 = "_Test Item MemberType2";
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
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_NAME);
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_NAME_2);
  });

  it("should get no member types for empty request", async () => {
    // Get all member types
    const result = await GetMemberTypesByIdArrayTool().handler({}, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);

    expect(items).toMatchSnapshot();
  });

  it("should get single member type by ID", async () => {
    // Create a member type
    const builder = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .create();

    // Get by ID
    const result = await GetMemberTypesByIdArrayTool().handler({ id: [builder.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe(TEST_MEMBER_TYPE_NAME);
    // Normalize for snapshot
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should get multiple member types by ID", async () => {
    // Create first member type
    const builder1 = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .create();

    // Create second member type
    const builder2 = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME_2)
      .create();

    // Get by IDs
    const result = await GetMemberTypesByIdArrayTool().handler({ 
      id: [builder1.getId(), builder2.getId()]
    }, { signal: new AbortController().signal });
    
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe(TEST_MEMBER_TYPE_NAME);
    expect(items[1].name).toBe(TEST_MEMBER_TYPE_NAME_2);
    
    // Normalize for snapshot
    items.forEach((item: any) => {
      item.id = BLANK_UUID;
    });
    expect(items).toMatchSnapshot();
  });
}); 