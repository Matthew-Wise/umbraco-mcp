import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUserGroupRequestModel } from "@/umb-management-api/schemas/index.js";
import { postUserGroupBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class UserGroupBuilder {
  private model: Partial<CreateUserGroupRequestModel> = {
    alias: "",
    sections: ["content"],
    languages: [],
    hasAccessToAllLanguages: true,
    documentRootAccess: false,
    mediaRootAccess: false,
    fallbackPermissions: [],
    permissions: []
  };
  private id: string | null = null;

  withName(name: string): UserGroupBuilder {
    this.model.name = name;
    this.model.alias = name.toLowerCase().replace(/\s+/g, "-");
    return this;
  }

  withSections(sections: string[]): UserGroupBuilder {
    this.model.sections = sections;
    return this;
  }

  withLanguages(languages: string[]): UserGroupBuilder {
    this.model.languages = languages;
    this.model.hasAccessToAllLanguages = false;
    return this;
  }

  withDocumentRootAccess(hasAccess: boolean): UserGroupBuilder {
    this.model.documentRootAccess = hasAccess;
    return this;
  }

  withMediaRootAccess(hasAccess: boolean): UserGroupBuilder {
    this.model.mediaRootAccess = hasAccess;
    return this;
  }

  withDocumentPermission(documentId: string, verbs: string[]): UserGroupBuilder {
    this.model.permissions = [
      ...(this.model.permissions || []),
      {
        $type: "DocumentPermissionPresentationModel",
        document: { id: documentId },
        verbs
      }
    ];
    return this;
  }

  withUnknownTypePermission(context: string, verbs: string[]): UserGroupBuilder {
    this.model.permissions = [
      ...(this.model.permissions || []),
      {
        $type: "UnknownTypePermissionPresentationModel",
        context,
        verbs
      }
    ];
    return this;
  }

  withFallbackPermissions(permissions: string[]): UserGroupBuilder {
    this.model.fallbackPermissions = permissions;
    return this;
  }

  async create(): Promise<UserGroupBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postUserGroupBody.parse(this.model);
    await client.postUserGroup(validatedModel);
    // Get the created user group by name
    const response = await client.getUserGroup({ skip: 0, take: 100 });
    const createdItem = response.items.find((item: { name: string }) => item.name === validatedModel.name);
    if (!createdItem) {
      throw new Error(`Failed to find created user group with name: ${validatedModel.name}`);
    }
    this.id = createdItem.id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No user group has been created yet");
    }
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getUserGroupById(this.id);
      return true;
    } catch (error) {
      return false;
    }
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No user group has been created yet");
    }
    return this.id;
  }

  async cleanup(): Promise<void> {
    if (this.id) {
      try {
        const client = UmbracoManagementClient.getClient();
        await client.deleteUserGroupById(this.id);
      } catch (error) {
        console.error("Error cleaning up user group:", error);
      }
    }
  }
} 