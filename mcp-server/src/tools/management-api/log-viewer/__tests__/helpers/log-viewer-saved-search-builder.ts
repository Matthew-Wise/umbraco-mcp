import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { SavedLogSearchRequestModel } from "@/umb-management-api/schemas/index.js";
import { postLogViewerSavedSearchBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class LogViewerSavedSearchBuilder {
  private model: SavedLogSearchRequestModel = {
    name: "",
    query: "",
  };

  private createdItem: any = null;

  withName(name: string): LogViewerSavedSearchBuilder {
    this.model.name = name;
    return this;
  }

  withQuery(query: string): LogViewerSavedSearchBuilder {
    this.model.query = query;
    return this;
  }

  build(): SavedLogSearchRequestModel {
    return this.model;
  }

  async create(): Promise<LogViewerSavedSearchBuilder> {
    if (!this.model.name || !this.model.query) {
      throw new Error("Name and query are required");
    }

    const client = UmbracoManagementClient.getClient();
    const validatedModel = postLogViewerSavedSearchBody.parse(this.model);

    // Create the saved search
    await client.postLogViewerSavedSearch(validatedModel);

    // Find the created saved search by name
    const name = this.model.name;
    const createdItem = await this.findSavedSearch(name);
    if (!createdItem) {
      throw new Error(`Failed to find created saved search with name: ${name}`);
    }

    this.createdItem = createdItem;
    return this;
  }

  private async findSavedSearch(name: string): Promise<any> {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getLogViewerSavedSearch({ take: 100 });
    return response.items.find((item: any) => item.name === name);
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No saved search has been created yet");
    }
    return this.createdItem.name;
  }

  getCreatedItem(): any {
    if (!this.createdItem) {
      throw new Error("No saved search has been created yet");
    }
    return this.createdItem;
  }

  async delete(): Promise<void> {
    if (!this.createdItem || !this.createdItem.name) {
      throw new Error("No saved search has been created yet to delete");
    }
    const client = UmbracoManagementClient.getClient();
    await client.deleteLogViewerSavedSearchByName(this.createdItem.name);
  }
}
