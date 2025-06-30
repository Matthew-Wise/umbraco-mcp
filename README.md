# Umbraco MCP ![GitHub License](https://img.shields.io/github/license/matthew-wise/umbraco-mcp?style=plastic&link=https%3A%2F%2Fgithub.com%2FMatthew-Wise%2Fumbraco-mcp%3Ftab%3DMIT-1-ov-file%23readme)

An MCP (Model Context Protocol) server for [Umbraco CMS](https://umbraco.com/)
it provides access to key parts of the Management API enabling you to do back office tasks with your agent.

## Intro

The MCP server uses an Umbraco API user to access your Umbraco Management API, mean the tools avavile to the AI can be controlled using normal Umbraco user permissions.

## Getting Started

### Umbraco

In order for the MCP to talk to the Management API you will need to create a API user
if you are unsure how to do this follow [Umbraco's documentation](https://docs.umbraco.com/umbraco-cms/fundamentals/data/users/api-users).

The level of access you provider this user will determine what your agent is able to do.

### Installation

[<img src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF" alt="Install in VS Code">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522umbraco-mcp%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540umbraco-mcp%252Fumbraco-mcp-cms%2540alpha%2522%255D%252C%2522env%2522%253A%257B%2522UMBRACO_CLIENT_ID%2522%253A%2522%253CAPI%2520user%2520name%253E%2522%252C%2522UMBRACO_CLIENT_SECRET%2522%253A%2522%253CAPI%2520client%2520secert%253E%2522%252C%2522UMBRACO_BASE_URL%2522%253A%2522https%253A%252F%252F%253Cdomain%253E%2522%252C%2522EXCLUDE_MANAGEMENT_TOOLS%2522%253A%2522%253Ctoolname%253E%252C%253Ctoolname%253E%2522%257D%257D)


First, install the Umbraco MCP server with your client. A typical configuration looks like this:

```json
{
  "servers": {
    "umbraco-mcp": {
      "command": "npx",
      "args": ["@umbraco-mcp/umbraco-mcp-cms@alpha"],
      "env": {
        "UMBRACO_CLIENT_ID": "<API user name>",
        "UMBRACO_CLIENT_SECRET": "<API client secert>",
        "UMBRACO_BASE_URL": "https://<domain>",
        "EXCLUDE_MANAGEMENT_TOOLS": "<toolname>,<toolname>"
      }
    }
  }
}
```

### Configuration

`UMBRACO_CLIENT_ID`

Umbraco API User name

`UMBRACO_CLIENT_SECRET` 

Umbraco API User client secert

`UMBRACO_BASE_URL`

Url of the site you want to connect to, it only needs to be the scheme and domain e.g https://<nolink/>example.com

`EXCLUDE_MANAGEMENT_TOOLS`

The allows you to specify tools by name if you wish to exclude them for the usable tools list. This is helpful as some Agents, cant handle so many tools. This is a commma seperated list of tools which can be found below.

## Using the Umbraco MCP With Claude

To get started with using the Umbraco MCP with Claude, first download and install the [Claude.ai desktop app](https://claude.ai/download).  

Start up your Umbraco instance (currently working with version **15.latest**) and create new API user credentials. You can see instructions on how to do that on the [Umbraco docs](https://docs.umbraco.com/umbraco-cms/fundamentals/data/users/api-users).

Once you have this information head back into Claude desktop app and head to Settings > Developer > Edit Config. Open the json file in a text editor of your choice and add the below, replacing the `UMBRACO_CLIENT_ID`, `UMBRACO_CLIENT_SECRET` and `UMBRACO_BASE_URL` with your local connection information. The addition of the `NODE_TLS_REJECT_UNAUTHORIZED` env flag is to allow Claude to connect to the MCP using a self-signed cert.

```
{
  "mcpServers": {
    "umbraco-mcp": {
      "command": "npx",
      "args": ["@umbraco-mcp/umbraco-mcp-cms@alpha"],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "0",
        "UMBRACO_CLIENT_ID": "umbraco-back-office-mcp",
        "UMBRACO_CLIENT_SECRET": "1234567890",
        "UMBRACO_BASE_URL": "https://localhost:44391"
      }
    }
  }
}
```

Restart Claude and try it out with a simple prompt such as `Tell me the GUID of the home page document type`. You'll need to allow each one of the tools as the Umbraco MCP starts to work its way through. If you receive a connection error with the Umbraco MCP click the button to open the logs and review the file `mcp-server-umbraco-mcp.log` for extra information on how to fix the issue.  

> [!NOTE]
> You may need to update to a paid version of Claude.ai in order to have a large enough context window to run your prompts.

##  Umbraco Management API Tools
<details>
<summary> View Tool list</summary>
<br>

<details>
<summary>Culture</summary>
<br>

`get-culture` - gets all cultures avaliable to Umbraco  
</details>

<details>
<summary>Data Type</summary>
<br>

`get-data-type-search` - Search for data types  
`get-data-type` - Get a specific data type by ID  
`get-data-type-references` - Get references to a data type  
`is-used-data-type` - Check if a data type is in use  
`get-data-type-root` - Get root level data types  
`get-data-type-children` - Get child data types  
`get-data-type-ancestors` - Get ancestor data types  
`get-all-data-types` - Get all data types  
`delete-data-type` - Delete a data type  
`create-data-type` - Create a new data type  
`update-data-type` - Update an existing data type  
`copy-data-type` - Copy a data type  
`move-data-type` - Move a data type to a different location  
`create-data-type-folder` - Create a folder for organizing data types  
`delete-data-type-folder` - Delete a data type folder  
`get-data-type-folder` - Get information about a data type folder  
`update-data-type-folder` - Update a data type folder details
</details>

<details>
<summary>Dictionary</summary>
<br>

`get-dictionary-search` - Search for dictionary items  
`get-dictionary-by-key` - Get a dictionary item by key  
`create-dictionary` - Create a new dictionary item  
`update-dictionary` - Update a dictionary item  
`delete-dictionary` - Delete a dictionary item  
</details>

<details>
<summary>Document</summary>
<br>

`get-document-by-id` - Get a document by ID  
`get-document-publish` - Get document publish status  
`get-document-configuration` - Get document configuration  
`copy-document` - Copy a document  
`create-document` - Create a new document  
`post-document-public-access` - Set document public access  
`delete-document` - Delete a document  
`delete-document-public-access` - Remove public access from a document  
`get-document-urls` - Get document URLs  
`get-document-domains` - Get document domains  
`get-document-audit-log` - Get document audit log  
`get-document-public-access` - Get document public access settings  
`move-document` - Move a document  
`move-to-recycle-bin` - Move document to recycle bin  
`get-document-notifications` - Get document notifications  
`publish-document` - Publish a document  
`publish-document-with-descendants` - Publish a document and its descendants  
`sort-document` - Sort document order  
`unpublish-document` - Unpublish a document  
`update-document` - Update a document  
`put-document-domains` - Update document domains  
`put-document-notifications` - Update document notifications  
`put-document-public-access` - Update document public access  
`delete-from-recycle-bin` - Delete document from recycle bin  
`empty-recycle-bin` - Empty the recycle bin  
`get-recycle-bin-root` - Get root items in recycle bin  
`get-recycle-bin-children` - Get child items in recycle bin  
`search-document` - Search for documents  
`validate-document` - Validate a document  
`get-document-root` - Get root documents  
`get-document-children` - Get child documents  
`get-document-ancestors` - Get document ancestors
</details>

<details>
<summary>Document Blueprint</summary>
<br>

`get-blueprint` - Get a document blueprint  
`delete-blueprint` - Delete a document blueprint  
`update-blueprint` - Update a document blueprint  
`create-blueprint` - Create a new document blueprint  
`get-blueprint-ancestors` - Get blueprint ancestors  
`get-blueprint-children` - Get blueprint children  
`get-blueprint-root` - Get root blueprints
</details>

<details>
<summary>Document Type</summary>
<br>

`get-document-type` - Get a document type  
`get-document-type-configuration` - Get document type configuration  
`get-document-type-blueprint` - Get document type blueprint  
`get-document-type-by-id-array` - Get document types by IDs  
`get-document-type-available-compositions` - Get available compositions  
`get-document-type-composition-references` - Get composition references  
`update-document-type` - Update a document type  
`copy-document-type` - Copy a document type  
`move-document-type` - Move a document type  
`create-document-type` - Create a new document type  
`delete-document-type` - Delete a document type  
`create-element-type` - Create an element type  
`get-icons` - Get available icons  
`get-document-type-allowed-children` - Get allowed child types  
`get-all-document-types` - Get all document types  
`create-document-type-folder` - Create a folder  
`delete-document-type-folder` - Delete a folder  
`get-document-type-folder` - Get folder info  
`update-document-type-folder` - Update folder details  
`get-document-type-root` - Get root document types  
`get-document-type-ancestors` - Get document type ancestors  
`get-document-type-children` - Get document type children
</details>

<details>
<summary>Language</summary>
<br>

`get-language-items` - Get all languages  
`get-default-language` - Get default language  
`create-language` - Create a new language  
`update-language` - Update a language  
`delete-language` - Delete a language  
`get-language-by-iso-code` - Get language by ISO code
</details>

<details>
<summary>Log Viewer</summary>
<br>

`get-log-viewer-saved-search-by-name` - Get saved search by name  
`get-log-viewer-level-count` - Get log level counts  
`post-log-viewer-saved-search` - Save a log search  
`delete-log-viewer-saved-search-by-name` - Delete saved search  
`get-log-viewer` - Get logs  
`get-log-viewer-level` - Get log levels  
`get-log-viewer-search` - Search logs  
`get-log-viewer-validate-logs` - Validate logs  
`get-log-viewer-message-template` - Get message template
</details>

<details>
<summary>Media</summary>
<br>

`get-media-by-id` - Get media by ID  
`get-media-ancestors` - Get media ancestors  
`get-media-children` - Get media children  
`get-media-root` - Get root media items  
`create-media` - Create new media  
`delete-media` - Delete media  
`update-media` - Update media  
`get-media-configuration` - Get media configuration  
`get-media-urls` - Get media URLs  
`validate-media` - Validate media  
`sort-media` - Sort media items  
`get-media-by-id-array` - Get media by IDs  
`move-media` - Move media  
`get-media-audit-log` - Get media audit log  
`get-media-recycle-bin-root` - Get recycle bin root  
`get-media-recycle-bin-children` - Get recycle bin children  
`empty-recycle-bin` - Empty recycle bin  
`restore-from-recycle-bin` - Restore from recycle bin  
`move-media-to-recycle-bin` - Move to recycle bin  
`delete-from-recycle-bin` - Delete from recycle bin
</details>

<details>
<summary>Media Type</summary>
<br>

`get-media-type-configuration` - Get media type configuration  
`get-media-type-by-id` - Get media type by ID  
`get-media-type-by-ids` - Get media types by IDs  
`get-allowed` - Get allowed media types  
`get-media-type-allowed-at-root` - Get types allowed at root  
`get-media-type-allowed-children` - Get allowed child types  
`get-media-type-composition-references` - Get composition references  
`get-root` - Get root media types  
`get-children` - Get child media types  
`get-ancestors` - Get ancestor media types  
`get-folder` - Get folder information  
`create-folder` - Create a new folder  
`delete-folder` - Delete a folder  
`update-folder` - Update folder details  
`create-media-type` - Create a new media type  
`copy-media-type` - Copy a media type  
`get-media-type-available-compositions` - Get available compositions  
`update-media-type` - Update a media type  
`move-media-type` - Move a media type  
`delete-media-type` - Delete a media type
</details>

<details>
<summary>Member</summary>
<br>

`get-member` - Get member by ID  
`create-member` - Create a new member  
`delete-member` - Delete a member  
`update-member` - Update a member  
`find-member` - Find members
</details>

<details>
<summary>Member Group</summary>
<br>

`get-member-group` - Get member group  
`get-member-group-by-id-array` - Get member groups by IDs  
`create-member-group` - Create a new member group  
`update-member-group` - Update a member group  
`delete-member-group` - Delete a member group  
`get-member-group-root` - Get root member groups
</details>

<details>
<summary>Member Type</summary>
<br>

`get-member-type-by-id` - Get member type by ID  
`create-member-type` - Create a new member type  
`get-member-type-by-id-array` - Get member types by IDs  
`delete-member-type` - Delete a member type  
`update-member-type` - Update a member type  
`copy-member-type` - Copy a member type  
`get-member-type-available-compositions` - Get available compositions  
`get-member-type-composition-references` - Get composition references  
`get-member-type-configuration` - Get member type configuration  
`get-member-type-root` - Get root member types
</details>

<details>
<summary>Property Type</summary>
<br>

`get-property-type` - Get property type by ID  
`get-property-type-all-property-type-groups` - Get all property type groups  
`create-property-type` - Create a new property type  
`update-property-type` - Update a property type  
`delete-property-type` - Delete a property type
</details>

<details>
<summary>Redirect</summary>
<br>

`get-all-redirects` - Get all redirects  
`get-redirect-by-id` - Get redirect by ID  
`delete-redirect` - Delete a redirect  
`get-redirect-status` - Get redirect status  
`update-redirect-status` - Update redirect status
</details>

<details>
<summary>Server</summary>
<br>

`get-server-status` - Get server status  
`get-server-log-file` - Get server log file  
`tour-status` - Get tour status  
`upgrade-status` - Get upgrade status
</details>

<details>
<summary>Temporary File</summary>
<br>

`create-temporary-file` - Create a temporary file  
`get-temporary-file` - Get a temporary file  
`delete-temporary-file` - Delete a temporary file  
`get-temporary-file-configuration` - Get temporary file configuration
</details>

<details>
<summary>User Group</summary>
<br>

`get-user-group` - Get user group  
`get-user-group-by-id-array` - Get user groups by IDs  
`get-user-groups` - Get all user groups  
`get-filter-user-group` - Filter user groups  
`create-user-group` - Create a new user group  
`update-user-group` - Update a user group  
`delete-user-group` - Delete a user group  
`delete-user-groups` - Delete multiple user groups
</details>

<details>
<summary>Webhook</summary>
<br>

`get-webhook-by-id` - Get webhook by ID  
`get-webhook-by-id-array` - Get webhooks by IDs  
`delete-webhook` - Delete a webhook  
`update-webhook` - Update a webhook  
`get-webhook-events` - Get webhook events  
`get-all-webhook-logs` - Get all webhook logs  
`create-webhook` - Create a new webhook
</details>
</details>

## Umbraco Workflow API Tools

If you have workflow installed, the AI will use this tool instead of directly publishing content

`initiate-workflow-action` - Initiates a workflow approval process for content changes  
