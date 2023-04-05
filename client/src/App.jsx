import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [me, setMe] = useState(null);
  const [meTikTok, setMeTikTok] = useState(null);
  const [fetchingVideos, setFetchingVideos] = useState(false);
  const [videos, setVideos] = useState(null);
  const [channel, setChannel] = useState(null);
  const [channelStatistics, setChannelStatistics] = useState(null);

  useEffect(() => {
    async function getMe() {
      await axios
        .get('http://localhost:5000/auth/me', {
          withCredentials: true,
        })
        .then((res) => setMe(res.data));
    }

    getMe();
  }, []);

  return (
    <div className="App" style={{ width: '100vw' }}>
      {/* Google Related Logic */}
      <>
        {!me && (
          <LoginLink
            link="http://localhost:5000/auth/google/url"
            title="LOGIN WITH GOOGLE"
          />
        )}
        {me && (
          <div className="main-content">
            <h2>Hi {me?.given_name || me?.name}!</h2>
            {!videos && (
              <button onClick={fetchVideos} disabled={fetchingVideos}>
                {fetchingVideos ? 'Getting videos...' : 'Get Channel Videos'}
              </button>
            )}
            {channel && (
              <div className="channel-card">
                <img src={channel.snippet.thumbnails.default.url} />
                <div>
                  Videos: {channelStatistics.videoCount}
                  <br />
                  Subscribers: {channelStatistics.subscriberCount}
                  <br />
                  View Count: {channelStatistics.viewCount}
                  <br />
                </div>
              </div>
            )}
            {Array.isArray(videos) &&
              videos.map((v) => (
                <div key={v.id.videoId} className="video-card">
                  <img
                    src={v.snippet.thumbnails.medium.url}
                    style={{ height: 'auto', width: 180 }}
                  />
                  <h2
                    dangerouslySetInnerHTML={{ __html: v.snippet.title }}
                  ></h2>
                </div>
              ))}
          </div>
        )}
      </>
      {/* TikTok related logic */}
      <>
        {!meTikTok && (
          <LoginLink
            link="http://localhost:5000/auth/tiktok/url"
            title="LOGIN WITH TIKTOK"
          />
        )}
      </>
    </div>
  );

  async function fetchVideos() {
    setFetchingVideos(true);

    try {
      const result = await axios.get('http://localhost:5000/auth/me/videos', {
        withCredentials: true,
      });

      const { videosData, channelStatistics } = result.data;
      console.log(result.data);

      const items = videosData.items;

      setVideos(items.filter((i) => i.id.kind === 'youtube#video'));
      setChannel(items.find((i) => i.id.kind === 'youtube#channel'));
      setChannelStatistics(channelStatistics);
    } catch {
      setVideos(null);
    }

    setFetchingVideos(false);
  }

  function LoginLink({ link, title }) {
    return (
      <div
        style={{
          width: '100vw',
          textAlign: 'center',
          fontSize: 26,
          marginBottom: 20,
        }}
      >
        <button>
          <a href={link} style={{ textAlign: 'center' }}>
            {title}
          </a>
        </button>
      </div>
    );
  }
}

export default App;
