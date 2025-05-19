import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateDataTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDataTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDataTypeTool = CreateUmbracoTool(
  "create-data-type",
  `Creates a new data type
  
  *** CRITICAL WORKFLOW REQUIREMENT ***
  BEFORE creating any new data type, you MUST perform the following steps:
  1. First use the find-data-type function to search for existing data types with similar names and/or property editors
  2. Verify if an existing data type can satisfy the requirements
  3. Only proceed with creating a new data type if no suitable option exists
  4. If a similar data type exists, inform the user and suggest using this one instead.

  When creating a new data type you will need to assign a propety editor. 
  
  Always create new element types in the root, if you need to create a new element type in a specific folder then move the element type to the correct folder after it has been created.

  Below is the list of property editor available by default in Umbraco. Each property editor is followed by an example.
  IMPORTANT: Amend these examples to match the requirements of the data type you are creating. DO NOT STRAY FROM THE EXAMPLES BUT USE THEM AS TEMPLATES.
  Some property editors have optional parameter, it in doubt, leave it out.

  *** Common Property Editors ***

  Decimal
  {"id":"8480eacc-894f-4fbf-8f28-ec001a115c3f","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.Decimal","editorUiAlias":"Umb.PropertyEditorUi.Decimal","values":[{"alias":"step","value":"0.01"},{"alias":"min","value":3},{"alias":"max","value":10},{"alias":"placeholder","value":"Item"}]}

  Email | Umb.PropertyEditorUi.EmailAddress, | Umbraco.EmailAddress
  {"id":"38e3fdb3-2cc2-433e-9064-58edffc5456c","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.EmailAddress","editorUiAlias":"Umb.PropertyEditorUi.EmailAddress","values":[{"alias":"inputType","value":"email"}]}

  Label | Umb.PropertyEditorUi.Label, | Umbraco.Label
  {"id":"05c199b8-d134-4890-803f-053476633686","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.Label","editorUiAlias":"Umb.PropertyEditorUi.Label","values":[{"alias":"umbracoDataValueType","value":"DECIMAL"}]}
  label options : STRING, DECIMAL, DATETIME, TIME, INTEGER, BIGINT, TEXT   

  Numeric 
  {"id":"05c199b8-d134-4890-803f-053476633686","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.Label","editorUiAlias":"Umb.PropertyEditorUi.Label","values":[{"alias":"umbracoDataValueType","value":"DECIMAL"}]}

  Slider
  {"id":"4a949427-2814-42c3-86eb-c874cf5100d6","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.Slider","editorUiAlias":"Umb.PropertyEditorUi.Slider","values":[{"alias":"minVal","value":0},{"alias":"maxVal","value":100},{"alias":"initVal1","value":0},{"alias":"initVal2","value":0},{"alias":"step","value":1}]}

  Tags
  {"id":"87a371cc-9da9-4771-ae58-6895a37b4560","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.Tags","editorUiAlias":"Umb.PropertyEditorUi.Tags","values":[{"alias":"group","value":"default"},{"alias":"storageType","value":"Json"}]}
  Storage options : Json, CSV

  Textarea
  {"id":"5ee0462b-d8d9-45fd-a742-bb0cd4536d78","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.TextArea","editorUiAlias":"Umb.PropertyEditorUi.TextArea","values":[{"alias":"rows","value":10},{"alias":"maxChars","value":100},{"alias":"minHeight","value":200},{"alias":"maxHeight","value":100}]}

  Textbox 
  {"id":"21732e7d-14b9-4413-bf39-86e73beb96c9","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.TextBox","editorUiAlias":"Umb.PropertyEditorUi.TextBox","values":[{"alias":"maxChars","value":512},{"alias":"inputType","value":"text"}]}

  Toggle
  {"id":"b5889bfd-2f39-4214-bc4c-31de062cca73","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.TrueFalse","editorUiAlias":"Umb.PropertyEditorUi.Toggle","values":[{"alias":"default","value":true},{"alias":"showLabels","value":true},{"alias":"labelOn","value":"On"},{"alias":"labelOff","value":"Off"},{"alias":"ariaLabel","value":"Reader"}]}


  *** Lists Property Editors ***

  BlockList 

  IMPORTANT - when creating new block list data types always create the reuired element types first before creating the data type

  {"id":"aff61371-d3d3-4dde-9c85-7c01ff330ede","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.BlockList","editorUiAlias":"Umb.PropertyEditorUi.BlockList","values":[{"alias":"blocks","value":[{"contentElementTypeKey":"c80027e5-7e87-49c1-9b4f-1b9d3fbc2e90","settingsElementTypeKey":"2e1a4fd4-b695-4033-8626-1a45b54e04cb","backgroundColor":"#c05454","iconColor":"#00ff6f"}]},{"alias":"validationLimit","value":{"max":3}},{"alias":"useLiveEditing","value":true},{"alias":"useInlineEditingAsDefault","value":true},{"alias":"maxPropertyWidth","value":"100px"}]}

  CheckBoxList 
  {"id":"aff61371-d3d3-4dde-9c85-7c01ff330ede","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.BlockList","editorUiAlias":"Umb.PropertyEditorUi.BlockList","values":[{"alias":"blocks","value":[{"contentElementTypeKey":"c80027e5-7e87-49c1-9b4f-1b9d3fbc2e90","settingsElementTypeKey":"2e1a4fd4-b695-4033-8626-1a45b54e04cb","backgroundColor":"#c05454","iconColor":"#00ff6f"}]},{"alias":"validationLimit","value":{"max":3}},{"alias":"useLiveEditing","value":true},{"alias":"useInlineEditingAsDefault","value":true},{"alias":"maxPropertyWidth","value":"100px"}]}

  Collection
  {"id":"aff61371-d3d3-4dde-9c85-7c01ff330ede","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.BlockList","editorUiAlias":"Umb.PropertyEditorUi.BlockList","values":[{"alias":"blocks","value":[{"contentElementTypeKey":"c80027e5-7e87-49c1-9b4f-1b9d3fbc2e90","settingsElementTypeKey":"2e1a4fd4-b695-4033-8626-1a45b54e04cb","backgroundColor":"#c05454","iconColor":"#00ff6f"}]},{"alias":"validationLimit","value":{"max":3}},{"alias":"useLiveEditing","value":true},{"alias":"useInlineEditingAsDefault","value":true},{"alias":"maxPropertyWidth","value":"100px"}]}

  Dropdown
  {"id":"0aa7b755-d24a-44fd-917a-1d6a7fa07c1e","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.DropDown.Flexible","editorUiAlias":"Umb.PropertyEditorUi.Dropdown","values":[{"alias":"items","value":["Item 1","Item 2"]},{"alias":"multiple","value":true}]}

  MultipleTestString
  {"id":"aaa23533-275e-4ba2-9a06-fc2bf0ea053a","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.MultipleTextstring","editorUiAlias":"Umb.PropertyEditorUi.MultipleTextString","values":[{"alias":"min","value":3},{"alias":"max","value":10}]}

  RadioButtonList
  {"id":"99f20003-8b65-4db9-ac0b-932c2fd5abaa","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.RadioButtonList","editorUiAlias":"Umb.PropertyEditorUi.RadioButtonList","values":[{"alias":"items","value":["Item 1","Item 2"]}]}


  *** Media Property Editors ***

  ImageCropper 
  Doesn't work

  MediaPicker
  {"id":"57d1162b-264f-4627-ac86-e0692de5ae39","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.MediaPicker3","editorUiAlias":"Umb.PropertyEditorUi.MediaPicker","values":[{"alias":"filter","value":"cc07b313-0843-4aa8-bbda-871c8da728c8"},{"alias":"multiple","value":true},{"alias":"validationLimit","value":{"max":10}},{"alias":"startNodeId"},{"alias":"enableLocalFocalPoint","value":true},{"alias":"ignoreUserStartNodes","value":true}]}

  UploadField
  {"id":"2d574e0b-a7ab-47f2-92c7-acb460fea5dc","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.UploadField","editorUiAlias":"Umb.PropertyEditorUi.UploadField","values":[{"alias":"fileExtensions","value":["pdf"]}]}

  *** Peeople Property Editors ***

  MemberGroupPicker
  {"id":"44802c76-ef67-4bf9-90dd-1e2d431a29d9","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.MemberGroupPicker","editorUiAlias":"Umb.PropertyEditorUi.MemberGroupPicker","values":[]}

  MemberPicker
  {"id":"79f86b6f-f01a-4ba2-8e6d-a7204f8e04b3","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.MemberPicker","editorUiAlias":"Umb.PropertyEditorUi.MemberPicker","values":[]}

  UserPicker
  {"id":"c6f83e2d-3863-4577-9cd6-544e6906bfaa","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.UserPicker","editorUiAlias":"Umb.PropertyEditorUi.UserPicker","values":[]}

  *** Picker Property Editors ***

  ColorPicker
  {"id":"93f22ab5-1cf3-4b4f-b1b1-98d60205929f","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.ColorPicker","editorUiAlias":"Umb.PropertyEditorUi.ColorPicker","values":[{"alias":"useLabel","value":true},{"alias":"items","value":[{"value":"F00","label":"Red"}]}]}

  * ContentPicker | Umb.PropertyEditorUi.ContentPicker | Umbraco.ContentPicker
  {"id":"4bc0e04c-cde8-4f92-a85b-f83a5860a1e8","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.MultiNodeTreePicker","editorUiAlias":"Umb.PropertyEditorUi.ContentPicker","values":[{"alias":"minNumber","value":0},{"alias":"maxNumber","value":0},{"alias":"ignoreUserStartNodes","value":true},{"alias":"startNode","value":{"type":"content","dynamicRoot":{"originAlias":"Current"}}},{"alias":"filter","value":"0fde8472-7c10-4e8a-bd4a-fffc0306d0aa"},{"alias":"showOpenButton","value":true}]}

  DatePicker
  {"id":"d022160d-9703-42f7-9e0d-3611bb26222e","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.DateTime","editorUiAlias":"Umb.PropertyEditorUi.DatePicker","values":[{"alias":"format","value":"YYYY-MM-DD HH:mm:ss"}]}

  DocumentPicker
  {"id":"ed366ea4-ed19-4d7a-bf76-66b4e225cd7f","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.ContentPicker","editorUiAlias":"Umb.PropertyEditorUi.DocumentPicker","values":[{"alias":"ignoreUserStartNodes","value":true},{"alias":"startNodeId","value":"dcf18a51-6919-4cf8-89d1-36b94ce4d963"},{"alias":"showOpenButton","value":true}]}

  EyeDropper | Umb.PropertyEditorUi.EyeDropper | Umbraco.ColorPicker.EyeDropper
  {"id":"871938c0-a549-4da4-84ff-589d0237575b","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.ColorPicker.EyeDropper","editorUiAlias":"Umb.PropertyEditorUi.EyeDropper","values":[{"alias":"showAlpha","value":true},{"alias":"showPalette","value":true}]}

  MultiUrlPicker | Umb.PropertyEditorUi.MultiUrlPicker | Umbraco.MultiUrlPicker
  {"id":"a9887fb3-d2af-40eb-a566-c0907ac7bba3","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.MultiUrlPicker","editorUiAlias":"Umb.PropertyEditorUi.MultiUrlPicker","values":[{"alias":"minNumber","value":1},{"alias":"maxNumber","value":3},{"alias":"ignoreUserStartNodes","value":true},{"alias":"hideAnchor","value":false}]}

  *** Rich Text Property Editors ***

  BlockGrid

  IMPORTANT - when creating new block grid data types always create the reuired element types first before creating the data type

  {"id":"cfdd79d9-6f18-4b2b-a502-c67b0fb3929c","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.BlockGrid","editorUiAlias":"Umb.PropertyEditorUi.BlockGrid","values":[{"alias":"gridColumns","value":12},{"alias":"blocks","value":[{"contentElementTypeKey":"c80027e5-7e87-49c1-9b4f-1b9d3fbc2e90","allowAtRoot":true,"allowInAreas":true,"settingsElementTypeKey":"93638715-f76c-4a11-86b1-6a9d66504901","columnSpanOptions":[{"columnSpan":12}],"rowMinSpan":0,"rowMaxSpan":3}]}]}

  CodeEditor | Umb.PropertyEditorUi.CodeEditor | Umbraco.Plain.String
  {"id":"f845a669-c92d-4af7-9f3c-3a9717925e36","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.Plain.String","editorUiAlias":"Umb.PropertyEditorUi.CodeEditor","values":[{"alias":"language","value":"javascript"},{"alias":"height","value":400},{"alias":"lineNumbers","value":true},{"alias":"minimap","value":true},{"alias":"wordWrap","value":false}]}

  MarkdownEditor
  {"id":"18594f1e-75b7-4e04-9abf-20805556f02c","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.MarkdownEditor","editorUiAlias":"Umb.PropertyEditorUi.MarkdownEditor","values":[{"alias":"preview","value":true},{"alias":"defaultValue","value":"Default value"},{"alias":"overlaySize","value":"small"}]}

  RichTextEditor
  {"id":"29d6b5cf-80ec-4271-bdc0-d18494555b44","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.RichText","editorUiAlias":"Umb.PropertyEditorUi.TinyMCE","values":[{"alias":"toolbar","value":["styles","bold","italic","alignleft","aligncenter","alignright","bullist","numlist","outdent","indent","sourcecode","link","umbmediapicker","umbembeddialog"]},{"alias":"mode","value":"Classic"},{"alias":"maxImageSize","value":500},{"alias":"blocks","value":[{"contentElementTypeKey":"c80027e5-7e87-49c1-9b4f-1b9d3fbc2e90","settingsElementTypeKey":"93638715-f76c-4a11-86b1-6a9d66504901","label":"Appearance","displayInline":true,"editorSize":"small","backgroundColor":"#000000","iconColor":"#000000"}]},{"alias":"mediaParentId"},{"alias":"ignoreUserStartNodes","value":true}]}

  RichTextEditor
  {"id":"45a57ebf-5a20-4148-b247-cb8718059df6","parent":{"id":"6e92aaa2-89b0-48f5-9e68-abff56010e8a"},"name":"Example","editorAlias":"Umbraco.RichText","editorUiAlias":"Umb.PropertyEditorUi.Tiptap","values":[{"alias":"toolbar","value":[[["Umb.Tiptap.Toolbar.SourceEditor"],["Umb.Tiptap.Toolbar.Bold","Umb.Tiptap.Toolbar.Italic","Umb.Tiptap.Toolbar.Underline"],["Umb.Tiptap.Toolbar.TextAlignLeft","Umb.Tiptap.Toolbar.TextAlignCenter","Umb.Tiptap.Toolbar.TextAlignRight"],["Umb.Tiptap.Toolbar.BulletList","Umb.Tiptap.Toolbar.OrderedList"],["Umb.Tiptap.Toolbar.Blockquote","Umb.Tiptap.Toolbar.HorizontalRule"],["Umb.Tiptap.Toolbar.Link","Umb.Tiptap.Toolbar.Unlink"],["Umb.Tiptap.Toolbar.MediaPicker","Umb.Tiptap.Toolbar.EmbeddedMedia"]]]},{"alias":"maxImageSize","value":500},{"alias":"overlaySize","value":"medium"},{"alias":"extensions","value":["Umb.Tiptap.Embed","Umb.Tiptap.Figure","Umb.Tiptap.Image","Umb.Tiptap.Link","Umb.Tiptap.MediaUpload","Umb.Tiptap.RichTextEssentials","Umb.Tiptap.Subscript","Umb.Tiptap.Superscript","Umb.Tiptap.Table","Umb.Tiptap.TextAlign","Umb.Tiptap.TextDirection","Umb.Tiptap.Underline"]}]}

  if you are not asked for a property editor then stop and ask the user to provide one. 

  if you are asked to create a data type for a property that already exists, then stop and ask the user to provide a unique name. 

  Each property editor is configurable. That configuration is different for each property editor. The configuration options can be found in the Umbraco Sourcecode.

  IMPRTANT : Always use the correct configration for the specific property editor. Do not make assumptions. 

  The Umbraco Sourcecode can be found at https://github.com/umbraco/Umbraco-CMS

  The property editors are located in the Umbraco.Core.PropertyEditors namespace.


  Here is an example of a dropdown property editor configuration:

  {
    "id": "b90cccaf-549d-4419-8543-d50aecae0819",
    "parent": null,
    "name": "Test",
    "editorAlias": "Umbraco.DropDown.Flexible", // These MUST match one of the property editors listed above.
    "editorUiAlias": "Umb.PropertyEditorUi.Dropdown", // These MUST match one of the property editors listed above.
    "values": [
      {
        "alias": "items",
        "value": [
          "test",
          "test 2"
        ]
      }
    ]
  }

  `,
  postDataTypeBody.shape,
  async (model: CreateDataTypeRequestModel) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.postDataType(model);

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

export default CreateDataTypeTool;
