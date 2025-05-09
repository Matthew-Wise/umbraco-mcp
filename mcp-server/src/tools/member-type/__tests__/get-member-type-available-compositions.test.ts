import GetMemberTypeAvailableCompositionsTool from "../post/get-member-type-available-compositions.js";
import { MemberTypeBuilder } from "./helpers/member-type-builder.js";
import { MemberTypeTestHelper } from "./helpers/member-type-helper.js";
import { MemberTypeCompositionResponseModel } from "@/umb-management-api/schemas/index.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_MEMBER_TYPE_NAME = "_Test MemberType Available";
const TEST_COMPOSITION_NAME = "_Test Available Composition";

describe("get-member-type-available-compositions", () => {
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

  it("should get available compositions for a member type", async () => {
    // Create a member type that will be available as a composition
    await new MemberTypeBuilder()
      .withName(TEST_COMPOSITION_NAME)
      .create();

    // Create a member type to test available compositions for
    const memberTypeBuilder = await new MemberTypeBuilder()
      .withName(TEST_MEMBER_TYPE_NAME)
      .create();

    // Get the available compositions
    const result = await GetMemberTypeAvailableCompositionsTool().handler({
      id: memberTypeBuilder.getId(),
      currentPropertyAliases: [],
      currentCompositeIds: [],
    }, { signal: new AbortController().signal });

    // Parse and filter just our test composition
    const parsed = JSON.parse(result.content[0].text as string) as Record<string, MemberTypeCompositionResponseModel>;
    const testComposition = parsed[Object.keys(parsed).find(key => 
      parsed[key].name === TEST_COMPOSITION_NAME
    ) ?? ''];

    if (!testComposition) {
      throw new Error("Test composition not found in results");
    }

    testComposition.id = BLANK_UUID;  

    // Verify just the test composition
    expect(testComposition).toMatchSnapshot();
  });
}); 