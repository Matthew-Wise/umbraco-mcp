Creates a new document type 
  
IMPORTANT: IMPLEMENTATION REQUIREMENTS

1. ALWAYS use the tools create-document-type-template or create-element-type-template to scaffold the JSON, then amend this to create the request payload.
  DO NOT create the document type from scratch - they are complex and liable to error. Start with a template.
  DO NOT deviate from these structures or invent new properties. The examples in the template illustrate the exact format required.

2. UUID REQUIREMENTS:
  - All UUIDs must be valid and follow the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx where x is a hexadecimal digit (0-9, a-f)
  - NEVER create UUIDs manually with invalid characters (like 'p', 'g', etc.)
  - we are using version 4 UUIDs
  - NEVER reuse UUIDs from other document types or properties - each UUID must be globally unique
  - Each property, container, and document type needs its own unique UUID
  - When referring to other entities (data types, templates, etc.), use their actual UUIDs obtained via lookup tools

3. CONTAINER MATCHING:
  - Property container IDs must exactly match the container IDs defined in the request payload
  - When assigning a property to a container, ensure the container has been defined first

4. DOCUMENT TYPE REFERENCES:
  - When setting allowedDocumentTypes, first use get-document-type-root to find the actual ID of the document type
  - Do not assume IDs without verification

5. ICON REQUIREMENTS:
  - ALWAYS use the get-icons tool to retrieve a list of valid icons
  - ONLY use icon names from this list when setting the icon property
  - Invalid icons will cause the request to fail
  - Icon names should be used exactly as returned by the get-icons tool, including the "icon-" prefix

6. VALIDATION AND WORKFLOW:
  - The call to create the document type must be valid JSON - validate before sending
  - Build and test in small increments, validating each step succeeds before moving to the next
  - If referencing data types, first find them using find-data-type to get their correct IDs
  - After creating a document type, verify its creation and note its ID before referencing it elsewhere

Example pattern:
1. Get template with create-document-type-template
2. Find needed data types with find-data-type
3. Get valid icons with get-icons
4. Create document type with valid, unique UUIDs and a valid icon
5. Get the ID of the created document type if needed for references
6. Update allowed document types if needed with verified IDs