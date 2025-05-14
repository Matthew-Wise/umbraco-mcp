import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateDataTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDataTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { DataTypePropertyPresentationModel } from "@/umb-management-api/schemas/dataTypePropertyPresentationModel.js";
import { DataTypeTestHelper } from "./data-type-test-helper.js";

export class DataTypeBuilder {
  private model: CreateDataTypeRequestModel = {
    name: "",
    editorAlias: "",
    editorUiAlias: "",
    values: []
  };

  private createdItem: any = null;

  withName(name: string): DataTypeBuilder {
    this.model.name = name;
    return this;
  }

  withTextbox(): DataTypeBuilder {
    this.withEditorAlias("Umbraco.TextBox")
    this.withEditorUiAlias("Umb.PropertyEditorUi.Textbox");
    return this;
  }

  withEditorAlias(editorAlias: string): DataTypeBuilder {
    this.model.editorAlias = editorAlias;
    return this;
  }

  withEditorUiAlias(editorUiAlias: string): DataTypeBuilder {
    this.model.editorUiAlias = editorUiAlias;
    return this;
  }

  withValue(alias: string, value: unknown): DataTypeBuilder {
    const propertyValue: DataTypePropertyPresentationModel = {
      alias,
      value
    };
    this.model.values = [...(this.model.values || []), propertyValue];
    return this;
  }

  withParent(parentId: string): DataTypeBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  build(): CreateDataTypeRequestModel {
    return this.model;
  }

  async create(): Promise<DataTypeBuilder> {
    if (!this.model.name || !this.model.editorAlias || !this.model.editorUiAlias) {
      throw new Error("Name, editorAlias and editorUiAlias are required");
    }

    const client = UmbracoManagementClient.getClient();
    const validatedModel = postDataTypeBody.parse(this.model);
    
    // Create the data type
    await client.postDataType(validatedModel);
    
    // Find the created data type by name
    const name = this.model.name;
    const createdItem = await DataTypeTestHelper.findDataType(name);
    if (!createdItem) {
      throw new Error(`Failed to find created data type with name: ${name}`);
    }
    
    this.createdItem = createdItem;
    return this;
  }

  getId(): string {
    return this.createdItem.id;
  }

  getCreatedItem(): any {
    if (!this.createdItem) {
      throw new Error("No data type has been created yet");
    }
    return this.createdItem;
  }
} 