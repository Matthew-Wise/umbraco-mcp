import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { DocumentBlueprintTestHelper } from "./document-blueprint-test-helper.js";
import { DocumentBlueprintTreeItemResponseModel } from "@/umb-management-api/schemas/documentBlueprintTreeItemResponseModel.js";
import { CreateFolderRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDocumentBlueprintFolderBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class DocumentBlueprintFolderBuilder {

  private model: Partial<CreateFolderRequestModel> = {};

  private createdItem: DocumentBlueprintTreeItemResponseModel | null = null;

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
        const validatedModel = postDocumentBlueprintFolderBody.parse(this.model);

        await client.postDocumentBlueprintFolder(validatedModel);

        // Find the created blueprint by name
        const name = this.name;
        const createdItem = await DocumentBlueprintTestHelper.findDocumentBlueprint(name);
        
        if (!createdItem) {
            throw new Error(`Failed to find created document blueprint with name: ${name}`);
        }
        
        this.createdItem = createdItem;
        return this;
    } catch (error) {
      console.error("Error creating document blueprint:", error);
      throw error;
    }
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No document blueprint has been created yet");
    }
    return this.createdItem.id;
  }

  getItem(): DocumentBlueprintTreeItemResponseModel {
    if (!this.createdItem) {
      throw new Error("No document blueprint has been created yet");
    }
    return this.createdItem;
  }
} 