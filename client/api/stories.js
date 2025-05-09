export async function getStories() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des histoires");
  }
  return await response.json();
}
