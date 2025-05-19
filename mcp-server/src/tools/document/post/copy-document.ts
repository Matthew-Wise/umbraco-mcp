import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { postDocumentByIdCopyBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { z } from "zod";

const CopyDocumentTool = CreateUmbracoTool(
  "copy-document",
  `Copy a document to a new location. This is also the recommended way to create new documents. 
  Copy an existing document to preserve the complex JSON structure, then modify specific fields as needed.
  
  IMPORTANT WORKFLOW NOTES:
  - This function returns an empty string ("") on success, not the new document ID
  - If you need to update the copied document:
    1. After copying, search for the new document using search-document with appropriate query parameters
    2. Look for the most recent document with the target name pattern (e.g., "Original Name (1)")
    3. Use the retrieved ID for subsequent update and publish operations
  
  - If you only need to create a copy without updates:
    1. The copy is created as a draft with the naming pattern "Original Name (N)" where N is a number
    2. No further action is required if you only want to keep it as a draft copy
    3. To publish the copy as-is, you'll still need to find its ID using search-document first
  
    Example workflows:
    1. Copy only: copy-document (creates draft copy)
    2. Copy and update: copy-document → search-document → update-document → publish-document`,
  {
    id: z.string().uuid(),
    data: z.object(postDocumentByIdCopyBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postDocumentByIdCopy(model.id, model.data);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  }
);

export default CopyDocumentTool; 