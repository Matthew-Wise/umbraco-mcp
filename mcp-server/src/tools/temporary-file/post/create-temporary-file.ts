import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { PostTemporaryFileBody } from "@/umb-management-api/schemas/index.js";
import { postTemporaryFileBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { v4 as uuidv4 } from 'uuid';

const CreateTemporaryFileTool = CreateUmbracoTool(
  "create-temporary-file",
  `Creates a new temporary file. The file will be deleted after 10 minutes. 
  The file must be updated as a stream.
  The temporary file id is used when uploading media files to Umbraco.
  The process is as follows:
  - Create a temporary fileusing this endpoint
  - Use the temporary file id when creating a media item using the media post endpoint
  `,
  postTemporaryFileBody.shape,
  async (model: PostTemporaryFileBody) => {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.postTemporaryFile(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ id: model.Id }),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating temporary file:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`,
          },
        ],
      };
    }
  }
);

export default CreateTemporaryFileTool; 