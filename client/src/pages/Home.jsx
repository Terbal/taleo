import React, { useEffect, useState } from "react";
import { getStories } from "../../api/stories.js"; // Assurez-vous que le chemin est correct

function Home() {
  const [histoires, setHistoires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStories()
      .then((data) => {
        setHistoires(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Histoires</h1>
      <ul>
        {histoires.map((story) => (
          <li key={story.id}>
            <h2>{story.title}</h2>
            <p>{story.theme}</p>
            <small>Thème : {story.theme}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
