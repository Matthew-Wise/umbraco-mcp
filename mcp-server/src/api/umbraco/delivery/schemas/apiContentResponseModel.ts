/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Delivery API
 * You can find out more about the Umbraco Delivery API in [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api).
 * OpenAPI spec version: Latest
 */
import type { ApiContentResponseModelProperties } from './apiContentResponseModelProperties.js';
import type { ApiContentRouteModel } from './apiContentRouteModel.js';
import type { ApiContentResponseModelCultures } from './apiContentResponseModelCultures.js';

export interface ApiContentResponseModel {
  id: string;
  contentType: string;
  properties: ApiContentResponseModelProperties;
  name: string;
  createDate: string;
  updateDate: string;
  route: ApiContentRouteModel;
  cultures: ApiContentResponseModelCultures;
}
