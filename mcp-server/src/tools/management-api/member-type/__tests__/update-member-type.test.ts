import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import UpdateMemberTypeTool from "../put/update-member-type.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";
import { BLANK_UUID } from "../../constants.js";

const TEST_MEMBER_TYPE_NAME = "_Test Member Type Update";
const UPDATED_MEMBER_TYPE_NAME = "_Updated Member Type";
const NON_EXISTENT_MEMBER_TYPE_NAME = "_Non Existent Member Type";

describe("update-member-type", () => {
  let originalConsoleError: typeof console.error;
  let builder: MemberTypeBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new MemberTypeBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await builder.cleanup();
    await MemberTypeTestHelper.cleanup(UPDATED_MEMBER_TYPE_NAME);
  });

  it("should update a member type", async () => {
    await builder.withName(TEST_MEMBER_TYPE_NAME).create();

    const model = builder
      .withName(UPDATED_MEMBER_TYPE_NAME)
      .build();

    const result = await UpdateMemberTypeTool().handler({
      id: builder.getId(),
      data: model
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
    const items = await MemberTypeTestHelper.findMemberTypes(UPDATED_MEMBER_TYPE_NAME);
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should handle non-existent member type", async () => {
    const model = builder
      .withName(NON_EXISTENT_MEMBER_TYPE_NAME)
      .withAllowedAsRoot(true)
      .withIsElement(false)
      .build();

    const result = await UpdateMemberTypeTool().handler({
      id: BLANK_UUID,
      data: model
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 