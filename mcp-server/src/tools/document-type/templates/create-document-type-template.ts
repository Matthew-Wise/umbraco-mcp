import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const CreateDocumentTypeTemplateTool = CreateUmbracoTool(
  "create-document-type-template",
  "Returns an example JSON structure for a document type",
  {},
  async () => {
    const template = {
        icon: "icon-plugin",
        name: "Example Document Type",
        alias: "exampleDocumentType",
        description: "Should be a short description of the document type and what it is used for",
        cleanup: {
          preventCleanup: false
        },
        isElement: false,
        containers: [
          {
            id: "d2e1f3a0-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
            name: "Content",
            type: "Tab",
            parent: null,
            sortOrder: 0
          }
        ],
        properties: [
          {
            id: "c6f1c3a0-0b0a-4e4e-8b1c-1c2d3e4f5a6b",
            name: "Title",
            alias: "title",
            dataType: {
              id: "0cc0eba1-9960-42c9-bf9b-60e150b429ae"
            },
            sortOrder: 0,
            appearance: {
              labelOnTop: false
            },
            validation: {
              regEx: null,
              mandatory: false,
              regExMessage: null,
              mandatoryMessage: null
            },
            variesByCulture: false,
            variesBySegment: false
          }
        ],
        compositions: [{
            "documentType": {
                "id": "b1c27e8c-1692-42ad-9701-c87f12716ee7"
            },
            "compositionType": "Composition"
        }],
        allowedAsRoot: false,
        variesByCulture: false,
        variesBySegment: false,
        allowedTemplates: [],
        allowedDocumentTypes: []
      };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(template, null, 2),
        },
      ],
    };
  }
);

export default CreateDocumentTypeTemplateTool; 