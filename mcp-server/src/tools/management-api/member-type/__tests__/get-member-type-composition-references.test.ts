import GetMemberTypeCompositionReferencesTool from "../get/get-member-type-composition-references.js";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";
import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import { jest } from "@jest/globals";
import { createSnapshotResult } from "@/helpers/test-utils.js";

const TEST_MEMBER_TYPE_NAME = "_Test MemberType Composition";
const TEST_COMPOSITION_NAME = "_Test Composition MemberType";

describe("get-member-type-composition-references", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test member types
    await MemberTypeTestHelper.cleanup(TEST_MEMBER_TYPE_NAME);
    await MemberTypeTestHelper.cleanup(TEST_COMPOSITION_NAME);
  });

  it("should get composition references for a member type", async () => {
    // Create a member type to be used as a composition
    const compositionBuilder = await new MemberTypeBuilder()
      .withName(TEST_COMPOSITION_NAME)
      .create();

    // Create a parent member type that uses the composition
    const parentBuilder = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .withComposition(compositionBuilder.getId())
      .create();

    // Get the composition references
    const result = await GetMemberTypeCompositionReferencesTool().handler({
      id: compositionBuilder.getId()
    }, { signal: new AbortController().signal });

    // Parse the response to get the ID to normalize
    const parsed = JSON.parse(result.content[0].text as string);
    const idToNormalize = parsed[0]?.id;

    // Normalize IDs and dates for snapshot testing
    const normalizedResult = createSnapshotResult(result, idToNormalize);

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });

  it("should handle member type with no composition references", async () => {
    // Create a member type that isn't used as a composition
    const memberTypeBuilder = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .create();

    // Get the composition references
    const result = await GetMemberTypeCompositionReferencesTool().handler({
      id: memberTypeBuilder.getId()
    }, { signal: new AbortController().signal });

    // Parse the response to get the ID to normalize
    const parsed = JSON.parse(result.content[0].text as string);
    const idToNormalize = parsed[0]?.id;

    // Normalize IDs and dates for snapshot testing
    const normalizedResult = createSnapshotResult(result, idToNormalize);

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });
}); 