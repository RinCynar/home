import { ref, computed } from "vue";

const STORAGE_KEY = "theme";
const preference = ref(readPreference());
const resolved = ref(resolveTheme(preference.value));

function readPreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
  } catch {
    /* ignore */
  }
  return "system";
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function resolveTheme(value) {
  if (typeof window === "undefined") return "dark";
  return value === "system" ? systemTheme() : value;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const color = theme === "light" ? "#f7faf8" : "#101414";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", color);
}

export function initTheme() {
  resolved.value = resolveTheme(preference.value);
  applyTheme(resolved.value);
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    if (preference.value === "system") {
      resolved.value = systemTheme();
      applyTheme(resolved.value);
    }
  });
}

export function useTheme() {
  const setPreference = (value) => {
    preference.value = value;
    resolved.value = resolveTheme(value);
    applyTheme(resolved.value);
    try {
      if (value === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const cycle = () => {
    const order = ["system", "light", "dark"];
    const next = order[(order.indexOf(preference.value) + 1) % order.length];
    setPreference(next);
  };

  return {
    preference,
    resolved,
    isLight: computed(() => resolved.value === "light"),
    setPreference,
    cycle,
  };
}
