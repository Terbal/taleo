// client/src/api/stories.js
export async function getStories() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`);
  return res.json();
}

export async function getStory(id) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`);
  if (!res.ok) throw new Error("Story not found");
  return res.json();
}

export async function createStory(data) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function contributeParagraph(id, text) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/stories/${id}/contribute`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );
  return res.json();
}
