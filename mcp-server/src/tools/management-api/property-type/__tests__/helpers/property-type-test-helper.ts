import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { DocumentTypeResponseModel } from "@/umb-management-api/schemas/index.js";

export class PropertyTypeTestHelper {
  private static readonly HEADER_CONTROLS_QUERY = "header Controls";

  private static headerControlsId: string | null = null;

  private static async getHeaderControlsData(): Promise<DocumentTypeResponseModel | null> {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemDocumentTypeSearch({
        query: this.HEADER_CONTROLS_QUERY,
      });

      if (!response) {
        console.warn(
          "No document type found matching query:",
          this.HEADER_CONTROLS_QUERY
        );
        return null;
      }

      this.headerControlsId = response.items[0].id;

      return response;
    } catch (error) {
      console.error("Error finding headerControls document type:", error);
      return null;
    }
  }

  static async getHeaderControlsId(): Promise<string | null> {
    if (this.headerControlsId === null) {
      await this.getHeaderControlsData();
    }
    return this.headerControlsId;
  }
}
