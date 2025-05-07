import { MediaTypeBuilder } from "./media-type-builder.js";
import { jest } from "@jest/globals";

describe("MediaTypeBuilder", () => {
  let builder: MediaTypeBuilder;

  const TEST_MEDIA_TYPE_NAME = "_Test Media Type";
  const TEST_MEDIA_TYPE_NAME_FULL = "_Test Media Type Full";

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
}); 