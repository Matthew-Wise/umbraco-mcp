import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { PostTemporaryFileBody } from "@/umb-management-api/schemas/index.js";
import { postTemporaryFileBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { ReadStream } from "fs";
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from "fs";
import { join } from "path";
import { EXAMPLE_IMAGE_PATH } from "../../../constants.js";

export class TemporaryFileBuilder {
  private model: Partial<PostTemporaryFileBody> = {
    Id: uuidv4(),
    File: undefined
  };
  private id: string | undefined = undefined;

  withId(id: string): TemporaryFileBuilder {
    this.model.Id = id;
    return this;
  }

  withFile(file: ReadStream): TemporaryFileBuilder {
    this.model.File = file;
    return this;
  }

  withExampleFile(): TemporaryFileBuilder {
    this.model.File = createReadStream(join(process.cwd(), EXAMPLE_IMAGE_PATH));
    return this;
  }

  async create(): Promise<TemporaryFileBuilder> {
    const client = UmbracoManagementClient.getClient();
    const validatedModel = postTemporaryFileBody.parse(this.model);
    await client.postTemporaryFile(validatedModel);
    this.id = this.model.Id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No temporary file has been created yet");
    }
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getTemporaryFileById(this.id);
      return true;
    } catch (error) {
      return false;
    }
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No temporary file has been created yet");
    }
    return this.id;
  }

  async cleanup(): Promise<void> {
    if (this.id) {
      try {
        const client = UmbracoManagementClient.getClient();
        await client.deleteTemporaryFileById(this.id);
      } catch (error) {
        console.error("Error cleaning up temporary file:", error);
      }
    }
  }
} 