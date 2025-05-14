import UpdateMemberGroupTool from "../put/update-member-group.js";
import { MemberGroupBuilder } from "./helpers/member-group-builder.js";
import { MemberGroupTestHelper } from "./helpers/member-group-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_GROUP_NAME = "_Test Member Group Update";
const UPDATED_GROUP_NAME = "_Updated Member Group";
const NON_EXISTENT_GROUP_NAME = "_Non Existent Member Group";

describe("update-member-group", () => {
  let originalConsoleError: typeof console.error;
  let builder: MemberGroupBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new MemberGroupBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await builder.cleanup();
    await MemberGroupTestHelper.cleanup(UPDATED_GROUP_NAME);
  });

  it("should update a member group", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const result = await UpdateMemberGroupTool().handler({
      id: builder.getId(),
      data: { name: UPDATED_GROUP_NAME }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
    const items = await MemberGroupTestHelper.findMemberGroups(UPDATED_GROUP_NAME);
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should handle non-existent member group", async () => {
    const result = await UpdateMemberGroupTool().handler({
      id: BLANK_UUID,
      data: { name: NON_EXISTENT_GROUP_NAME }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });

}); 