<script setup>
import { computed } from "vue";
import { useI18n } from "@/composables/useI18n";

const { locale, t } = useI18n();

// Load all three locale versions of the about content
const aboutModules = {
  en: () => import("../../public/content/about.en.md?raw"),
  zh: () => import("../../public/content/about.zh.md?raw"),
  ja: () => import("../../public/content/about.ja.md?raw"),
};

import { ref, watch } from "vue";

const html = ref("");

async function loadAbout(lang) {
  try {
    const mod = await aboutModules[lang]();
    html.value = mod.default;
  } catch {
    // Fallback to English
    try {
      const mod = await aboutModules["en"]();
      html.value = mod.default;
    } catch {
      html.value = "";
    }
  }
}

// Initial load
loadAbout(locale.value);

// Reload on locale change
watch(locale, (lang) => loadAbout(lang));
</script>

<template>
  <section id="about" class="section page-shell" data-section="about" aria-labelledby="about-title">
    <p class="section-label">{{ t('about.label') }}</p>
    <h2 id="about-title" class="section-title">{{ t('about.title') }}</h2>
    <article class="about-prose" v-html="html"></article>
  </section>
</template>
