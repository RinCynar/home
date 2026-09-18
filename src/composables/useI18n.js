import { computed, ref } from "vue";
import en from "@/i18n/en.js";
import zh from "@/i18n/zh.js";
import ja from "@/i18n/ja.js";

const STORAGE_KEY = "lang";
const SUPPORTED = ["en", "zh", "ja"];
const locales = { en, zh, ja };

/** Detect the best matching supported locale from the browser. */
function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* ignore */
  }

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || "en"];

  for (const lang of languages) {
    const tag = lang.toLowerCase();
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("en")) return "en";
  }

  return "en"; // fallback
}

const locale = ref(detectLocale());

/** Resolve a dot-separated key path inside a messages object. */
function resolve(messages, keyPath) {
  return keyPath.split(".").reduce((obj, key) => obj?.[key], messages) ?? keyPath;
}

export function useI18n() {
  /** Translate a dot-path key, with optional {placeholder} substitution. */
  function t(keyPath, params = {}) {
    const messages = locales[locale.value] ?? en;
    let text = resolve(messages, keyPath);
    if (typeof text !== "string") return keyPath;
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
    return text;
  }

  function setLocale(value) {
    if (!SUPPORTED.includes(value)) return;
    locale.value = value;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    // Update <html lang> attribute
    document.documentElement.lang = value === "zh" ? "zh-Hans" : value;
  }

  return {
    locale: computed(() => locale.value),
    t,
    setLocale,
    supported: SUPPORTED,
  };
}

/** Call once in main.js to apply initial lang attribute. */
export function initLocale() {
  const lang = locale.value;
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
}
