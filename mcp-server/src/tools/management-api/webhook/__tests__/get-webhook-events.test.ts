import GetWebhookEventsTool from "../get/get-webhook-events.js";
import { jest } from "@jest/globals";

describe("get-webhook-events", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should get list of webhook events", async () => {
    const result = await GetWebhookEventsTool().handler({}, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 