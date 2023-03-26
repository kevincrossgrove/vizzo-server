import axios from 'axios';
import { Request, Response } from 'express';
import { GoogleRequest } from '../../utils/RequestUtils';

export async function GetYoutubeData(req: Request, res: Response) {
  const googleToken = req.cookies['google_access_token'];

  try {
    try {
      // Fetch google user's youtube channels
      const result: any = await GoogleRequest({
        method: 'get',
        url: 'https://youtube.googleapis.com/youtube/v3/channels',
        options: { part: 'id', mine: true },
        token: googleToken,
      });
      const channelID = result?.data?.items?.[0]?.id;

      if (!channelID) {
        return res.send('No channels were found.');
      }

      const channelVideosResult = await GetChannelVideos(
        channelID,
        googleToken
      );

      return res.send(channelVideosResult.data);

      const id = result?.items?.[0]?.id;

      const videoResult: any = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos/getRating?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${googleToken}`,
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
  } catch (err) {
    console.log(err);
    res.send('Err');
  }
}

// Using a channelID, get the videos
async function GetChannelVideos(channelId: string, googleToken: string) {
  const options = {
    part: 'snippet',
    order: 'date',
    channelId: channelId,
    maxResults: 20,
  };

  const searchVideosLink = 'https://www.googleapis.com/youtube/v3/search';

  const videosResult = await GoogleRequest({
    method: 'get',
    url: searchVideosLink,
    options: options,
    token: googleToken,
  });

  return videosResult;
}
