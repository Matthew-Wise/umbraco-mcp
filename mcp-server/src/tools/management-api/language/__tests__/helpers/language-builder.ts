import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateLanguageRequestModel } from "@/umb-management-api/schemas/index.js";
import { postLanguageBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class LanguageBuilder {
  private model: Partial<CreateLanguageRequestModel> = {};
  private isoCode: string | null = null;

  withName(name: string): LanguageBuilder {
    this.model.name = name;
    return this;
  }

  withIsoCode(isoCode: string): LanguageBuilder {
    this.model.isoCode = isoCode;
    return this;
  }

  withIsDefault(isDefault: boolean): LanguageBuilder {
    this.model.isDefault = isDefault;
    return this;
  }

  withIsMandatory(isMandatory: boolean): LanguageBuilder {
    this.model.isMandatory = isMandatory;
    return this;
  }

  withFallbackIsoCode(fallbackIsoCode: string | null): LanguageBuilder {
    this.model.fallbackIsoCode = fallbackIsoCode;
    return this;
  }

  async create(): Promise<LanguageBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postLanguageBody.parse(this.model);
    await client.postLanguage(validatedModel);
    this.isoCode = validatedModel.isoCode;
    return this;
  }

  getIsoCode(): string {
    if (!this.isoCode) {
      throw new Error("No language has been created yet");
    }
    return this.isoCode;
  }

  async cleanup(): Promise<void> {
    if (this.isoCode) {
      try {
        const client = UmbracoManagementClient.getClient();
        await client.deleteLanguageByIsoCode(this.isoCode);
      } catch (error) {
        console.error("Error cleaning up language:", error);
      }
    }
  }
} 