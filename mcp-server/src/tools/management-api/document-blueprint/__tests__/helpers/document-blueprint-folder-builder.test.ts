import { DocumentBlueprintFolderBuilder } from "./document-blueprint-folder-builder.js";
import { DocumentBlueprintTestHelper } from "./document-blueprint-test-helper.js";
import { jest } from "@jest/globals";

describe('DocumentBlueprintFolderBuilder', () => {
  const TEST_FOLDER_NAME = '_Test Builder Folder';
  const TEST_PARENT_FOLDER_NAME = '_Test Parent Folder';
  let originalConsoleError: typeof console.error;
  
  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintTestHelper.cleanup(TEST_FOLDER_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_PARENT_FOLDER_NAME);
  });

  describe('construction', () => {
    it('should create a builder with default values', () => {
      const builder = new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME);
      const model = builder.build();

      expect(model).toEqual({
        name: TEST_FOLDER_NAME
      });
    });
  });

  describe('builder methods', () => {
    let builder: DocumentBlueprintFolderBuilder;

    beforeEach(() => {
      builder = new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME);
    });

    it('should add parent', () => {
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
      const builder = new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME);
      const created = await builder.create();

      expect(created).toBeDefined();
      
      const item = created.getItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_FOLDER_NAME);
      expect(item.isFolder).toBe(true);
      expect(created.getId()).toBeDefined();
    });

    it('should create a folder with parent', async () => {
      // Create parent first
      const parentBuilder = await new DocumentBlueprintFolderBuilder(TEST_PARENT_FOLDER_NAME)
        .create();
      expect(parentBuilder).toBeDefined();

      // Create child folder using builder
      const builder = new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME)
        .withParent(parentBuilder.getId());
      
      const created = await builder.create();

      const item = created.getItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_FOLDER_NAME);
      expect(item.parent).toBeDefined();
      expect(item.parent!.id).toBe(parentBuilder.getId());
    });


    it('should handle creation failure', async () => {
      // Create folder with same name twice
      const builder1 = new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME);
      await builder1.create();

      const builder2 = new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME);
      await expect(builder2.create()).rejects.toThrow();
    });

    it('should verify created folder exists', async () => {
      const builder = await new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME)
        .create();

      // Verify the folder exists using the test helper
      const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_FOLDER_NAME);

      expect(found).toBeDefined();
      expect(found!.id).toBe(builder.getId());
      expect(found!.isFolder).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle invalid parent ID', async () => {
      const builder = new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME)
        .withParent('invalid-id');

      await expect(builder.create()).rejects.toThrow();
    });

    it('should handle creation with missing name', async () => {
      // @ts-expect-error - Testing invalid construction
      const builder = new DocumentBlueprintFolderBuilder();
      await expect(builder.create()).rejects.toThrow();
    });

    it('should handle creation with empty name', async () => {
      const builder = new DocumentBlueprintFolderBuilder('');
      await expect(builder.create()).rejects.toThrow();
    });
  });

});
