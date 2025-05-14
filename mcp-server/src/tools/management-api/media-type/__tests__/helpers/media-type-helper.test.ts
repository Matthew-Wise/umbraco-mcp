import { MediaTypeBuilder } from "./media-type-builder.js";
import { MediaTypeTestHelper } from "./media-type-helper.js";
import { jest } from "@jest/globals";

describe("MediaTypeTestHelper", () => {
  let builder: MediaTypeBuilder;
  const TEST_MEDIA_TYPE_NAME = "_Test MediaTypeHelper";

  beforeEach(() => {
    builder = new MediaTypeBuilder();
  });

  afterEach(async () => {
    await MediaTypeTestHelper.cleanup(TEST_MEDIA_TYPE_NAME);
  });

  it("should verify a created media type", async () => {
    await builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .create();
    const id = builder.getId();
    expect(await MediaTypeTestHelper.verifyMediaType(id)).toBe(true);
  });

  it("should get a created media type by id", async () => {
    await builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .create();
    const id = builder.getId();
    const mediaType = await MediaTypeTestHelper.getMediaType(id);
    expect(mediaType).toBeDefined();
    expect(mediaType.name).toBe(TEST_MEDIA_TYPE_NAME);
    expect(mediaType.id).toBe(id);
  });

  it("should find media types by name", async () => {
    await builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .create();
    const found = await MediaTypeTestHelper.findMediaTypes(TEST_MEDIA_TYPE_NAME);
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].name).toBe(TEST_MEDIA_TYPE_NAME);
  });

  it("cleanup should remove all media types with the test name", async () => {
    await builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .create();
    await MediaTypeTestHelper.cleanup(TEST_MEDIA_TYPE_NAME);
    const found = await MediaTypeTestHelper.findMediaTypes(TEST_MEDIA_TYPE_NAME);
    expect(found.length).toBe(0);
  });
}); 