import { MemberGroupBuilder } from "./member-group-builder.js";
import { jest } from "@jest/globals";

describe("MemberGroupBuilder", () => {
  let helper: MemberGroupBuilder;

  beforeEach(() => {
    helper = new MemberGroupBuilder();
  });

  afterEach(async () => {
    await helper.cleanup();
  });

  it("should create a member group with name", async () => {
    await helper
      .withName("Test Member Group")
      .create();

    expect(helper.getId()).toBeDefined();
    expect(await helper.verify()).toBe(true);
  });

  it("should throw error when trying to get ID before creation", () => {
    expect(() => helper.getId()).toThrow("No member group has been created yet");
  });

  it("should throw error when trying to verify before creation", async () => {
    await expect(helper.verify()).rejects.toThrow("No member group has been created yet");
  });
}); 