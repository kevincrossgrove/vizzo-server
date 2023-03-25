/* ====== create node.js server with express.js framework ====== */
// dependencies
import express from 'express';
import querystring from 'querystring';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.use(
  cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: process.env.UI_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
  })
);

app.use(cookieParser());

const redirectURI = 'auth/google';

function getGoogleAuthURL() {
  const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
      'https://www.googleapis.com/auth/youtube.readonly',
    ].join(' '),
  };

  return `${rootURL}?${querystring.stringify(options)}`;
}

// Getting login URL
app.get('/auth/google/url', (_, res) => {
  return res.redirect(getGoogleAuthURL());
});

function getTokens({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<{
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}> {
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

// Getting the user from Google with the code
app.get(`/${redirectURI}`, async (req, res) => {
  const code = req.query.code as string;

  const { id_token, access_token } = await getTokens({
    code,
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
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

  const token = jwt.sign(googleUser, process.env.JWT_SECRET as string);

  res.cookie(process.env.COOKIE_NAME as string, token, {
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

  res.redirect(process.env.UI_ROOT_URI as string);
});

// Getting the current user
app.get('/auth/me', async (req, res) => {
  const authCookie = req.cookies[process.env.COOKIE_NAME as string];

  console.log({ cookies: req.cookies, cookieName: process.env.COOKIE_NAME });

  if (!authCookie || !process.env.JWT_SECRET) return res.send('');

  try {
    const decoded = jwt.verify(authCookie, process.env.JWT_SECRET as string);

    try {
      //&access_token=${req.cookies['google_access_token']}
      const result: any = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/channels?part=id&mine=true`,
        {
          headers: {
            Authorization: `Bearer ${req.cookies['google_access_token']}`,
          },
        }
      );

      return res.send(result.data);

      const id = result?.items?.[0]?.id;

      const videoResult: any = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos/getRating?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${req.cookies['google_access_token']}`,
          },
        }
      );

      console.log(videoResult);
    } catch (err) {
      console.log(err);
      console.log({ err: err.response });
      return res.send({
        data: err.response.data,
      });
    }

    // console.log('decoded', decoded);
    return res.send('yay');
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});

// PORT
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
