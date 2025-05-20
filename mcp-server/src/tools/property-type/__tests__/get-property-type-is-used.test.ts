import { getPropertyTypeIsUsedQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import GetPropertyTypeIsUsedTool from "../get/get-property-type-is-used.js";
import {
  createSnapshotResult,
  normalizeErrorResponse,
} from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { PropertyTypeTestHelper } from "./helpers/property-type-test-helper.js";

describe("get-property-type-is-used", () => {
  let originalConsoleError: typeof console.error;
  let headerControlsId: string | null;
  const titlePropertyAlias = "title";

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();

    // Get the headerControls document type ID and title property alias
    headerControlsId = await PropertyTypeTestHelper.getHeaderControlsId();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should check if a property type is used with both parameters", async () => {
    const params = getPropertyTypeIsUsedQueryParams.parse({
      contentTypeId: headerControlsId!,
      propertyAlias: titlePropertyAlias,
    });
    const result = await GetPropertyTypeIsUsedTool().handler(params, {
      signal: new AbortController().signal,
    });
    expect(createSnapshotResult(result)).toMatchSnapshot();
  });

  it("should handle empty parameters", async () => {
    const params = getPropertyTypeIsUsedQueryParams.parse({});
    const result = await GetPropertyTypeIsUsedTool().handler(params, {
      signal: new AbortController().signal,
    });
    expect(normalizeErrorResponse(result)).toMatchSnapshot();
  });
});
