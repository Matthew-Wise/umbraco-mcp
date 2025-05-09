import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateMediaTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMediaTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { MediaTypeTestHelper } from "./media-type-helper.js";

export class MediaTypeBuilder {
  private model: Partial<CreateMediaTypeRequestModel> = {
    allowedAsRoot: false,
    variesByCulture: false,
    variesBySegment: false,
    isElement: false,
    properties: [],
    containers: [],
    allowedMediaTypes: [],
    compositions: [],
    icon: "icon-folder" // Default icon
  };
  private id: string | null = null;

  withName(name: string): MediaTypeBuilder {
    this.model.name = name;
    this.model.alias = name.toLowerCase().replace(/\s+/g, '');
    return this;
  }

  withDescription(description: string): MediaTypeBuilder {
    this.model.description = description;
    return this;
  }

  withIcon(icon: string): MediaTypeBuilder {
    this.model.icon = icon;
    return this;
  }

  withParent(parentId: string): MediaTypeBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  withAllowedAsRoot(allowed: boolean): MediaTypeBuilder {
    this.model.allowedAsRoot = allowed;
    return this;
  }

  withVariesByCulture(varies: boolean): MediaTypeBuilder {
    this.model.variesByCulture = varies;
    return this;
  }

  withVariesBySegment(varies: boolean): MediaTypeBuilder {
    this.model.variesBySegment = varies;
    return this;
  }

  withIsElement(isElement: boolean): MediaTypeBuilder {
    this.model.isElement = isElement;
    return this;
  }

  withAllowedMediaType(mediaTypeId: string): MediaTypeBuilder {
    if (!this.model.allowedMediaTypes) {
      this.model.allowedMediaTypes = [];
    }
    this.model.allowedMediaTypes.push({
      mediaType: { id: mediaTypeId },
      sortOrder: this.model.allowedMediaTypes.length
    });
    return this;
  }

  withComposition(compositionId: string): MediaTypeBuilder {
    if (!this.model.compositions) {
      this.model.compositions = [];
    }
    this.model.compositions.push({
      mediaType: { id: compositionId },
      compositionType: "Composition"
    });
    return this;
  }

  async create(): Promise<MediaTypeBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postMediaTypeBody.parse(this.model);
    await client.postMediaType(validatedModel);
    
    // Get the created media type by name using the helper
    const items = await MediaTypeTestHelper.findMediaTypes(validatedModel.name);
    if (items.length === 0) {
      throw new Error(`Failed to find created media type with name: ${validatedModel.name}`);
    }
    // Use the first matching item's ID
    this.id = items[0].id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No media type has been created yet");
    }
    return MediaTypeTestHelper.verifyMediaType(this.id);
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No media type has been created yet");
    }
    return this.id;
  }

  build(): CreateMediaTypeRequestModel {
    return this.model as CreateMediaTypeRequestModel;
  }

  async cleanup(): Promise<void> {
    if (this.model.name) {
      await MediaTypeTestHelper.cleanup(this.model.name);
    }
  }
} 