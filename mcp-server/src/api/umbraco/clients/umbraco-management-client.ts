import Axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

const client_id = process.env.UMBRACO_CLIENT_ID;
const client_secret = process.env.UMBRACO_CLIENT_SECRET;
const grant_type = "client_credentials";

const baseURL = process.env.UMBRACO_BASE_URL;

if (!baseURL)
  throw new Error("Missing required environment variable: UMBRACO_BASE_URL");
if (!client_id)
  throw new Error("Missing required environment variable: UMBRACO_CLIENT_ID");
if (!client_secret && client_id !== "umbraco-swagger")
  throw new Error(
    "Missing required environment variable: UMBRACO_CLIENT_SECRET"
  );

const tokenPath = "/umbraco/management/api/v1/security/back-office/token";

export const UmbracoAxios = Axios.create({ baseURL }); // Set base URL from config

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

// Function to fetch a new access token
const fetchAccessToken = async (): Promise<string | null> => {
  const response = await Axios.post(
    `${baseURL}${tokenPath}`,
    {
      client_id,
      client_secret: client_secret ?? "",
      grant_type,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, expires_in } = response.data;
  accessToken = access_token;
  tokenExpiry = Date.now() + expires_in * 1000; // Calculate token expiry time
  return accessToken;
};

// Axios request interceptor to add the Authorization header
UmbracoAxios.interceptors.request.use(async (config) => {
  if (!accessToken || (tokenExpiry && Date.now() >= tokenExpiry)) {
    await fetchAccessToken(); // Fetch a new token if it doesn't exist or has expired
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

UmbracoAxios.defaults.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' });

/*UmbracoAxios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

UmbracoAxios.interceptors.response.use(response => {
  console.log('Response', response);
  return response;
});*/

/*UmbracoAxios.interceptors.request.use(request => {
  console.log('Final Request URL:', request.baseURL + request.url!);
  return request;
});*/

// Add a generic error handler to the Axios instance
UmbracoAxios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.log(`HTTP Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
    }

    // Optionally, you can throw the error to be handled by the caller
    return Promise.reject(error);
  }
);

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
