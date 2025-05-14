import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { postMediaTypeFolderBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { MediaTypeFolderTestHelper } from "./media-type-folder-helper.js";

export class MediaTypeFolderBuilder {
  private model: {
    name: string;
    id?: string;
    parent?: {
      id: string;
    };
  } = {
    name: ""
  };
  private id: string | null = null;

  withName(name: string): MediaTypeFolderBuilder {
    this.model.name = name;
    return this;
  }

  withParent(parentId: string): MediaTypeFolderBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  async create(): Promise<MediaTypeFolderBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postMediaTypeFolderBody.parse(this.model);
    await client.postMediaTypeFolder(validatedModel);
    
    // Get the created folder by name using the helper
    const items = await MediaTypeFolderTestHelper.findFolders(validatedModel.name);
    if (items.length === 0) {
      throw new Error(`Failed to find created media type folder with name: ${validatedModel.name}`);
    }
    // Use the first matching item's ID
    this.id = items[0].id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No media type folder has been created yet");
    }
    return MediaTypeFolderTestHelper.verifyFolder(this.id);
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No media type folder has been created yet");
    }
    return this.id;
  }

  build() {
    return this.model;
  }

  async cleanup(): Promise<void> {
    if (this.model.name) {
      await MediaTypeFolderTestHelper.cleanup(this.model.name);
    }
  }
} 