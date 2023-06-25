import { Request, Response } from 'express';

const env: any = process.env;

// Need to get App approved to continue this flow.

export default async function HandleTiktokOAuth(req: Request, res: Response) {
  // https://stackoverflow.com/questions/73338099/tiktok-login-kit-web-flow-keep-getting-redirect-uri-error-code-10006
  console.log(req.params);
  res.redirect(env.UI_ROOT_URI);
}
