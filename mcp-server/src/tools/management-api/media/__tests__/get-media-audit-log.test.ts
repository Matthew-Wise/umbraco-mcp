import GetMediaAuditLogTool from "../get/get-media-audit-log.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

const TEST_MEDIA_NAME = "_Test AuditLogMedia";

describe("get-media-audit-log", () => {
  let originalConsoleError: typeof console.error;
  let mediaId: string;
  let tempFileBuilder: TemporaryFileBuilder;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();

    tempFileBuilder = await new TemporaryFileBuilder()
      .withExampleFile()
      .create();

    // Create a media item
    const builder = await new MediaBuilder()
      .withName(TEST_MEDIA_NAME)
      .withImageMediaType()
      .withImageValue(tempFileBuilder.getId())
      .create();
    mediaId = builder.getId();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME);
  });

  it("should return audit logs for a valid media item", async () => {
    const result = await GetMediaAuditLogTool().handler({
      id: mediaId,
      data: {
        orderDirection: "Ascending",
        sinceDate: new Date().toISOString(),
        skip: 0,
        take: 100
      }
    }, { signal: new AbortController().signal });
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
  });

  it("should handle non-existent media", async () => {
    const result = await GetMediaAuditLogTool().handler({
      id: BLANK_UUID,
      data: {
        orderDirection: "Ascending",
        sinceDate: new Date().toISOString(),
        skip: 0,
        take: 100
      }
    }, { signal: new AbortController().signal });
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
  });
}); 