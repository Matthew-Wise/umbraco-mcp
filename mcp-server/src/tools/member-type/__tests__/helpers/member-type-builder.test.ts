import { MemberTypeBuilder } from "./member-type-builder.js";
import { jest } from "@jest/globals";

describe("MemberTypeBuilder", () => {
  let builder: MemberTypeBuilder;

  beforeEach(() => {
    builder = new MemberTypeBuilder();
  });

  afterEach(async () => {
    await builder.cleanup();
  });

  it("should create a member type with name", async () => {
    await builder
      .withName("Test Member Type")
      .create();

    expect(builder.getId()).toBeDefined();
    expect(await builder.verify()).toBe(true);
  });

  it("should throw error when trying to get ID before creation", () => {
    expect(() => builder.getId()).toThrow("No member type has been created yet");
  });

  it("should throw error when trying to verify before creation", async () => {
    await expect(builder.verify()).rejects.toThrow("No member type has been created yet");
  });

  it("should create a member type with all properties", async () => {
    await builder
      .withName("Test Member Type Full")
      .withDescription("A test member type with all properties")
      .withIcon("icon-user")
      .withAllowedAsRoot(true)
      .withIsElement(true)
      .create();

    expect(builder.getId()).toBeDefined();
    expect(await builder.verify()).toBe(true);
  });
}); 