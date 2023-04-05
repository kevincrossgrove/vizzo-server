import { Request, Response } from 'express';
import querystring from 'querystring';
import { TikTok_Redirect_URL } from '../../../constants/Constants';

/**
 * GetTikTokAuthURL - Redirects the user to the TikTok OAuth Consent page
 * Linked To: GET "/auth/tiktok/url"
 *
 * Dev Guide: https://developers.tiktok.com/doc/login-kit-web/
 * Any data we need to access from the user, we most provide them in the "scope" array below.
 */
export default function GetTiktokAuthURL(_: Request, res: Response) {
  // The state is used to maintain the state of your request and callback.
  // This value will be included when redirecting the user back to the client.
  // Check if the state returned in the callback matches what you sent earlier to prevent cross-site request forgery.
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie('csrfState', csrfState, { maxAge: 60000 });

  const rootURL = 'https://www.tiktok.com/auth/authorize/';
  const options = {
    client_key: process.env.TIKTOK_CLIENT_KEY,
    scope: ['user.info.basic'].join(','),
    redirect_uri: `${process.env.SERVER_ROOT_URI}/${TikTok_Redirect_URL}`,
    state: csrfState,
    response_type: 'code',
  };

  const finalURL = `${rootURL}?${querystring.stringify(options)}`;

  return res.redirect(finalURL);
}
