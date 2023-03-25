import { Request, Response } from 'express';
import querystring from 'querystring';
import { Google_Redirect_URL } from '../../constants/Constants';

/**
 * GetGoogleAuthURL - Redirects the user to the Google OAuth Consent page
 * Linked To: GET "/auth/google/url"
 *
 * Any data we need to access from the user, we most provide them in the "scope" array below.
 */
export default function GetGoogleAuthURL(_: Request, res: Response) {
  const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: `${process.env.SERVER_ROOT_URI}/${Google_Redirect_URL}`,
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

  const finalURL = `${rootURL}?${querystring.stringify(options)}`;

  console.log({ finalURL });

  return res.redirect(finalURL);
}
