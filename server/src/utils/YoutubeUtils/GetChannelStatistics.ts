import { GoogleRequest } from '../RequestUtils';

export async function GetChannelStatistics(
  channelID: string,
  googleToken: string
) {
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
