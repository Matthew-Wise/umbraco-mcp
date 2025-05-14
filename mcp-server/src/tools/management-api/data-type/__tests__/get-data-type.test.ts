import { DataTypeBuilder } from "./helpers/data-type-builder.js";
import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import GetDataTypeTool from "../get/get-data-type.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
describe("get-data-type", () => {
  const TEST_DATATYPE_NAME = "_Test Get DataType";
  let dataTypeId: string;
  let originalConsoleError: typeof console.error;

  beforeAll(async () => {
    // Create a test data type to get
    const builder = await new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME)
      .withEditorAlias("Umbraco.TextBox")
      .withEditorUiAlias("textbox")
      .create();
    
    dataTypeId = builder.getId();
  });

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  afterAll(async () => {
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_NAME);
  });

  it("should get a data type by ID", async () => {
    const result = await GetDataTypeTool().handler({
      id: dataTypeId
    }, { signal: new AbortController().signal });

    expect(result.content).toHaveLength(1);
    const content = JSON.parse(result.content[0].text as string);
    const normalizedContent = DataTypeTestHelper.normaliseIds(content);
    
    expect(normalizedContent).toMatchSnapshot();
  });

  it("should handle non-existent data type", async () => {
    const result = await GetDataTypeTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    expect(result.content[0].text as string).toContain("Error");
  });

  it("should handle invalid ID format", async () => {
    const result = await GetDataTypeTool().handler({
      id: "invalid-id-format"
    }, { signal: new AbortController().signal });

    expect(result.content[0].text as string).toContain("Error");
  });
}); 