import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import {
  getLogViewerLogResponse,
  getLogViewerSavedSearchResponse,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

type LogViewerLog = z.infer<typeof getLogViewerLogResponse>;
type LogViewerSavedSearch = z.infer<typeof getLogViewerSavedSearchResponse>;

export class LogViewerTestHelper {
  static async findSavedSearch(name: string): Promise<any> {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getLogViewerSavedSearch({ take: 100 });
    return response.items.find((item: any) => item.name === name);
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteLogViewerSavedSearchByName(name);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  static verifyLogResponse(log: LogViewerLog) {
    expect(log).toBeDefined();
    expect(log.total).toBeGreaterThan(0);
    expect(log.items).toBeArray();
    if (log.items.length > 0) {
      expect(log.items[0]).toEqual(
        expect.objectContaining({
          timestamp: expect.any(String),
          level: expect.stringMatching(
            /^(Verbose|Debug|Information|Warning|Error|Fatal)$/
          ),
          messageTemplate: expect.any(String),
          renderedMessage: expect.any(String),
          properties: expect.any(Array),
          exception: expect.toBeOneOf([expect.any(Object), null]),
        })
      );
    }
  }

  static verifyMessageTemplateResponse(response: any) {
    // Verify the response structure
    expect(response).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        items: expect.any(Array),
      })
    );

    // If there are items, verify their structure
    if (response.items.length > 0) {
      expect(response.items[0]).toEqual(
        expect.objectContaining({
          messageTemplate: expect.any(String),
          count: expect.any(Number),
        })
      );
    }
  }

  static verifySavedSearchResponse(response: LogViewerSavedSearch) {
    expect(response).toBeDefined();
    expect(response.total).toBeGreaterThanOrEqual(0);
    expect(response.items).toBeArray();
    if (response.items.length > 0) {
      expect(response.items[0]).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          query: expect.any(String),
        })
      );
    }
  }
}
