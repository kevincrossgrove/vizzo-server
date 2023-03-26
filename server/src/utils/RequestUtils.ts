import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'querystring';

interface GoogleRequestProps {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  options?: { [key: string]: any };
  token: string;
  useApiKey?: boolean;
}

export async function GoogleRequest({
  method,
  url,
  options,
  token,
  useApiKey,
}: GoogleRequestProps) {
  if (!useApiKey && !token) {
    return Promise.reject('Missing google access token.');
  }
  if (useApiKey && options) {
    options.key = process.env.GOOGLE_API_KEY;
  }

  const queryParams = options ? querystring.stringify(options) : null;

  const axiosConfig: AxiosRequestConfig = {
    method: method,
    url: queryParams ? `${url}?${queryParams}` : url,
  };

  if (!useApiKey) {
    axiosConfig.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return axios(axiosConfig);
}
