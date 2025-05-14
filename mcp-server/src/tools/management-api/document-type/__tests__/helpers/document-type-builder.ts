import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateDocumentTypeRequestModel, CompositionTypeModel } from "@/umb-management-api/schemas/index.js";
import { postDocumentTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { DocumentTypeTestHelper } from "./document-type-test-helper.js";

export class DocumentTypeBuilder {
  private model: CreateDocumentTypeRequestModel = {
    alias: "",
    name: "",
    icon: "icon-document",
    allowedAsRoot: false,
    variesByCulture: false,
    variesBySegment: false,
    isElement: false,
    properties: [],
    containers: [],
    allowedTemplates: [],
    cleanup: {
      preventCleanup: false
    },
    allowedDocumentTypes: [],
    compositions: []
  };

  private createdItem: any = null;

  withName(name: string): DocumentTypeBuilder {
    this.model.name = name;
    this.model.alias = name.toLowerCase().replace(/\s+/g, "");
    return this;
  }

  withAlias(alias: string): DocumentTypeBuilder {
    this.model.alias = alias;
    return this;
  }

  withDescription(description: string): DocumentTypeBuilder {
    this.model.description = description;
    return this;
  }

  withIcon(icon: string): DocumentTypeBuilder {
    this.model.icon = icon;
    return this;
  }

  allowAsRoot(allow: boolean = true): DocumentTypeBuilder {
    this.model.allowedAsRoot = allow;
    return this;
  }

  variesByCulture(varies: boolean = true): DocumentTypeBuilder {
    this.model.variesByCulture = varies;
    return this;
  }

  variesBySegment(varies: boolean = true): DocumentTypeBuilder {
    this.model.variesBySegment = varies;
    return this;
  }

  asElement(isElement: boolean = true): DocumentTypeBuilder {
    this.model.isElement = isElement;
    return this;
  }

  withParent(parentId: string): DocumentTypeBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  withAllowedTemplate(templateId: string): DocumentTypeBuilder {
    this.model.allowedTemplates.push({ id: templateId });
    return this;
  }

  withDefaultTemplate(templateId: string): DocumentTypeBuilder {
    this.model.defaultTemplate = { id: templateId };
    return this;
  }

  withAllowedDocumentType(contentTypeId: string, sortOrder: number = 0): DocumentTypeBuilder {
    this.model.allowedDocumentTypes.push({
      documentType: { id: contentTypeId },
      sortOrder
    });
    return this;
  }

  withComposition(contentTypeId: string, compositionType: CompositionTypeModel = CompositionTypeModel.Composition): DocumentTypeBuilder {
    this.model.compositions.push({
      documentType: { id: contentTypeId },
      compositionType
    });
    return this;
  }

  build(): CreateDocumentTypeRequestModel {
    return this.model;
  }

  async create(): Promise<DocumentTypeBuilder> {
    if (!this.model.name || !this.model.alias) {
      throw new Error("Name and alias are required");
    }

    const client = UmbracoManagementClient.getClient();
    const validatedModel = postDocumentTypeBody.parse(this.model);
    
    // Create the document type
    await client.postDocumentType(validatedModel);
    
    // Find the created document type by name
    const name = this.model.name;
    const createdItem = await DocumentTypeTestHelper.findDocumentType(name);
    if (!createdItem) {
      throw new Error(`Failed to find created document type with name: ${name}`);
    }
    
    this.createdItem = createdItem;
    return this;
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No document type has been created yet");
    }
    return this.createdItem.id;
  }

  getCreatedItem(): any {
    if (!this.createdItem) {
      throw new Error("No document type has been created yet");
    }
    return this.createdItem;
  }

  async update(): Promise<DocumentTypeBuilder> {
    if (!this.createdItem || !this.createdItem.id) {
      throw new Error("No document type has been created yet to update");
    }
    const client = UmbracoManagementClient.getClient();
    // The update endpoint expects the model and the id
    await client.putDocumentTypeById(this.createdItem.id, this.model);
    // Refresh the createdItem
    const updatedItem = await DocumentTypeTestHelper.findDocumentType(this.model.name);
    if (!updatedItem) {
      throw new Error(`Failed to find updated document type with name: ${this.model.name}`);
    }
    this.createdItem = updatedItem;
    return this;
  }
} 