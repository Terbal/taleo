import { createContext, useContext, useEffect, useState } from "react";
import { getStories } from "../../api/stories"; // Assurez-vous que le chemin est correct

const StoriesContext = createContext();

export function StoriesProvider({ children }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await getStories();
      setStories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <StoriesContext.Provider value={{ stories, loading, fetchStories }}>
      {children}
    </StoriesContext.Provider>
  );
}

export const useStories = () => useContext(StoriesContext);
