import { MediaTypeBuilder } from "./media-type-builder.js";
import { jest } from "@jest/globals";

describe("MediaTypeBuilder", () => {
  let builder: MediaTypeBuilder;

  const TEST_MEDIA_TYPE_NAME = "_Test Media Type";
  const TEST_MEDIA_TYPE_NAME_FULL = "_Test Media Type Full";
  const TEST_CHILD_MEDIA_TYPE_NAME = "_Test Child Media Type";

  beforeEach(() => {
    builder = new MediaTypeBuilder();
  });

  afterEach(async () => {
    await builder.cleanup();
  });

  it("should create a media type with name", async () => {
    await builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .create();

    expect(builder.getId()).toBeDefined();
    expect(await builder.verify()).toBe(true);
  });

  it("should throw error when trying to get ID before creation", () => {
    expect(() => builder.getId()).toThrow("No media type has been created yet");
  });

  it("should throw error when trying to verify before creation", async () => {
    await expect(builder.verify()).rejects.toThrow("No media type has been created yet");
  });

  it("should create a media type with all properties", async () => {
    await builder
      .withName(TEST_MEDIA_TYPE_NAME_FULL)
      .withDescription("A test media type with all properties")
      .withAllowedAsRoot(true)
      .withVariesByCulture(true)
      .withVariesBySegment(true)
      .withIsElement(true)
      .create();

    expect(builder.getId()).toBeDefined();
    expect(await builder.verify()).toBe(true);
  });

  it("should add allowed media type to the model", async () => {
    // Create a child media type first
    const childBuilder = await new MediaTypeBuilder()
      .withName(TEST_CHILD_MEDIA_TYPE_NAME)
      .create();

    // Add the child as an allowed media type
    builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .withAllowedMediaType(childBuilder.getId());

    const model = builder.build();
    expect(model.allowedMediaTypes).toBeDefined();
    expect(model.allowedMediaTypes?.length).toBe(1);
    expect(model.allowedMediaTypes?.[0].mediaType.id).toBe(childBuilder.getId());
    expect(model.allowedMediaTypes?.[0].sortOrder).toBe(0);

    // Clean up child media type
    await childBuilder.cleanup();
  });

  it("should add multiple allowed media types with correct sort order", async () => {
    // Create child media types
    const childBuilder1 = await new MediaTypeBuilder()
      .withName(`${TEST_CHILD_MEDIA_TYPE_NAME} 1`)
      .create();

    const childBuilder2 = await new MediaTypeBuilder()
      .withName(`${TEST_CHILD_MEDIA_TYPE_NAME} 2`)
      .create();

    // Add both children as allowed media types
    builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .withAllowedMediaType(childBuilder1.getId())
      .withAllowedMediaType(childBuilder2.getId());

    const model = builder.build();
    expect(model.allowedMediaTypes).toBeDefined();
    expect(model.allowedMediaTypes?.length).toBe(2);
    
    // Verify first child
    expect(model.allowedMediaTypes?.[0].mediaType.id).toBe(childBuilder1.getId());
    expect(model.allowedMediaTypes?.[0].sortOrder).toBe(0);
    
    // Verify second child
    expect(model.allowedMediaTypes?.[1].mediaType.id).toBe(childBuilder2.getId());
    expect(model.allowedMediaTypes?.[1].sortOrder).toBe(1);

    // Clean up child media types
    await childBuilder1.cleanup();
    await childBuilder2.cleanup();
  });

  it("should create a media type with allowed children", async () => {
    // Create child media type
    const childBuilder = await new MediaTypeBuilder()
      .withName(TEST_CHILD_MEDIA_TYPE_NAME)
      .create();

    // Create parent with allowed child
    await builder
      .withName(TEST_MEDIA_TYPE_NAME)
      .withAllowedMediaType(childBuilder.getId())
      .create();

    expect(builder.getId()).toBeDefined();
    expect(await builder.verify()).toBe(true);

    // Clean up child media type
    await childBuilder.cleanup();
  });
}); 