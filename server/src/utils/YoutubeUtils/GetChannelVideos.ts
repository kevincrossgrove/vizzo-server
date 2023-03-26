import { GoogleRequest } from '../RequestUtils';

// Using a channelID, get the videos
export async function GetChannelVideos(channelId: string, googleToken: string) {
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
