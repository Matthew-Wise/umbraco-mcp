import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateMemberRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMemberBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { MemberTestHelper } from "./member-test-helper.js";

export class MemberBuilder {
  private model: Partial<CreateMemberRequestModel> = {
    values: [],
    variants: [],
    isApproved: true,
  };
  private createdItem: any = null;

  withName(name: string): MemberBuilder {
    this.model.variants = [
      {
        culture: null,
        segment: null,
        name: name,
      },
    ];
    return this;
  }

  withEmail(email: string): MemberBuilder {
    this.model.email = email;
    return this;
  }

  withUsername(email: string): MemberBuilder {
    this.model.username = email;
    return this;
  }

  withPassword(password: string): MemberBuilder {
    this.model.password = password;
    return this;
  }

  withMemberType(memberTypeId: string): MemberBuilder {
    this.model.memberType = { id: memberTypeId };
    return this;
  }

  withGroups(groupIds: string[]): MemberBuilder {
    this.model.groups = groupIds;
    return this;
  }

  withValue(
    alias: string,
    value: any,
    culture: string | null = null,
    segment: string | null = null
  ): MemberBuilder {
    if (!this.model.values) this.model.values = [];
    this.model.values.push({ alias, value, culture, segment });
    return this;
  }


  build(): CreateMemberRequestModel {
    return this.model as CreateMemberRequestModel;
  }

  async create(): Promise<MemberBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postMemberBody.parse(this.model);
    await client.postMember(validatedModel);

    // Find the created member by username
    const username = this.model.username;
    if (!username) {
      throw new Error("Member must have a username");
    }

    this.createdItem = await MemberTestHelper.findMember(username);

    if (!this.createdItem) {
      throw new Error(
        `Failed to find created member with username: ${username}`
      );
    }
    return this;
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No member has been created yet");
    }
    return this.createdItem.id;
  }

  getCreatedItem(): any {
    if (!this.createdItem) {
      throw new Error("No member has been created yet");
    }
    return this.createdItem;
  }
}
