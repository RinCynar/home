<script setup>
import { useI18n } from "@/composables/useI18n";

const { locale, setLocale, t } = useI18n();

const langs = [
  { id: "zh", label: "中" },
  { id: "ja", label: "日" },
  { id: "en", label: "EN" },
];
</script>

<template>
  <div class="lang-switch" role="group" :aria-label="t('nav.language')">
    <button
      v-for="lang in langs"
      :key="lang.id"
      type="button"
      :aria-label="lang.label"
      :aria-pressed="locale === lang.id"
      :title="lang.label"
      @click="setLocale(lang.id)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>
