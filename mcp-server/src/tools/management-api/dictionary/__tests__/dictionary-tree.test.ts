import GetDictionaryRootTool from "../items/get/get-root.js";
import GetDictionaryChildrenTool from "../items/get/get-children.js";
import GetDictionaryAncestorsTool from "../items/get/get-ancestors.js";
import { DictionaryBuilder } from "./helpers/dictionary-builder.js";
import { DEFAULT_ISO_CODE } from "./helpers/dictionary-helper.js";
import { createSnapshotResult } from "../../../helpers/test-utils.js";
import { jest } from "@jest/globals";

const ROOT_DICTIONARY_NAME = "_Root Dictionary";
const ROOT_DICTIONARY_TRANSLATION = "_Root Translation";
const CHILD_DICTIONARY_NAME = "_Child Dictionary";
const CHILD_DICTIONARY_TRANSLATION = "_Child Translation";
const GRANDCHILD_DICTIONARY_NAME = "_Grandchild Dictionary";
const GRANDCHILD_DICTIONARY_TRANSLATION = "_Grandchild Translation";

describe("dictionary-tree", () => {
  let originalConsoleError: typeof console.error;
  let rootHelper: DictionaryBuilder;
  let childHelper: DictionaryBuilder;
  let grandchildHelper: DictionaryBuilder;

  beforeAll(async () => {
    // Create the dictionary tree structure
    rootHelper = new DictionaryBuilder();
    childHelper = new DictionaryBuilder();
    grandchildHelper = new DictionaryBuilder();

    // Create root dictionary
    await rootHelper
      .withName(ROOT_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, ROOT_DICTIONARY_TRANSLATION)
      .create();

    // Create child dictionary under root
    await childHelper
      .withName(CHILD_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, CHILD_DICTIONARY_TRANSLATION)
      .withParent(rootHelper.getId())
      .create();

    // Create grandchild dictionary under child
    await grandchildHelper
      .withName(GRANDCHILD_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, GRANDCHILD_DICTIONARY_TRANSLATION)
      .withParent(childHelper.getId())
      .create();
  });

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  afterAll(async () => {
    // Clean up all test dictionary items
    await grandchildHelper.cleanup();
    await childHelper.cleanup();
    await rootHelper.cleanup();
  });

  describe("get-root", () => {
    it("should get root level dictionary items", async () => {
      const result = await GetDictionaryRootTool().handler({
        take: 100
      }, { signal: new AbortController().signal });
      expect(createSnapshotResult(result)).toMatchSnapshot();
    });
  });

  describe("get-children", () => {
    it("should get children of root dictionary", async () => {
      const result = await GetDictionaryChildrenTool().handler({
        parentId: rootHelper.getId(),
        take: 100
      }, { signal: new AbortController().signal });
      expect(createSnapshotResult(result)).toMatchSnapshot();
    });

    it("should get children of child dictionary", async () => {
      const result = await GetDictionaryChildrenTool().handler({
        parentId: childHelper.getId(),
        take: 100
      }, { signal: new AbortController().signal });
      expect(createSnapshotResult(result)).toMatchSnapshot();
    });

    it("should get empty children for leaf dictionary", async () => {
      const result = await GetDictionaryChildrenTool().handler({
        parentId: grandchildHelper.getId(),
        take: 100
      }, { signal: new AbortController().signal });
      expect(createSnapshotResult(result)).toMatchSnapshot();
    });
  });

  describe("get-ancestors", () => {
    it("should get ancestors of grandchild dictionary", async () => {
      const result = await GetDictionaryAncestorsTool().handler({
        descendantId: grandchildHelper.getId()
      }, { signal: new AbortController().signal });
      expect(createSnapshotResult(result)).toMatchSnapshot();
    });

    it("should get ancestors of child dictionary", async () => {
      const result = await GetDictionaryAncestorsTool().handler({
        descendantId: childHelper.getId()
      }, { signal: new AbortController().signal });
      expect(createSnapshotResult(result)).toMatchSnapshot();
    });

    it("should get empty ancestors for root dictionary", async () => {
      const result = await GetDictionaryAncestorsTool().handler({
        descendantId: rootHelper.getId()
      }, { signal: new AbortController().signal });
      expect(createSnapshotResult(result)).toMatchSnapshot();
    });
  });
}); 