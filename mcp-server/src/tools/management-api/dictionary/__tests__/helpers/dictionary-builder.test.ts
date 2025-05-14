import { DictionaryBuilder } from "./dictionary-builder.js";
import { jest } from "@jest/globals";

describe("DictionaryBuilder", () => {
  let helper: DictionaryBuilder;
  let parentHelper: DictionaryBuilder;

  beforeEach(() => {
    helper = new DictionaryBuilder();
    parentHelper = new DictionaryBuilder();
  });

  afterEach(async () => {
    await helper.cleanup();
    await parentHelper.cleanup();
  });

  it("should create a dictionary item with name and translation", async () => {
    await helper
      .withName("Test Dictionary")
      .withTranslation("en-US", "Test Translation")
      .create();

    expect(helper.getId()).toBeDefined();
    expect(await helper.verify()).toBe(true);
  });

  it("should create a dictionary item with parent", async () => {
    // First create a parent dictionary item
    await parentHelper
      .withName("Parent Dictionary")
      .withTranslation("en-US", "Parent Translation")
      .create();

    const parentId = parentHelper.getId();

    // Then create a child dictionary item
    await helper
      .withName("Child Dictionary")
      .withTranslation("en-US", "Child Translation")
      .withParent(parentId)
      .create();

    expect(helper.getId()).toBeDefined();
    expect(await helper.verify()).toBe(true);
    expect(await parentHelper.verify()).toBe(true);
  });

  it("should create a dictionary item with multiple translations", async () => {
    await helper
      .withName("Multi Language Dictionary")
      .withTranslation("en-US", "English Translation")
      .withTranslation("fr-FR", "French Translation")
      .withTranslation("de-DE", "German Translation")
      .create();

    expect(helper.getId()).toBeDefined();
    expect(await helper.verify()).toBe(true);
  });

  it("should throw error when trying to get ID before creation", () => {
    expect(() => helper.getId()).toThrow("No dictionary item has been created yet");
  });

  it("should throw error when trying to verify before creation", async () => {
    await expect(helper.verify()).rejects.toThrow("No dictionary item has been created yet");
  });
}); 