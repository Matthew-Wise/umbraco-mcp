import { UserGroupBuilder } from "./user-group-builder.js";
import { jest } from "@jest/globals";

describe("UserGroupBuilder", () => {
  let helper: UserGroupBuilder;

  beforeEach(() => {
    helper = new UserGroupBuilder();
  });

  afterEach(async () => {
    await helper.cleanup();
  });

  it("should create a user group with name", async () => {
    await helper
      .withName("Test User Group")
      .create();

    expect(helper.getId()).toBeDefined();
    expect(await helper.verify()).toBe(true);
  });

  it("should throw error when trying to get ID before creation", () => {
    expect(() => helper.getId()).toThrow("No user group has been created yet");
  });

  it("should throw error when trying to verify before creation", async () => {
    await expect(helper.verify()).rejects.toThrow("No user group has been created yet");
  });
}); 