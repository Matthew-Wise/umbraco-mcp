import { DataTypeBuilder } from "./data-type-builder.js";
import { DataTypeTestHelper } from "./data-type-test-helper.js";
import { jest } from "@jest/globals";

describe('DataTypeBuilder', () => {
  const TEST_DATATYPE_NAME = '_Test Builder DataType';
  const TEST_PARENT_NAME = '_Test Parent DataType';
  const TEST_VALUE_ALIAS = 'testAlias';
  const TEST_VALUE = 'testValue';
  let originalConsoleError: typeof console.error;
  
  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_NAME);
    await DataTypeTestHelper.cleanup(TEST_PARENT_NAME);
  });

  describe('construction', () => {
    it('should create a builder with default values', () => {
      const builder = new DataTypeBuilder();
      const model = builder.build();

      expect(model).toEqual({
        name: "",
        editorAlias: "",
        editorUiAlias: "",
        values: []
      });
    });
  });

  describe('builder methods', () => {
    let builder: DataTypeBuilder;

    beforeEach(() => {
      builder = new DataTypeBuilder();
    });

    it('should set name', () => {
      builder.withName(TEST_DATATYPE_NAME);
      const model = builder.build();

      expect(model.name).toBe(TEST_DATATYPE_NAME);
    });

    it('should set editor alias', () => {
      const editorAlias = 'Umbraco.TextBox';
      builder.withEditorAlias(editorAlias);
      const model = builder.build();

      expect(model.editorAlias).toBe(editorAlias);
    });

    it('should set editor UI alias', () => {
      const editorUiAlias = 'textbox';
      builder.withEditorUiAlias(editorUiAlias);
      const model = builder.build();

      expect(model.editorUiAlias).toBe(editorUiAlias);
    });

    it('should add value', () => {
      builder.withValue(TEST_VALUE_ALIAS, TEST_VALUE);
      const model = builder.build();

      expect(model.values).toContainEqual({
        alias: TEST_VALUE_ALIAS,
        value: TEST_VALUE
      });
    });

    it('should add parent', () => {
      const parentId = '123-456';
      builder.withParent(parentId);
      const model = builder.build();

      expect(model.parent).toEqual({ id: parentId });
    });

    it('should chain builder methods', () => {
      const editorAlias = 'Umbraco.TextBox';
      const editorUiAlias = 'textbox';
      const parentId = '123-456';
      
      builder
        .withName(TEST_DATATYPE_NAME)
        .withEditorAlias(editorAlias)
        .withEditorUiAlias(editorUiAlias)
        .withValue(TEST_VALUE_ALIAS, TEST_VALUE)
        .withParent(parentId);

      const model = builder.build();

      expect(model).toEqual({
        name: TEST_DATATYPE_NAME,
        editorAlias,
        editorUiAlias,
        values: [{
          alias: TEST_VALUE_ALIAS,
          value: TEST_VALUE
        }],
        parent: { id: parentId }
      });
    });
  });

  describe('creation and retrieval', () => {
    it('should create and retrieve a data type', async () => {
      const builder = await new DataTypeBuilder()
        .withName(TEST_DATATYPE_NAME)
        .withTextbox()
        .create();

      expect(builder.getId()).toBeDefined();
      
      const item = builder.getCreatedItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_DATATYPE_NAME);
      expect(item.isFolder).toBe(false);
    });

    it('should require name, editorAlias and editorUiAlias for creation', async () => {
      const builder = new DataTypeBuilder()
        .withName(TEST_DATATYPE_NAME);
      
      await expect(builder.create()).rejects.toThrow();
    });

  });

  describe('error handling', () => {
    it('should handle invalid parent ID', async () => {
      const builder = new DataTypeBuilder()
        .withName(TEST_DATATYPE_NAME)
        .withTextbox()
        .withParent('invalid-id');

      await expect(builder.create()).rejects.toThrow();
    });

    it('should throw error when getting created item before creation', () => {
      const builder = new DataTypeBuilder()
        .withName(TEST_DATATYPE_NAME);

      expect(() => builder.getCreatedItem()).toThrow('No data type has been created yet');
    });
  });
}); 