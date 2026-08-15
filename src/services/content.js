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
  getAbout: () => fetchText("/content/about.md"),
  getProjects: () => fetchJSON("/content/projects.json"),
  getBooks: () => fetchJSON("/content/books.json"),
  getLinks: () => fetchJSON("/content/links.json"),
  getBlogManifest: () => fetchJSON("/content/blog/manifest.json"),
  getInterests: () => fetchJSON("/content/interests/interests.json"),
  getMarkdown: (path) => fetchText(path),
};
