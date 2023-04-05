import { Request, Response } from 'express';

const env: any = process.env;

export default async function HandleTiktokOAuth(req: Request, res: Response) {
  res.redirect(env.UI_ROOT_URI);
}
