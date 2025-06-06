import { CreateUmbracoPrompt } from "@/helpers/create-umbraco-prompt.js";
import { z } from "zod";

const CreateDocumentPrompt = CreateUmbracoPrompt(
  "create-document",
  "Describes a prompt that defines how to create a document",
  {
    documentId: z.string(),
  },
  async ({ documentId }) => {
    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please review this code:\n\n${documentId}`
        }
      }]
    };
  }
);

export default CreateDocumentPrompt;
