import { Request, Response } from 'express';
import { GetChannel } from '../../../utils/YoutubeUtils/GetChannel';
import { GetChannelStatistics } from '../../../utils/YoutubeUtils/GetChannelStatistics';
import { GetChannelVideos } from '../../../utils/YoutubeUtils/GetChannelVideos';

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
