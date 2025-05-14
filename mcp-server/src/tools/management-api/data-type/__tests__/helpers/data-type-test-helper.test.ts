import { DataTypeBuilder } from "./data-type-builder.js";
import { DataTypeTestHelper } from "./data-type-test-helper.js";
import { DataTypeTreeItemResponseModel } from "@/umb-management-api/schemas/dataTypeTreeItemResponseModel.js";
import { BLANK_UUID } from "../../../constants.js";
import { jest } from "@jest/globals";

describe('DataTypeTestHelper', () => {
  const TEST_DATATYPE_CLEANUP_NAME = 'Test Integration DataType Cleanup';

  // Clean up any test data types that might be left over from previous test runs
  beforeAll(async () => {
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_CLEANUP_NAME);
  });

  // Clean up after all tests
  afterAll(async () => {
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_CLEANUP_NAME);
  });

  describe('cleanup and cleanupById', () => {
    it('should cleanup data type by name', async () => {
      // Create a data type using builder
      const builder = await new DataTypeBuilder()
        .withName(TEST_DATATYPE_CLEANUP_NAME)
        .withEditorAlias('Umbraco.TextBox')
        .withEditorUiAlias('textbox')
        .create();
      expect(builder).toBeDefined();

      // Clean it up
      await DataTypeTestHelper.cleanup(TEST_DATATYPE_CLEANUP_NAME);

      // Verify it's gone
      const found = await DataTypeTestHelper.findDataType(TEST_DATATYPE_CLEANUP_NAME);
      expect(found).toBeUndefined();
    });
  });

  describe('normaliseIds', () => {
    const mockDataType: DataTypeTreeItemResponseModel = {
      id: '123-456',
      name: 'Test DataType',
      editorUiAlias: 'textbox',
      hasChildren: false,
      isFolder: false,
      isDeletable: true
    };

    const mockFolder: DataTypeTreeItemResponseModel = {
      id: '789-012',
      name: 'Test Folder',
      editorUiAlias: null,
      hasChildren: true,
      isFolder: true,
      isDeletable: true
    };

    it('should normalise a single item by setting id to BLANK_UUID', () => {
      const result = DataTypeTestHelper.normaliseIds(mockDataType) as DataTypeTreeItemResponseModel;
      
      expect(result.id).toBe(BLANK_UUID);
      // Verify original wasn't mutated
      expect(mockDataType.id).toBe('123-456');
    });

    it('should normalise an array of items by setting all ids to BLANK_UUID', () => {
      const items = [mockDataType, mockFolder];
      const result = DataTypeTestHelper.normaliseIds(items) as DataTypeTreeItemResponseModel[];

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      result.forEach(item => {
        expect(item.id).toBe(BLANK_UUID);
      });
      // Verify originals weren't mutated
      expect(items[0].id).toBe('123-456');
      expect(items[1].id).toBe('789-012');
    });

    it('should preserve all other properties when normalising', () => {
      const result = DataTypeTestHelper.normaliseIds(mockDataType) as DataTypeTreeItemResponseModel;
      
      expect(result.id).toBe(BLANK_UUID);
      expect(result.name).toBe(mockDataType.name);
      expect(result.editorUiAlias).toBe(mockDataType.editorUiAlias);
      expect(result.hasChildren).toBe(mockDataType.hasChildren);
      expect(result.isFolder).toBe(mockDataType.isFolder);
      expect(result.isDeletable).toBe(mockDataType.isDeletable);
    });
  });
}); 