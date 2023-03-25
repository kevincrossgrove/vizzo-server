import axios from 'axios';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const env = process.env as any;

export async function GetYoutubeData(req: Request, res: Response) {
  const authCookie = req.cookies[env.COOKIE_NAME];

  if (!authCookie || !env.JWT_SECRET) return res.send('');

  try {
    const decoded = jwt.verify(authCookie, env.JWT_SECRET);

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

      console.log({ foundData: result.data });

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
    } catch (err: any) {
      console.log(err);
      console.log({ err: err.response });
      return res.send({
        data: 'error!',
      });
    }

    // console.log('decoded', decoded);
    return res.send('yay');
  } catch (err) {
    console.log(err);
    res.send('Err');
  }
}
