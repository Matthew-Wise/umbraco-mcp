# Umbraco MCP ![GitHub License](https://img.shields.io/github/license/matthew-wise/umbraco-mcp?style=plastic&link=https%3A%2F%2Fgithub.com%2FMatthew-Wise%2Fumbraco-mcp%3Ftab%3DMIT-1-ov-file%23readme)

An MCP (Model Context Protocol) server for [Umbraco CMS](https://umbraco.com/)
it provides access to key parts of the Management API enabling you to do back office tasks with your agent.

## Supported Features

The list below shows which endpoints are covered by group,
if you want to see individual endpoints please refer to your sites swagger definition `<domain>/umbraco/swagger/index.html?urls.primaryName=Umbraco+Management+API`

|                       |                  |                  |
| --------------------- | ---------------- | ---------------- |
| ✅ Culture            | ✅ Data Type     | ✅ Dictionary    |
| ✅ Document Blueprint | ✅ Document Type | ✅ Document      |
| ✅ Language           | ✅ Log Viewer    | ✅ Media Type    |
| ✅ Media              | ✅ Member Group  | ✅ Member Type   |
| ✅ Member             | ✅ Property Type | ✅ Redirect      |
| ✅ Temporary File     |   

## Configuration

### Umbraco Configuration

In order for the MCP to talk to the Management API you will need to create a API user
if you are unsure how to do this follow [Umbraco's documentation](https://docs.umbraco.com/umbraco-cms/fundamentals/data/users/api-users).

The level of access you provider this user will determine what your agent is able to do.

### MCP Server Configuration

```json
{
  "UMBRACO_CLIENT_ID": "<API user name>",
  "UMBRACO_CLIENT_SECRET": "<API Client secert>",
  "UMBRACO_BASE_URL": "https://<domain>"
}
```
