import { config } from "@/config";

const memory = new Map();

function cacheGet(key) {
  if (memory.has(key)) return memory.get(key);
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (Date.now() > item.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    memory.set(key, item.value);
    return item.value;
  } catch {
    return null;
  }
}

function cacheSet(key, value, ttlMinutes = 20) {
  memory.set(key, value);
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        value,
        expiry: Date.now() + ttlMinutes * 60 * 1000,
      })
    );
  } catch {
    /* ignore quota */
  }
}

export async function getGithubPinned() {
  const key = `github_pinned_${config.github.username}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const url = new URL(config.github.worker);
  url.searchParams.set("endpoint", "pinned");
  url.searchParams.set("username", config.github.username);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }
  const data = await response.json();
  cacheSet(key, data);
  return data;
}
