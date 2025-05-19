import GetMemberConfigurationTool from "../get/get-member-configuration.js";
import { jest } from "@jest/globals";

describe("get-member-configuration", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get member configuration", async () => {
    const result = await GetMemberConfigurationTool().handler(
      {},
      { signal: new AbortController().signal }
    );

    expect(result.content).toHaveLength(1);
    const config = JSON.parse(result.content[0].text as string);
    expect(config).toBeDefined();
    expect(config).toMatchSnapshot();
  });
});
