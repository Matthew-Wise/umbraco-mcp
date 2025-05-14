import { ROOT_DOCUMENT_TYPE_ID } from "../../../constants.js";
import { DocumentBlueprintBuilder } from "./document-blueprint-builder.js";
import { DocumentBlueprintFolderBuilder } from "./document-blueprint-folder-builder.js";
import { DocumentBlueprintTestHelper } from "./document-blueprint-test-helper.js";
import { jest } from "@jest/globals";

describe('DocumentBlueprintBuilder', () => {
  const TEST_BLUEPRINT_NAME = '_Test Builder Blueprint';
  const TEST_PARENT_NAME = '_Test Parent Blueprint';
  const TEST_VALUE_ALIAS = 'testAlias';
  const TEST_VALUE = 'testValue';
  const TEST_VARIANT_NAME = 'testVariant';
  let originalConsoleError: typeof console.error;
  
  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintTestHelper.cleanup(TEST_BLUEPRINT_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_PARENT_NAME);
  });

  describe('construction', () => {
    it('should create a builder with default values', () => {
      const builder = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME);
      const model = builder.build();

      expect(model).toEqual({
        values: [],
        variants: [{
          culture: null,
          segment: null,
          name: TEST_BLUEPRINT_NAME
        }],
        documentType: {
          id: ROOT_DOCUMENT_TYPE_ID
        }
      });
    });
  });

  describe('builder methods', () => {
    let builder: DocumentBlueprintBuilder;

    beforeEach(() => {
      builder = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME);
    });

    it('should add parent', () => {
      const parentId = '123-456';
      builder.withParent(parentId);
      const model = builder.build();

      expect(model.parent).toEqual({ id: parentId });
    });

    it('should set document type', () => {
      const documentTypeId = '789-012';
      builder.withDocumentType(documentTypeId);
      const model = builder.build();

      expect(model.documentType).toEqual({ id: documentTypeId });
    });

    it('should add value', () => {
      builder.withValue(TEST_VALUE_ALIAS, TEST_VALUE);
      const model = builder.build();

      expect(model.values).toContainEqual({
        culture: null,
        segment: null,
        alias: TEST_VALUE_ALIAS,
        value: TEST_VALUE
      });
    });

    it('should add value with culture and segment', () => {
      const culture = 'en-US';
      const segment = 'mobile';
      builder.withValue(TEST_VALUE_ALIAS, TEST_VALUE, culture, segment);
      const model = builder.build();

      expect(model.values).toContainEqual({
        culture,
        segment,
        alias: TEST_VALUE_ALIAS,
        value: TEST_VALUE
      });
    });

    it('should add variant', () => {
      builder.withVariant(TEST_VARIANT_NAME);
      const model = builder.build();

      expect(model.variants).toContainEqual({
        culture: null,
        segment: null,
        name: TEST_VARIANT_NAME
      });
    });

    it('should add variant with culture and segment', () => {
      const culture = 'en-US';
      const segment = 'mobile';
      builder.withVariant(TEST_VARIANT_NAME, culture, segment);
      const model = builder.build();

      expect(model.variants).toContainEqual({
        culture,
        segment,
        name: TEST_VARIANT_NAME
      });
    });

    it('should chain builder methods', () => {
      const parentId = '123-456';
      const documentTypeId = '789-012';
      
      builder
        .withParent(parentId)
        .withDocumentType(documentTypeId)
        .withValue(TEST_VALUE_ALIAS, TEST_VALUE)
        .withVariant(TEST_VARIANT_NAME);

      const model = builder.build();

      expect(model).toEqual({
        values: [{
          culture: null,
          segment: null,
          alias: TEST_VALUE_ALIAS,
          value: TEST_VALUE
        }],
        variants: [
          {
            culture: null,
            segment: null,
            name: TEST_BLUEPRINT_NAME
          },
          {
            culture: null,
            segment: null,
            name: TEST_VARIANT_NAME
          }
        ],
        parent: { id: parentId },
        documentType: { id: documentTypeId }
      });
    });
  });

  describe('creation and retrieval', () => {
    it('should create and retrieve a blueprint', async () => {
      const builder = await new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
        .create();

      expect(builder.getId()).toBeDefined();
      
      const item = builder.getItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_BLUEPRINT_NAME);
      expect(item.isFolder).toBe(false);
    });

    it('should create a blueprint with parent', async () => {
      // Create parent first
      const parentBuilder = await new DocumentBlueprintFolderBuilder(TEST_PARENT_NAME)
        .create();
      expect(parentBuilder).toBeDefined();

      // Create child using builder
      const builder = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
        .withParent(parentBuilder.getId());
      
      const created = await builder.create();

      const item = created.getItem();
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_BLUEPRINT_NAME);
      expect(item.parent).toBeDefined();
      expect(item.parent!.id).toBe(parentBuilder.getId());
    });

    it('should handle creation failure', async () => {
      // Create blueprint with same name twice
      const builder1 = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME);
      await builder1.create();

      const builder2 = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME);
      await expect(builder2.create()).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle invalid parent ID', async () => {
      const builder = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
        .withParent('invalid-id');

      await expect(builder.create()).rejects.toThrow();
    });

    it('should handle invalid document type ID', async () => {
      const builder = new DocumentBlueprintBuilder(TEST_BLUEPRINT_NAME)
        .withDocumentType('invalid-id');

      await expect(builder.create()).rejects.toThrow();
    });
  });
});