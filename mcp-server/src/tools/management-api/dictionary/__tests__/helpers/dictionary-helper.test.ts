import { DictionaryTestHelper, DEFAULT_ISO_CODE } from "./dictionary-helper.js";
import { DictionaryBuilder } from "./dictionary-builder.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../../constants.js";

const TEST_DICTIONARY_NAME = "_Test Dictionary Helper";
const TEST_DICTIONARY_TRANSLATION = "_Test Translation Helper";

describe('DictionaryTestHelper', () => {
  let originalConsoleError: typeof console.error;
  let builder: DictionaryBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new DictionaryBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await builder.cleanup();
  });

  describe('verifyDictionaryItem', () => {
    it('should verify an existing dictionary item', async () => {
      await builder
        .withName(TEST_DICTIONARY_NAME)
        .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
        .create();

      const exists = await DictionaryTestHelper.verifyDictionaryItem(builder.getId());
      expect(exists).toBe(true);
    });

    it('should return false for non-existent dictionary item', async () => {
      const exists = await DictionaryTestHelper.verifyDictionaryItem(BLANK_UUID);
      expect(exists).toBe(false);
    });
  });

  describe('getDictionaryItem', () => {
    it('should get dictionary item by id', async () => {
      await builder
        .withName(TEST_DICTIONARY_NAME)
        .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
        .create();

      const item = await DictionaryTestHelper.getDictionaryItem(builder.getId());
      expect(item).toBeDefined();
      expect(item.name).toBe(TEST_DICTIONARY_NAME);
      expect(item.translations).toHaveLength(1);
      expect(item.translations[0].isoCode).toBe(DEFAULT_ISO_CODE);
      expect(item.translations[0].translation).toBe(TEST_DICTIONARY_TRANSLATION);
    });

    it('should get dictionary item with blank UUID for snapshot', async () => {
      await builder
        .withName(TEST_DICTIONARY_NAME)
        .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
        .create();

      const item = await DictionaryTestHelper.getDictionaryItem(builder.getId(), true);
      expect(item.id).toBe(BLANK_UUID);
    });

    it('should throw for non-existent dictionary item', async () => {
      await expect(DictionaryTestHelper.getDictionaryItem(BLANK_UUID))
        .rejects.toThrow();
    });
  });

  describe('findDictionaryItems', () => {
    it('should find dictionary items by name', async () => {
      await builder
        .withName(TEST_DICTIONARY_NAME)
        .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
        .create();

      const items = await DictionaryTestHelper.findDictionaryItems(TEST_DICTIONARY_NAME);
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe(TEST_DICTIONARY_NAME);
    });

    it('should find dictionary items with blank UUID for snapshot', async () => {
      await builder
        .withName(TEST_DICTIONARY_NAME)
        .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
        .create();

      const items = await DictionaryTestHelper.findDictionaryItems(TEST_DICTIONARY_NAME, true);
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(BLANK_UUID);
    });

    it('should return empty array for non-existent dictionary items', async () => {
      const items = await DictionaryTestHelper.findDictionaryItems('Non Existent Dictionary');
      expect(items).toHaveLength(0);
    });

  });
}); 