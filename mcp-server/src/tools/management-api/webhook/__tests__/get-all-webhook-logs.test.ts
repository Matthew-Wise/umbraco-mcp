import GetAllWebhookLogsTool from "../get/get-all-webhook-logs.js";
import { jest } from "@jest/globals";

describe("get-all-webhook-logs", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get logs for all webhooks", async () => {
    const result = await GetAllWebhookLogsTool().handler({
      take: 100
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });

  it("should handle pagination parameters", async () => {
    const result = await GetAllWebhookLogsTool().handler({
      skip: 0,
      take: 10
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 