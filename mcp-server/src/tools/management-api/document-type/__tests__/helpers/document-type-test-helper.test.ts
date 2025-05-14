import { DocumentTypeTestHelper } from "./document-type-test-helper.js";
import { DocumentTypeBuilder } from "./document-type-builder.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../../constants.js";

describe('DocumentTypeTestHelper', () => {
  const TEST_DOCTYPE_NAME = '_Test Helper DocumentType';
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
  });

  describe('findByName', () => {
    it('should find item by name in array', () => {
      const items = [
        { name: 'Test1', id: '1', hasChildren: false, isFolder: false, isElement: false, icon: 'icon-test' },
        { name: TEST_DOCTYPE_NAME, id: '2', hasChildren: false, isFolder: false, isElement: false, icon: 'icon-test' },
        { name: 'Test3', id: '3', hasChildren: false, isFolder: false, isElement: false, icon: 'icon-test' }
      ];

      const result = DocumentTypeTestHelper.findByName(items, TEST_DOCTYPE_NAME);
      expect(result).toBeDefined();
      expect(result?.name).toBe(TEST_DOCTYPE_NAME);
      expect(result?.id).toBe('2');
    });

    it('should return undefined when item not found', () => {
      const items = [
        { name: 'Test1', id: '1', hasChildren: false, isFolder: false, isElement: false, icon: 'icon-test' },
        { name: 'Test2', id: '2', hasChildren: false, isFolder: false, isElement: false, icon: 'icon-test' }
      ];

      const result = DocumentTypeTestHelper.findByName(items, TEST_DOCTYPE_NAME);
      expect(result).toBeUndefined();
    });

    it('should handle empty array', () => {
      const result = DocumentTypeTestHelper.findByName([], TEST_DOCTYPE_NAME);
      expect(result).toBeUndefined();
    });
  });

  describe('normaliseIds', () => {
    it('should normalise single item', () => {
      const item = {
        name: TEST_DOCTYPE_NAME,
        id: '123-456',
        hasChildren: false,
        isFolder: false,
        isElement: false,
        icon: 'icon-test'
      };

      const result = DocumentTypeTestHelper.normaliseIds(item);
      expect(result).toEqual({
        ...item,
        id: BLANK_UUID
      });
    });

    it('should normalise array of items', () => {
      const items = [
        { name: 'Test1', id: '1', hasChildren: false, isFolder: false, isElement: false, icon: 'icon-test' },
        { name: 'Test2', id: '2', hasChildren: false, isFolder: false, isElement: false, icon: 'icon-test' }
      ];

      const result = DocumentTypeTestHelper.normaliseIds(items);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      (result as any[]).forEach(item => {
        expect(item.id).toBe(BLANK_UUID);
      });
    });
  });

  describe('cleanup', () => {
    it('should cleanup created document type', async () => {
      // Create a document type
      const builder = await new DocumentTypeBuilder()
        .withName(TEST_DOCTYPE_NAME)
        .create();

      const id = builder.getId();
      expect(id).toBeDefined();

      // Clean it up
      await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);

      // Verify it's gone
      const found = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_NAME);
      expect(found).toBeUndefined();
    });

    it('should handle non-existent document type', async () => {
      await expect(DocumentTypeTestHelper.cleanup('NonExistentDocType')).resolves.not.toThrow();
    });
  });

  describe('findDocumentType', () => {
    it('should find created document type', async () => {
      // Create a document type
      const builder = await new DocumentTypeBuilder()
        .withName(TEST_DOCTYPE_NAME)
        .create();

      // Find it
      const found = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_NAME);
      expect(found).toBeDefined();
      expect(found?.name).toBe(TEST_DOCTYPE_NAME);
      expect(found?.id).toBe(builder.getId());
    });

    it('should return undefined for non-existent document type', async () => {
      const found = await DocumentTypeTestHelper.findDocumentType('NonExistentDocType');
      expect(found).toBeUndefined();
    });
  });
}); 