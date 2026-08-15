async function fetchText(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.text();
}

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

export const contentService = {
  getBlogManifest: () => fetchJSON("/content/blog/manifest.json"),
  getMarkdown: (path) => fetchText(path),
};
