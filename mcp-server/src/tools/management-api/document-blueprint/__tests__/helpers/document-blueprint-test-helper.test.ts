import { DocumentBlueprintBuilder } from "./document-blueprint-builder.js";
import { DocumentBlueprintTestHelper } from "./document-blueprint-test-helper.js";
import { DocumentBlueprintTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";
import { BLANK_UUID } from "../../../constants.js";

describe('DocumentBlueprintVerificationHelper', () => {
  const TEST_BLUEPRINT_CLEANUP_NAME = 'Test Integration Blueprint Cleanup';

  // Clean up any test blueprints that might be left over from previous test runs
  beforeAll(async () => {
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_CLEANUP_NAME);
  });

  // Clean up after all tests
  afterAll(async () => {
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_CLEANUP_NAME);
  });

  describe('cleanup and cleanupById', () => {
    it('should cleanup blueprint by name', async () => {
      // Create a blueprint using builder
      const builder = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_CLEANUP_NAME)
        .create();
      expect(builder).toBeDefined();

      // Clean it up
      await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_CLEANUP_NAME);

      // Verify it's gone
      const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_BLUEPRINT_CLEANUP_NAME);
      expect(found).toBeUndefined();
    });

  });

  describe('normaliseIds', () => {
    const mockBlueprint: DocumentBlueprintTreeItemResponseModel = {
      id: '123-456',
      name: 'Test Blueprint',
      documentType: { id: '789-012', icon: 'icon-document' },
      isFolder: false,
      hasChildren: false
    };

    const mockFolder: DocumentBlueprintTreeItemResponseModel = {
      id: '789-012',
      name: 'Test Folder',
      documentType: { id: '789-012', icon: 'icon-folder' },
      isFolder: true,
      hasChildren: true
    };

    it('should normalise a single item by setting id to BLANK_UUID', () => {
      const result = DocumentBlueprintTestHelper.normaliseIds(mockBlueprint) as DocumentBlueprintTreeItemResponseModel;
      
      expect(result.id).toBe(BLANK_UUID);
      // Verify original wasn't mutated
      expect(mockBlueprint.id).toBe('123-456');
    });

    it('should normalise an array of items by setting all ids to BLANK_UUID', () => {
      const items = [mockBlueprint, mockFolder];
      const result = DocumentBlueprintTestHelper.normaliseIds(items) as DocumentBlueprintTreeItemResponseModel[];

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
      const result = DocumentBlueprintTestHelper.normaliseIds(mockBlueprint) as DocumentBlueprintTreeItemResponseModel;
      
      expect(result.id).toBe(BLANK_UUID);
      expect(result.name).toBe(mockBlueprint.name);
      expect(result.documentType).toEqual(mockBlueprint.documentType);
      expect(result.hasChildren).toBe(mockBlueprint.hasChildren);
      expect(result.isFolder).toBe(mockBlueprint.isFolder);
    });
  });
}); 