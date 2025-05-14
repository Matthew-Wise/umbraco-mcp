import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateMediaRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMediaBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { MediaTestHelper } from "./media-test-helper.js";
import { FOLDER_MEDIA_TYPE_ID, IMAGE_MEDIA_TYPE_ID } from "../../../constants.js";

export class MediaBuilder {
  private model: Partial<CreateMediaRequestModel> = {
    values: [],
    variants: [],
    parent: null,
    // mediaType is not set by default
  };

  private createdItem: any = null;

  withName(name: string): MediaBuilder {
    this.model.variants = [
      {
        culture: null,
        segment: null,
        name: name
      }
    ];
    return this;
  }

  withParent(parentId: string): MediaBuilder {
    this.model.parent = { id: parentId };
    return this;
  }

  withImageMediaType(): MediaBuilder {
    this.model.mediaType = { id: IMAGE_MEDIA_TYPE_ID };
    return this;
  }

  withFolderMediaType(): MediaBuilder {
    this.model.mediaType = { id: FOLDER_MEDIA_TYPE_ID };
    return this;
  }

  withImageValue(temporaryFieldId: string): MediaBuilder {
    this.model.values = [
      {
        alias: "umbracoFile",
        value: {
          crops: [],
          culture: null,
          segment: null,
          focalPoint: {
            left: 0.5,
            right: 0.5
          },
          temporaryFieldId: temporaryFieldId
        }
      }
    ];
    return this;
  }

  withVariant(name: string, culture: string | null = null, segment: string | null = null): MediaBuilder {
    if (!this.model.variants) this.model.variants = [];
    this.model.variants.push({ name, culture, segment });
    return this;
  }

  build(): CreateMediaRequestModel {
    return this.model as CreateMediaRequestModel;
  }

  async create(): Promise<MediaBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postMediaBody.parse(this.model);
    await client.postMedia(validatedModel);
    // Find the created media by name
    const name = this.model.variants && this.model.variants[0]?.name;
    if (!name) {
      throw new Error("Media must have a name");
    }

    this.createdItem = await MediaTestHelper.findMedia(name);
    
    if (!this.createdItem) {
      throw new Error(`Failed to find created media with name: ${name}`);
    }
    return this;
  }

  async moveToRecycleBin(): Promise<MediaBuilder> {
    if (!this.createdItem) {
      throw new Error("No media has been created yet. Cannot move to recycle bin.");
    }
    const client = UmbracoManagementClient.getClient();
    await client.putMediaByIdMoveToRecycleBin(this.createdItem.id);
    return this;
  }

  getId(): string {
    if (!this.createdItem) {
      throw new Error("No media has been created yet");
    }
    return this.createdItem.id;
  }

  getCreatedItem(): any {
    if (!this.createdItem) {
      throw new Error("No media has been created yet");
    }
    return this.createdItem;
  }

  async updateName(newName: string): Promise<MediaBuilder> {
    if (!this.createdItem) {
      throw new Error("No media has been created yet");
    }
    const client = UmbracoManagementClient.getClient();

    this.createdItem.variants[0].name = newName;  

    await client.putMediaById(this.createdItem.id, {
      values: this.createdItem.values,
      variants: this.createdItem.variants
    }); 
    
    return this;
  }
} 