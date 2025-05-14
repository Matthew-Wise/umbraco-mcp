import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";

export class MemberTypeTestHelper {

  static async verifyMemberType(id: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getItemMemberType(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async findMemberTypes(name: string) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeMemberTypeRoot({ skip: 0, take: 100 });
    return response.items.filter((item: { name: string }) => item.name === name);
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const items = await this.findMemberTypes(name);
      for (const item of items) {
        await client.deleteMemberTypeById(item.id);
      }
    } catch (error) {
      console.error(`Error cleaning up member type ${name}:`, error);
    }
  }

  static normaliseIds(item: any) {
    if (!item) return item;
    const result = { ...item };
    if (result.id) {
      result.id = "00000000-0000-0000-0000-000000000000";
    }
    if (result.parent?.id) {
      result.parent.id = "00000000-0000-0000-0000-000000000000";
    }
    return result;
  }
} 