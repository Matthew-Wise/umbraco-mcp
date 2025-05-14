import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { DocumentTypeTestHelper } from "./document-type-test-helper.js";
import { DocumentTypeTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";
import { CreateFolderRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDocumentTypeFolderBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class DocumentTypeFolderBuilder {
  private model: Partial<CreateFolderRequestModel> = {};
  private createdItem: DocumentTypeTreeItemResponseModel | null = null;

  constructor(private name: string) {
    this.model.name = name;
  }

  withParent(parentId: string): this {
    this.model.parent = { id: parentId };
    return this;
  }

  build(): Partial<CreateFolderRequestModel> {
    return this.model;
  }

  async create() {
    try {
      const client = UmbracoManagementClient.getClient();
      const validatedModel = postDocumentTypeFolderBody.parse(this.model);

      await client.postDocumentTypeFolder(validatedModel);

      // Find the created folder by name
      const name = this.name;
      const createdItem = await DocumentTypeTestHelper.findDocumentType(name);
      
      if (!createdItem) {
        throw new Error(`Failed to find created document type folder with name: ${name}`);
      }
      
      this.createdItem = createdItem;
      return this;
    } catch (error) {
      console.error("Error creating document type folder:", error);
      throw error;
    }
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No document type folder has been created yet");
    }
    return this.createdItem.id;
  }

  getItem(): DocumentTypeTreeItemResponseModel {
    if (!this.createdItem) {
      throw new Error("No document type folder has been created yet");
    }
    return this.createdItem;
  }
} 