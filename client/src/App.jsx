import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function getMe() {
      await axios
        .get("http://localhost:5000/auth/me", {
          withCredentials: true,
        })
        .then((res) => setMe(res.data));
    }

    getMe();
  }, []);

  if (me) {
    console.log(me)
    return <div dangerouslySetInnerHTML={{__html: me.data}}></div>;
  }

  return (
    <div className="App">
      <a href="http://localhost:5000/auth/google/url">
        LOGIN WITH GOOGLE
      </a>
    </div>
  );
}

export default App;