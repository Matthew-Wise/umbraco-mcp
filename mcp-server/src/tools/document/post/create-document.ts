import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateDocumentRequestModel } from "@/umb-management-api/schemas/createDocumentRequestModel.js";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";

const createDocumentSchema = z.object({
  documentTypeId: z.string().uuid("Must be a valid document type type UUID"),
  parentId: z.string().uuid("Must be a valid document UUID").optional(),
  name: z.string(),
  values: z.array(z.object({
    editorAlias: z.string(),
    culture: z.string().nullable(),
    segment: z.string().nullable(),
    alias: z.string(),
    value: z.any()
  })).default([])
});

const CreateDocumentTool = CreateUmbracoTool(
  "create-document",
  `Creates a document,

  Always follow these requirements when creating documents exactly, do not deviate in any way.

  ## CRITICAL WORKFLOW REQUIREMENTS
  1. ALWAYS first search for existing documents using search-document to find any documents that use the same document type
  2. If documents of the same type exist, use copy-document instead to duplicate and modify the existing structure
  3. ONLY if NO documents of the target document type exist should you analyze the document type structure
  4. When analyzing document types, use get-document-type-by-id to understand the required properties
  5. Then create the new document with the proper structure
  
  ## CRITICAL FOR DOCUMENT TYPES AND DATA TYPES
  1. BEFORE creating any new document type or data type, ALWAYS search for existing ones using get-document-type-root, get-document-type-search, or find-data-type
  2. ONLY create a new document type or data type if NO suitable existing ones are found
  3. If similar types exist, inform the user and suggest using the existing types instead
  4. Creation of new types should be a last resort when nothing suitable exists

  ## CRITICAL: For document types with allowedAsRoot=true, DO NOT include the parentId parameter at all in the function call.

  Values must match the aliases of the document type structure. 
  Block lists, Block Grids and Rich Text Blocks items and settings must match the defined blocks document type structures.

  ## Property Editor Value Examples

  ### Block List

  layout stores refernces to content and settings keys
  contentData stores the content of the block list as an array of content items
  settingsData stores the settings of the block list as an array of settings items
  expose stores the segment and culture variants of the block list as an array of expose items

  contentdata and settingsDate items
  .key is the key of the content item, it is referenced by the layout and expose properties
  contentTypeKey is the document type key
  values stores a array of property values

  {
    "editorAlias": "Umbraco.BlockList",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": {
      "layout": {
        "Umbraco.BlockList": [
          {
            "contentKey": "7a61b31c-792f-4f6b-a665-960a90b49853"
          }
        ]
      },
      "contentData": [
        {
          "key": "7a61b31c-792f-4f6b-a665-960a90b49853",
          "contentTypeKey": "3a7ec32d-7fd4-49f8-aae6-d9259d5bfee1",
          "values": [
            {
              "editorAlias": "Umbraco.MediaPicker3",
              "culture": null,
              "segment": null,
              "alias": "recipeImage",
              "value": [
                {
                  "key": "9bac772d-cd63-4bb6-b2db-1449042129a7",
                  "mediaKey": "3c6c415c-35a0-4629-891e-683506250c31",
                  "mediaTypeAlias": "",
                  "crops": [],
                  "focalPoint": null
                }
              ]
            }
          ]
        }
      ],
      "settingsData": [],
      "expose": [
        {
          "contentKey": "7a61b31c-792f-4f6b-a665-960a90b49853",
          "culture": null,
          "segment": null
        }
      ]
    }
  }

  ### Textbox
  {
    "editorAlias": "Umbraco.TextBox",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": "some string"
  }

  ### TextArea
  {
    "editorAlias": "Umbraco.TextArea",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": "some string"
  }


  ### Rich Text Editor

  value.blocks is the same structure as the block list

  {
    "editorAlias": "Umbraco.RichText",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": {
      "markup": "<p>some string</p>",
      "blocks": {
        "layout": {},
        "contentData": [],
        "settingsData": [],
        "expose": []
      }
    }
  }

  ### Media Picker

  value is an array of media
  value[].id is generated 
  value[].mediaKey is a media type id

  {
    "editorAlias": "Umbraco.MediaPicker3",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": [
      {
        "key": "9bac772d-cd63-4bb6-b2db-1449042129a7",
        "mediaKey": "3c6c415c-35a0-4629-891e-683506250c31",
        "mediaTypeAlias": "",
        "crops": [],
        "focalPoint": null
      }
    ]
  }

  
  `,
  createDocumentSchema.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();

    const documentId = uuidv4();

    const payload : CreateDocumentRequestModel = {
      id: documentId,
      documentType: {
        id: model.documentTypeId,
      },
      parent: model.parentId ? {
        id: model.parentId,
      } : undefined,
      template: null,
      values: model.values,
      variants: [
        {
          culture: null,
          name: model.name,
          segment: null,
        }
      ]
    };

    const response = await client.postDocument(payload);
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

export default CreateDocumentTool; 