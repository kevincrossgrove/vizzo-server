import { Request, Response } from 'express';
import { GoogleRequest } from '../../utils/RequestUtils';

export async function GetYoutubeData(req: Request, res: Response) {
  const googleToken = req.cookies['google_access_token'];

  try {
    try {
      // Fetch google user's youtube channels
      const channelID = await GetChannel(googleToken);

      const channelVideosResult = await GetChannelVideos(
        channelID,
        googleToken
      );

      const channelStatisticsResult = await GetChannelStatistics(
        channelID,
        googleToken
      );

      return res.send({
        videosData: channelVideosResult.data,
        channelStatistics:
          channelStatisticsResult?.data?.items?.[0]?.statistics,
        channelID: channelID,
        test: 'hello',
      });
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

async function GetChannelStatistics(channelID: string, googleToken: string) {
  const options = {
    part: 'statistics',
    id: channelID,
  };

  const channelLink = 'https://www.googleapis.com/youtube/v3/channels';

  const channelStatistics = await GoogleRequest({
    method: 'get',
    url: channelLink,
    options: options,
    token: googleToken,
  });

  return channelStatistics;
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

async function GetChannel(googleToken: string) {
  const result: any = await GoogleRequest({
    method: 'get',
    url: 'https://youtube.googleapis.com/youtube/v3/channels',
    options: { part: 'id', mine: true },
    token: googleToken,
  });

  const channelID = result?.data?.items?.[0]?.id;

  return channelID || null;
}
