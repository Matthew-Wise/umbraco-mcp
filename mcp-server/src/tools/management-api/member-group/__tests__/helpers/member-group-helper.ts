import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getMemberGroupByIdResponse, getMemberGroupResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class MemberGroupTestHelper {
  static async verifyMemberGroup(id: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getMemberGroupById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async findMemberGroups(name: string) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMemberGroup({ skip: 0, take: 100 });
    const result = getMemberGroupResponse.parse(response);
    return result.items.filter(item => item.name === name);
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const items = await this.findMemberGroups(name);
      for (const item of items) {
        await client.deleteMemberGroupById(item.id);
      }
    } catch (error) {
      console.error(`Error cleaning up member group ${name}:`, error);
    }
  }
} 