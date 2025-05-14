import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateMemberTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMemberTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { MemberTypeTestHelper } from "./member-type-helper.js";

export class MemberTypeBuilder {
  private model: Partial<CreateMemberTypeRequestModel> = {
    allowedAsRoot: false,
    variesByCulture: false,
    variesBySegment: false,
    isElement: false,
    properties: [],
    containers: [],
    compositions: [],
    icon: "icon-user" // Default icon
  };
  private id: string | null = null;

  withName(name: string): MemberTypeBuilder {
    this.model.name = name;
    this.model.alias = name.toLowerCase().replace(/\s+/g, '');
    return this;
  }

  withDescription(description: string): MemberTypeBuilder {
    this.model.description = description;
    return this;
  }

  withIcon(icon: string): MemberTypeBuilder {
    this.model.icon = icon;
    return this;
  }

  withAllowedAsRoot(allowed: boolean): MemberTypeBuilder {
    this.model.allowedAsRoot = allowed;
    return this;
  }

  withIsElement(isElement: boolean): MemberTypeBuilder {
    this.model.isElement = isElement;
    return this;
  }

  withComposition(compositionId: string): MemberTypeBuilder {
    if (!this.model.compositions) {
      this.model.compositions = [];
    }
    this.model.compositions.push({
      memberType: { id: compositionId },
      compositionType: "Composition"
    });
    return this;
  }

  async create(): Promise<MemberTypeBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postMemberTypeBody.parse(this.model);
    await client.postMemberType(validatedModel);
    
    // Get the created member type by name using the helper
    const items = await MemberTypeTestHelper.findMemberTypes(validatedModel.name);
    if (items.length === 0) {
      throw new Error(`Failed to find created member type with name: ${validatedModel.name}`);
    }
    // Use the first matching item's ID
    this.id = items[0].id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No member type has been created yet");
    }
    return MemberTypeTestHelper.verifyMemberType(this.id);
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No member type has been created yet");
    }
    return this.id;
  }

  build(): CreateMemberTypeRequestModel {
    return this.model as CreateMemberTypeRequestModel;
  }

  async cleanup(): Promise<void> {
    if (this.model.name) {
      await MemberTypeTestHelper.cleanup(this.model.name);
    }
  }
} 