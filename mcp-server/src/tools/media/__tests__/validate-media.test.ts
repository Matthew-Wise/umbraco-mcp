import ValidateMediaTool from "../post/validate-media.js";
import { MediaBuilder } from "./helpers/media-builder.js";
import { MediaTestHelper } from "./helpers/media-test-helper.js";
import { jest } from "@jest/globals";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";
import { normalizeErrorResponse } from "@/helpers/test-utils.js";
const TEST_MEDIA_NAME = "_Test ValidateMedia";

// Helper to build a valid validation model from a created media
async function buildValidationModel() {
  const tempFileBuilder = await new TemporaryFileBuilder()
    .withExampleFile()
    .create();

  const model = await new MediaBuilder()
    .withName(TEST_MEDIA_NAME)
    .withImageMediaType()
    .withImageValue(tempFileBuilder.getId())
    .build();

  // Build a minimal valid model for validation
  return {
    values: model.values,
    variants: [
      {
        name: TEST_MEDIA_NAME,
        culture: null,
        segment: null,
      },
    ],
    id: model.id,
    parent: model.parent ? { id: model.parent.id } : undefined,
    mediaType: model.mediaType,
  };
}

describe("validate-media", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MediaTestHelper.cleanup(TEST_MEDIA_NAME);
  });

  it("should validate a valid media", async () => {
    const model = await buildValidationModel();
    const result = await ValidateMediaTool().handler(model, {
      signal: new AbortController().signal,
    });
    expect(result).toMatchSnapshot();
  });

  it("should handle invalid media model", async () => {
    // Invalid model: required fields are present but invalid
    const invalidModel = {
      values: [],
      variants: [{ name: "", culture: null, segment: null }],
      mediaType: undefined,
    };
    const result = await ValidateMediaTool().handler(invalidModel as any, {
      signal: new AbortController().signal,
    });
    expect(normalizeErrorResponse(result)).toMatchSnapshot();
  });
}); 