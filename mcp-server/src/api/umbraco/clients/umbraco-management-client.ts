import Axios, { AxiosRequestConfig } from "axios";
import { UmbracoAxios } from "./umbraco-axios.js";

// add a second `options` argument here if you want to pass extra options to each generated query
export const UmbracoManagementClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = UmbracoAxios({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
