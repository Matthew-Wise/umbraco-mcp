/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Delivery API
 * You can find out more about the Umbraco Delivery API in [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api).
 * OpenAPI spec version: Latest
 */
import {
  z as zod
} from 'zod';


/**
 * @deprecated
 */
export const getMediaQuerySkipDefault = 0;export const getMediaQueryTakeDefault = 10;

export const getMediaQueryParams = zod.object({
  "fetch": zod.string().optional().describe('Specifies the media items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "filter": zod.array(zod.string()).optional().describe('Defines how to filter the fetched media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "sort": zod.array(zod.string()).optional().describe('Defines how to sort the found media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "skip": zod.number().optional().describe('Specifies the number of found media items to skip. Use this to control pagination of the response.'),
  "take": zod.number().default(getMediaQueryTakeDefault).describe('Specifies the number of found media items to take. Use this to control pagination of the response.'),
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMediaHeader = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMediaResponse = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
}))
})

export const getMedia20QuerySkipDefault = 0;export const getMedia20QueryTakeDefault = 10;

export const getMedia20QueryParams = zod.object({
  "fetch": zod.string().optional().describe('Specifies the media items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "filter": zod.array(zod.string()).optional().describe('Defines how to filter the fetched media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "sort": zod.array(zod.string()).optional().describe('Defines how to sort the found media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "skip": zod.number().optional().describe('Specifies the number of found media items to skip. Use this to control pagination of the response.'),
  "take": zod.number().default(getMedia20QueryTakeDefault).describe('Specifies the number of found media items to take. Use this to control pagination of the response.'),
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "fields": zod.string().optional().describe('Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMedia20Header = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMedia20Response = zod.object({
  "total": zod.number(),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
}))
})

/**
 * @deprecated
 */
export const getMediaItemQueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional(),
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMediaItemHeader = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMediaItemResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
})
export const getMediaItemResponse = zod.array(getMediaItemResponseItem)

/**
 * @deprecated
 */
export const getMediaItemByPathParams = zod.object({
  "path": zod.string()
})

export const getMediaItemByPathQueryParams = zod.object({
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMediaItemByPathHeader = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMediaItemByPathResponse = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
})

export const getMediaItemByPath20Params = zod.object({
  "path": zod.string()
})

export const getMediaItemByPath20QueryParams = zod.object({
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "fields": zod.string().optional().describe('Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMediaItemByPath20Header = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMediaItemByPath20Response = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
})

/**
 * @deprecated
 */
export const getMediaItemByIdParams = zod.object({
  "id": zod.string().uuid()
})

export const getMediaItemByIdQueryParams = zod.object({
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMediaItemByIdHeader = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMediaItemByIdResponse = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
})

export const getMediaItemById20Params = zod.object({
  "id": zod.string().uuid()
})

export const getMediaItemById20QueryParams = zod.object({
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "fields": zod.string().optional().describe('Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMediaItemById20Header = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMediaItemById20Response = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
})

export const getMediaItems20QueryParams = zod.object({
  "id": zod.array(zod.string().uuid()).optional(),
  "expand": zod.string().optional().describe('Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.'),
  "fields": zod.string().optional().describe('Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.')
})

export const getMediaItems20Header = zod.object({
  "Api-Key": zod.string().optional().describe('API key specified through configuration to authorize access to the API.')
})

export const getMediaItems20ResponseItem = zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "mediaType": zod.string(),
  "url": zod.string(),
  "extension": zod.string().nullish(),
  "width": zod.number().nullish(),
  "height": zod.number().nullish(),
  "bytes": zod.number().nullish(),
  "properties": zod.record(zod.string(), zod.any().nullable()),
  "focalPoint": zod.object({
  "left": zod.number(),
  "top": zod.number()
}).nullish(),
  "crops": zod.array(zod.object({
  "alias": zod.string().nullish(),
  "width": zod.number(),
  "height": zod.number(),
  "coordinates": zod.object({
  "x1": zod.number(),
  "y1": zod.number(),
  "x2": zod.number(),
  "y2": zod.number()
}).nullish()
})).nullish(),
  "path": zod.string(),
  "createDate": zod.string().datetime({"local":true}),
  "updateDate": zod.string().datetime({"local":true})
})
export const getMediaItems20Response = zod.array(getMediaItems20ResponseItem)

