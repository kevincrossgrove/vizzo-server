import { GoogleRequest } from '../RequestUtils';

export async function GetChannel(googleToken: string) {
  const result: any = await GoogleRequest({
    method: 'get',
    url: 'https://youtube.googleapis.com/youtube/v3/channels',
    options: { part: 'id', mine: true },
    token: googleToken,
  });

  const channelID = result?.data?.items?.[0]?.id;

  return channelID || null;
}
