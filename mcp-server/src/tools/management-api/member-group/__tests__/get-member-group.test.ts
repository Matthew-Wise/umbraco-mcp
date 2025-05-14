import { getMemberGroupByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import GetMemberGroupTool from "../get/get-member-group.js";
import { MemberGroupBuilder } from "./helpers/member-group-builder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_GROUP_NAME = "_Test Member Group Get";

describe("get-member-group", () => {
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
  });

  it("should get a member group by id", async () => {
    await builder.withName(TEST_GROUP_NAME).create();
    const params = getMemberGroupByIdParams.parse({ id: builder.getId() });
    const result = await GetMemberGroupTool().handler(params, { signal: new AbortController().signal });
    expect(createSnapshotResult(result, builder.getId())).toMatchSnapshot();
  });

  it("should handle non-existent member group", async () => {
    const params = getMemberGroupByIdParams.parse({ id: BLANK_UUID });
    const result = await GetMemberGroupTool().handler(params, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 