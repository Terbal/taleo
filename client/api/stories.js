const API_URL = "http://localhost:5000"; // ton backend Express

export async function getStories() {
  const response = await fetch(`${API_URL}/api/stories`);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des histoires");
  }
  return await response.json();
}
