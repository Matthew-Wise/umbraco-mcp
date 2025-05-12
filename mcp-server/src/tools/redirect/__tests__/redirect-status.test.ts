import GetRedirectStatusTool from "../get/get-redirect-status.js";
import UpdateRedirectStatusTool from "../post/update-redirect-status.js";
import { getRedirectManagementStatusResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

type RedirectStatus = z.infer<typeof getRedirectManagementStatusResponse>;

describe("Redirect Status Tools", () => {
  describe("GetRedirectStatusTool", () => {
    it("should get the current redirect status", async () => {
      const result = await GetRedirectStatusTool().handler({}, { signal: new AbortController().signal });
      const data = JSON.parse(result.content[0].text as string) as RedirectStatus;
      expect(getRedirectManagementStatusResponse.safeParse(data).success).toBe(true);
      expect(data).toHaveProperty("status");
      expect(data).toHaveProperty("userIsAdmin");
    });
  });

  describe("UpdateRedirectStatusTool", () => {
    it("should disable redirect management", async () => {
      await UpdateRedirectStatusTool().handler(
        { status: "Disabled" },
        { signal: new AbortController().signal }
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      const status = await GetRedirectStatusTool().handler({}, { signal: new AbortController().signal });
      const data = JSON.parse(status.content[0].text as string) as RedirectStatus;
      expect(data.status).toBe("Disabled");
    });

    // Ensure redirect management is enabled after each test
    afterEach(async () => {
      await UpdateRedirectStatusTool().handler(
        { status: "Enabled" },
        { signal: new AbortController().signal }
      );
      await new Promise(resolve => setTimeout(resolve, 500));
    });
  });
}); 