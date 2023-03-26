import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [me, setMe] = useState(null);
  const [fetchingVideos, setFetchingVideos] = useState(false);
  const [videos, setVideos] = useState(null);
  const [channel, setChannel] = useState(null);

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

  console.log({ videos, channel });

  return (
    <div className="App" style={{ width: '100vw' }}>
      {!me && (
        <a
          href="http://localhost:5000/auth/google/url"
          style={{ textAlign: 'center' }}
        >
          LOGIN WITH GOOGLE
        </a>
      )}
      {me && (
        <div className="main-content">
          <h2>Hi {me?.given_name || me?.name}!</h2>
          {!videos && (
            <button onClick={fetchVideos} disabled={fetchingVideos}>
              {fetchingVideos ? 'Getting videos...' : 'Get Channel Videos'}
            </button>
          )}
          {channel && <img src={channel.snippet.thumbnails.default.url} />}
          {Array.isArray(videos) &&
            videos.map((v) => (
              <div key={v.id.videoId} className="video-card">
                <img
                  src={v.snippet.thumbnails.medium.url}
                  style={{ height: 'auto', width: 180 }}
                />
                <h2>{v.snippet.title}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  async function fetchVideos() {
    setFetchingVideos(true);

    try {
      const result = await axios.get('http://localhost:5000/auth/me/videos', {
        withCredentials: true,
      });

      const items = result.data.items;

      setVideos(items.filter((i) => i.id.kind === 'youtube#video'));
      setChannel(items.find((i) => i.id.kind === 'youtube#channel'));
    } catch {
      setVideos(null);
    }

    setFetchingVideos(false);
  }
}

export default App;
