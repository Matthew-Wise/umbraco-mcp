import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { DocumentBlueprintTreeItemResponseModel } from "@/umb-management-api/schemas/documentBlueprintTreeItemResponseModel.js";
import { postDocumentBlueprintBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { DocumentBlueprintTestHelper } from "./document-blueprint-test-helper.js";
import { CreateDocumentBlueprintRequestModel } from "@/umb-management-api/schemas/index.js";
import { ROOT_DOCUMENT_TYPE_ID } from "../../../constants.js";

export class DocumentBlueprintBuilder {
  private model: CreateDocumentBlueprintRequestModel = {
    values: [],
    variants: [],
    documentType: { id: '' }
  };

  private createdItem: DocumentBlueprintTreeItemResponseModel | null = null;

  constructor(name: string) {
    this.model = {
      values: [],
      variants: [
        {
          culture: null,
          segment: null,
          name: name
        }
      ],
      documentType: {
        id: ROOT_DOCUMENT_TYPE_ID
      }
    };
  }

  withId(id: string): DocumentBlueprintBuilder {
    this.model.id = id;
    return this;
  }

  withParent(parentId: string): DocumentBlueprintBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  withDocumentType(documentTypeId: string): DocumentBlueprintBuilder {
    this.model.documentType.id = documentTypeId;
    return this;
  }

  withValue(alias: string, value: any, culture: string | null = null, segment: string | null = null): DocumentBlueprintBuilder {
    this.model.values.push({
      culture,
      segment,
      alias,
      value
    });
    return this;
  }

  withVariant(name: string, culture: string | null = null, segment: string | null = null): DocumentBlueprintBuilder {
    this.model.variants.push({
      culture,
      segment,
      name
    });
    return this;
  }

  build(): any {
    return this.model;
  }

  async create(): Promise<DocumentBlueprintBuilder> {
    try {
      const client = UmbracoManagementClient.getClient();
      const validatedModel = postDocumentBlueprintBody.parse(this.model);
      
      // Create the blueprint
      await client.postDocumentBlueprint(validatedModel);
      
      // Find the created blueprint by name
      const name = this.model.variants[0].name;
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