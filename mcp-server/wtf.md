This file collects WTF moments when dealing with the management API

Data Types
There is no collection we can see for listing out the Property Editor / Property Editor Ui that is availble in Umbraco
We have to hard code this.


Have no idea what this does.. It's just returns an array with folder in it. Maybe no use for MCP
/umbraco/management/api/v1/item/media-type/folders


/umbraco/management/api/v1/member/configuration looks to return reserved property alias's might be useful for creating member types, not sure why its under members though? (Not integrated for now)


Member type
Model has variants where variants are not allowed...

Webhooks
Creation fails with a 500 if there are no events present. You can do this from the BO as well