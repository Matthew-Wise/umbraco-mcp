import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import GetMemberTypeRootTool from "../items/get/get-root.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";

describe("member-type-tree", () => {
  const TEST_ROOT_NAME = "_Test Root MemberType";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MemberTypeTestHelper.cleanup(TEST_ROOT_NAME);
  });

  describe("root", () => {
    it("should get root items", async () => {
      // Create a root member type
      await new MemberTypeBuilder()
        .withName(TEST_ROOT_NAME)
        .withIcon("icon-user")
        .create();

      const result = await GetMemberTypeRootTool().handler({
        take: 100
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });
  });
}); 