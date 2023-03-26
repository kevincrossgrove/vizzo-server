import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const env = process.env as any;

/**
 * If the user is logged in as Google User
 * Decode their authentication token and return.
 */
export default function GetCurrentGoogleUser(req: Request, res: Response) {
  try {
    const decoded = jwt.verify(req.cookies[env.COOKIE_NAME], env.JWT_SECRET);

    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
}
