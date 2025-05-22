import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateDocumentRequestModel } from "@/umb-management-api/schemas/createDocumentRequestModel.js";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const createDocumentSchema = z.object({
  documentTypeId: z.string().uuid("Must be a valid document type type UUID"),
  parentId: z.string().uuid("Must be a valid document UUID").optional(),
  name: z.string(),
  values: z
    .array(
      z.object({
        editorAlias: z.string(),
        culture: z.string().nullable(),
        segment: z.string().nullable(),
        alias: z.string(),
        value: z.any(),
      })
    )
    .default([]),
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

  ## CRITICAL: All generated keys must be unique and randomly generated.

  ## Property Editor Value Examples

  ### Block List

  layout stores references to content and settings keys
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

  ### Block Grid

  Block grids create a hierarchy structure of content items.

  layout stores the structure of the block grid where items can have multiple areas and each area can items which can in turn have areas and items.
  areas can have a columnSpan and rowSpan to determine the size of the area.
  contentData stores the content of the block grid as an array of content items, it has no bearing on the structure.
  settingsData stores the settings of the block list as an array of settings items, it has no bearing on the structure.
  expose stores the segment and culture variants of the block list as an array of expose items

  contentdata and settingsDate items
  .key is the key of the content item, it is referenced by the layout and expose properties
  contentTypeKey is the document type key
  values stores a array of property values

  {
    "editorAlias": "Umbraco.BlockGrid",
    "culture": null,
    "segment": null,
    "alias": "grid",
    "value": {
      "layout": {
        "Umbraco.BlockGrid": [
          {
            "contentKey": "d8fa3d28-79aa-4c60-8e73-5819ed313ea2",
            "columnSpan": 12,
            "rowSpan": 1,
            "areas": [
              {
                "key": "43743e78-0f2b-465e-a3ce-f381c90b68e0",
                "items": [
                  {
                    "contentKey": "3145f922-7ec1-41e0-99a5-d9677e558163",
                    "settingsKey": "6248d134-4657-4605-b0d5-ae804858bb88",
                    "columnSpan": 6,
                    "rowSpan": 1
                  }
                ]
              }
            ]
          }
        ]
      },
      "contentData": [
        {
          "key": "d8fa3d28-79aa-4c60-8e73-5819ed313ea2",
          "contentTypeKey": "6960aaca-0b26-4fae-9cee-db73405d7a3e",
          "values": [
            {
              "editorAlias": "Umbraco.TextBox",
              "culture": null,
              "segment": null,
              "alias": "title",
              "value": "Title"
            },
            {
              "editorAlias": "Umbraco.RichText",
              "culture": null,
              "segment": null,
              "alias": "bodyText",
              "value": {
                "markup": "<p>cxcxcx</p>",
                "blocks": {
                  "layout": {},
                  "contentData": [],
                  "settingsData": [],
                  "expose": []
                }
              }
            },
            {
              "editorAlias": "Umbraco.MediaPicker3",
              "culture": null,
              "segment": null,
              "alias": "image",
              "value": [
                {
                  "key": "40edd153-31eb-4c61-82fc-1ec2e695197b",
                  "mediaKey": "3c6c415c-35a0-4629-891e-683506250c31",
                  "mediaTypeAlias": "",
                  "crops": [],
                  "focalPoint": null
                }
              ]
            }
          ]
        },
        {
          "key": "3145f922-7ec1-41e0-99a5-d9677e558163",
          "contentTypeKey": "c80027e5-7e87-49c1-9b4f-1b9d3fbc2e90",
          "values": [
            {
              "editorAlias": "Umbraco.TextBox",
              "culture": null,
              "segment": null,
              "alias": "title",
              "value": "xccx"
            },
            {
              "editorAlias": "Umbraco.RichText",
              "culture": null,
              "segment": null,
              "alias": "content",
              "value": {
                "markup": "<p>xccx</p>",
                "blocks": {
                  "layout": {},
                  "contentData": [],
                  "settingsData": [],
                  "expose": []
                }
              }
            }
          ]
        }
      ],
      "settingsData": [
        {
          "key": "6248d134-4657-4605-b0d5-ae804858bb88",
          "contentTypeKey": "06200e23-1c29-4298-9582-48b2eaa81fbf",
          "values": []
        }
      ],
      "expose": [
        {
          "contentKey": "d8fa3d28-79aa-4c60-8e73-5819ed313ea2",
          "culture": null,
          "segment": null
        },
        {
          "contentKey": "3145f922-7ec1-41e0-99a5-d9677e558163",
          "culture": null,
          "segment": null
        }
      ]
    }
  }

  ### Decimal

  {
    "editorAlias": "Umbraco.Decimal",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": 1.2
  }

  ### EmailAddress

  {
    "editorAlias": "Umbraco.EmailAddress",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": "admin@admin.co.uk"
  }

  ### Integer

  {
    "editorAlias": "Umbraco.Integer",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": 1
  }

  ### Tags

  {
    "editorAlias": "Umbraco.Tags",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": [
      "Tag 1",
      "Tag 2"
    ]
  }

  ### Colour Picker

  {
    "editorAlias": "Umbraco.ColorPicker",
    "culture": null,
    "segment": null,
    "alias": "test",
    "value": {
      "label": "Green",
      "value": "#00FF00"
    }
  }

  ### True False

  {
    "editorAlias": "Umbraco.TrueFalse",
    "culture": null,
    "segment": null,
    "alias": "example",
    "value": true
  }

  ### CheckBoxList

  {
    "editorAlias": "Umbraco.CheckBoxList",
    "culture": null,
    "segment": null,
    "alias": "checkboxList",
    "value": [
      "item 1",
      "items 2"
    ]
  }

  ### Dropdown Flexible

  {
    "editorAlias": "Umbraco.DropDown.Flexible",
    "culture": null,
    "segment": null,
    "alias": "dropdown",
    "value": [
      "Item 3"
    ]
  }

  ### Multiple Textstring

  {
    "editorAlias": "Umbraco.MultipleTextstring",
    "culture": null,
    "segment": null,
    "alias": "repeatableStrings",
    "value": [
      "Item 1",
      "item 2"
    ]
  }

  ### Radio Button List

  {
    "editorAlias": "Umbraco.RadioButtonList",
    "culture": null,
    "segment": null,
    "alias": "radioButton",
    "value": "item 1"
  }

  ### Image Cropper

  Using this will require a temporary file uploaded first and the id provided

  {
    "editorAlias": "Umbraco.ImageCropper",
    "culture": null,
    "segment": null,
    "alias": "imageBropper",
    "value": {
      "temporaryFileId": "b45eb1dd-2959-4b0b-a675-761b6a19824c",
      "src": "",
      "crops": [],
      "focalPoint": {
        "left": 0.5,
        "top": 0.5
      }
    }
  }

  ### Media Picker 3

  This key relates to a media item id. The key is generated by the system and is not provided by the user.

  {
    "editorAlias": "Umbraco.MediaPicker3",
    "culture": null,
    "segment": null,
    "alias": "mediaPicker",
    "value": [
      {
        "key": "4c82123c-cd3e-4d92-84b8-9c79ad5a5319",
        "mediaKey": "3c6c415c-35a0-4629-891e-683506250c31",
        "mediaTypeAlias": "",
        "crops": [],
        "focalPoint": null
      }
    ]
  }

  ### Upload Field

  Using this will require a temporary file uploaded first and the id provided

  {
    "editorAlias": "Umbraco.UploadField",
    "culture": null,
    "segment": null,
    "alias": "upload",
    "value": {
      "src": "blob:http://localhost:56472/0884388b-41a3-46c2-a224-9b9ff02de24a",
      "temporaryFileId": "fc76f270-83c2-4daa-ba8b-fde4554dda2a"
    }
  }
  
  ### Slider

  {
    "editorAlias": "Umbraco.Slider",
    "culture": null,
    "segment": null,
    "alias": "slider",
    "value": {
      "from": 31,
      "to": 31
    }
  }

  ### Member Group Picker

  The value relates to an existing member group id.

  {
    "editorAlias": "Umbraco.MemberGroupPicker",
    "culture": null,
    "segment": null,
    "alias": "memberGroup",
    "value": "9815503d-a5a9-487f-aee3-827ca43fdb2c"
  }

  ### Member Picker

  The value relates to an existing member id.

  {
    "editorAlias": "Umbraco.MemberPicker",
    "culture": null,
    "segment": null,
    "alias": "member",
    "value": "f8abd31e-c78d-46ea-bb6b-c00cb9107bfb"
  }

  ### User Picker

  The value relates to an existing user id.

  {
    "editorAlias": "Umbraco.UserPicker",
    "culture": null,
    "segment": null,
    "alias": "user",
    "value": "1e70f841-c261-413b-abb2-2d68cdb96094"
  }

  ### Multi Node Tree Picker

  {
    "editorAlias": "Umbraco.MultiNodeTreePicker",
    "culture": null,
    "segment": null,
    "alias": "contentPicker",
    "value": [
      {
        "type": "document",
        "unique": "dcf18a51-6919-4cf8-89d1-36b94ce4d963"
      }
    ]
  }

  ### Date Time

  {
    "editorAlias": "Umbraco.DateTime",
    "culture": null,
    "segment": null,
    "alias": "date",
    "value": "2025-05-23 00:00:00"
  }

  ### Content Picker

  The value relates to an existing document id.

  {
    "editorAlias": "Umbraco.ContentPicker",
    "culture": null,
    "segment": null,
    "alias": "content",
    "value": "dcf18a51-6919-4cf8-89d1-36b94ce4d963"
  }

  ### Colour Picker Eye Dropper

  {
    "editorAlias": "Umbraco.ColorPicker.EyeDropper",
    "culture": null,
    "segment": null,
    "alias": "eyeDropper",
    "value": "#982020"
  }

  ### Multi Url Picker

  {
    "editorAlias": "Umbraco.MultiUrlPicker",
    "culture": null,
    "segment": null,
    "alias": "multiUrl",
    "value": [
      {
        "icon": "icon-home color-blue",
        "name": "Home",
        "type": "document",
        "unique": "dcf18a51-6919-4cf8-89d1-36b94ce4d963",
        "url": "/"
      },
      {
        "icon": "icon-picture",
        "name": "Chairs lamps",
        "type": "media",
        "unique": "3c6c415c-35a0-4629-891e-683506250c31",
        "url": "http://localhost:56472/media/0ofdvcwj/chairs-lamps.jpg"
      },
      {
        "name": "Title",
        "target": "_blank",
        "type": "external",
        "url": "www.google.com"
      }
    ]
  }

  ### Markdown Editor

  {
    "editorAlias": "Umbraco.MarkdownEditor",
    "culture": null,
    "segment": null,
    "alias": "markdown",
    "value": "Markdown"
  }

  ### Code Editor

  {
    "editorAlias": "Umbraco.CodeEditor",
    "culture": null,
    "segment": null,
    "alias": "code",
    "value": "Code"
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

    const payload: CreateDocumentRequestModel = {
      id: documentId,
      documentType: {
        id: model.documentTypeId,
      },
      parent: model.parentId
        ? {
            id: model.parentId,
          }
        : undefined,
      template: null,
      values: model.values,
      variants: [
        {
          culture: null,
          name: model.name,
          segment: null,
        },
      ],
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
