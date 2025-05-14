import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getUserGroupResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class UserGroupTestHelper {
  static async verifyUserGroup(id: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getUserGroupById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async findUserGroups(name: string) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getUserGroup({ skip: 0, take: 100 });
    const result = getUserGroupResponse.parse(response);
    return result.items.filter(item => item.name === name);
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const items = await this.findUserGroups(name);
      for (const item of items) {
        await client.deleteUserGroupById(item.id);
      }
    } catch (error) {
      console.error(`Error cleaning up user group ${name}:`, error);
    }
  }
} 