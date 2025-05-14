import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateMemberGroupRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMemberGroupBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class MemberGroupBuilder {
  private model: Partial<CreateMemberGroupRequestModel> = {};
  private id: string | null = null;

  withName(name: string): MemberGroupBuilder {
    this.model.name = name;
    return this;
  }

  async create(): Promise<MemberGroupBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postMemberGroupBody.parse(this.model);
    await client.postMemberGroup(validatedModel);
    // Get the created member group by name
    const response = await client.getMemberGroup({ skip: 0, take: 100 });
    const createdItem = response.items.find((item: { name: string }) => item.name === validatedModel.name);
    if (!createdItem) {
      throw new Error(`Failed to find created member group with name: ${validatedModel.name}`);
    }
    this.id = createdItem.id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No member group has been created yet");
    }
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getMemberGroupById(this.id);
      return true;
    } catch (error) {
      return false;
    }
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No member group has been created yet");
    }
    return this.id;
  }

  async cleanup(): Promise<void> {
    if (this.id) {
      try {
        const client = UmbracoManagementClient.getClient();
        await client.deleteMemberGroupById(this.id);
      } catch (error) {
        console.error("Error cleaning up member group:", error);
      }
    }
  }
} 