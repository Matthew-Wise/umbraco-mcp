import { DocumentTypeFolderBuilder } from "./document-type-folder-builder.js";
import { DocumentTypeTestHelper } from "./document-type-test-helper.js";
import { jest } from "@jest/globals";

describe('DocumentTypeFolderBuilder', () => {
  const TEST_FOLDER_NAME = '_Test Folder';
  const TEST_PARENT_NAME = '_Test Parent Folder';
  const TEST_CHILD_NAME = '_Test Child Folder';
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTypeTestHelper.cleanup(TEST_FOLDER_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_CHILD_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_PARENT_NAME);
  });

  describe('construction', () => {
    it('should create a builder with name', () => {
      const builder = new DocumentTypeFolderBuilder(TEST_FOLDER_NAME);
      const model = builder.build();

      expect(model.name).toBe(TEST_FOLDER_NAME);
    });
  });

  describe('builder methods', () => {
    let builder: DocumentTypeFolderBuilder;

    beforeEach(() => {
      builder = new DocumentTypeFolderBuilder(TEST_FOLDER_NAME);
    });

    it('should set parent', () => {
      const parentId = '123-456';
      builder.withParent(parentId);
      const model = builder.build();

      expect(model.parent).toEqual({ id: parentId });
    });

    it('should chain builder methods', () => {
      const parentId = '123-456';
      builder.withParent(parentId);
      const model = builder.build();

      expect(model).toEqual({
        name: TEST_FOLDER_NAME,
        parent: { id: parentId }
      });
    });
  });

  describe('creation and retrieval', () => {
    it('should create and retrieve a folder', async () => {
      const builder = await new DocumentTypeFolderBuilder(TEST_FOLDER_NAME)
        .create();

      expect(builder.getId()).toBeDefined();
      
      const item = builder.getItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_FOLDER_NAME);
      expect(item.isFolder).toBe(true);
    });

    it('should create folder with parent', async () => {
      // Create parent folder
      const parentBuilder = await new DocumentTypeFolderBuilder(TEST_PARENT_NAME)
        .create();

      // Create child folder
      const builder = await new DocumentTypeFolderBuilder(TEST_CHILD_NAME)
        .withParent(parentBuilder.getId())
        .create();

      const item = builder.getItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_CHILD_NAME);
      expect(item.parent?.id).toBe(parentBuilder.getId());
    });
  });

  describe('error handling', () => {
    it('should handle invalid parent ID', async () => {
      const builder = new DocumentTypeFolderBuilder(TEST_FOLDER_NAME)
        .withParent('invalid-id');

      await expect(builder.create()).rejects.toThrow();
    });

    it('should throw error when getting ID before creation', () => {
      const builder = new DocumentTypeFolderBuilder(TEST_FOLDER_NAME);

      expect(() => builder.getId()).toThrow('No document type folder has been created yet');
    });

    it('should throw error when getting item before creation', () => {
      const builder = new DocumentTypeFolderBuilder(TEST_FOLDER_NAME);

      expect(() => builder.getItem()).toThrow('No document type folder has been created yet');
    });
  });
}); 