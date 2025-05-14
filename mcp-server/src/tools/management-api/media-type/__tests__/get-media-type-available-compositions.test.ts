import GetMediaTypeAvailableCompositionsTool from "../post/get-media-type-available-compositions.js";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";
import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import { MediaTypeCompositionResponseModel } from "@/umb-management-api/schemas/index.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_MEDIA_TYPE_NAME = "_Test MediaType Available";
const TEST_COMPOSITION_NAME = "_Test Available Composition";

describe("get-media-type-available-compositions", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test media types
    await MediaTypeTestHelper.cleanup(TEST_MEDIA_TYPE_NAME);
    await MediaTypeTestHelper.cleanup(TEST_COMPOSITION_NAME);
  });

  it("should get available compositions for a media type", async () => {
    // Create a media type that will be available as a composition
    await new MediaTypeBuilder()
      .withName(TEST_COMPOSITION_NAME)
      .create();

    // Create a media type to test available compositions for
    const mediaTypeBuilder = await new MediaTypeBuilder()
      .withName(TEST_MEDIA_TYPE_NAME)
      .create();

    // Get the available compositions
    const result = await GetMediaTypeAvailableCompositionsTool().handler({
      id: mediaTypeBuilder.getId(),
      currentPropertyAliases: [],
      currentCompositeIds: [],
    }, { signal: new AbortController().signal });

    // Parse and filter just our test composition
    const parsed = JSON.parse(result.content[0].text as string) as Record<string, MediaTypeCompositionResponseModel>;
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