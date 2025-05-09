import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";

export class MemberTestHelper {
  static async findMember(username: string): Promise<any> {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getFilterMember({ filter: username });
    return response.items.find((item: any) => item.username === username);
  }

  static async cleanup(username: string): Promise<void> {
    try {
      const member = await this.findMember(username);
      if (member) {
        const client = UmbracoManagementClient.getClient();
        await client.deleteMemberById(member.id);
      }
    } catch (error) {
      // Ignore errors during cleanup
      console.error("Error during member cleanup:", error);
    }
  }
}
