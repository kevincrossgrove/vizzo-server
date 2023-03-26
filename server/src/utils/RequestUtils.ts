import axios from 'axios';
import querystring from 'querystring';

interface GoogleRequestProps {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  options?: { [key: string]: any };
  token: string;
}

export async function GoogleRequest({
  method,
  url,
  options,
  token,
}: GoogleRequestProps) {
  const queryParams = options ? querystring.stringify(options) : null;

  if (!token) {
    return Promise.reject('Missing google access token.');
  }

  return axios({
    method: method,
    url: queryParams ? `${url}?${queryParams}` : url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
