import axios from 'axios';
import querystring from 'querystring';
import { Request, Response } from 'express';
import { Google_Redirect_URL } from '../../constants/Constants';
import jwt from 'jsonwebtoken';

const env: any = process.env;

export default async function HandleGoogleOAuth(req: Request, res: Response) {
  console.log('Hit!');
  const code = req.query.code as string;

  const { id_token, access_token } = await GetTokens({
    code,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${env.SERVER_ROOT_URI}/${Google_Redirect_URL}`,
  });

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  const token = jwt.sign(googleUser, env.JWT_SECRET);

  res.cookie(env.COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.cookie('google_access_token', access_token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.cookie('google_id_token', access_token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.redirect(env.UI_ROOT_URI);
}

type GetTokenProps = Promise<{
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}>;

function GetTokens({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): GetTokenProps {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });
}
