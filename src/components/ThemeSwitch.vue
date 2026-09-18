<script setup>
import { useI18n } from "@/composables/useI18n";
import { PhMonitor as Monitor, PhMoon as Moon, PhSun as Sun } from "@phosphor-icons/vue";
import { useTheme } from "@/composables/useTheme";

const { preference, setPreference } = useTheme();
const { t } = useI18n();
</script>

<template>
  <div class="theme-switch" role="group" :aria-label="t('nav.colorTheme')">
    <button
      type="button"
      :aria-label="t('nav.systemTheme')"
      :aria-pressed="preference === 'system'"
      :title="t('nav.systemTheme')"
      @click="setPreference('system')"
    >
      <Monitor :size="16" weight="bold" />
    </button>
    <button
      type="button"
      :aria-label="t('nav.lightTheme')"
      :aria-pressed="preference === 'light'"
      :title="t('nav.lightTheme')"
      @click="setPreference('light')"
    >
      <Sun :size="16" weight="bold" />
    </button>
    <button
      type="button"
      :aria-label="t('nav.darkTheme')"
      :aria-pressed="preference === 'dark'"
      :title="t('nav.darkTheme')"
      @click="setPreference('dark')"
    >
      <Moon :size="16" weight="bold" />
    </button>
  </div>
</template>
