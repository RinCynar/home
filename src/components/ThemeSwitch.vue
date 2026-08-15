<script setup>
import { PhMonitor as Monitor, PhMoon as Moon, PhSun as Sun } from "@phosphor-icons/vue";
import { useTheme } from "@/composables/useTheme";

const { preference, setPreference } = useTheme();

const modes = [
  { id: "system", label: "System theme", icon: Monitor },
  { id: "light", label: "Light theme", icon: Sun },
  { id: "dark", label: "Dark theme", icon: Moon },
];
</script>

<template>
  <div class="theme-switch" role="group" aria-label="Color theme">
    <button
      v-for="mode in modes"
      :key="mode.id"
      type="button"
      :aria-label="mode.label"
      :aria-pressed="preference === mode.id"
      :title="mode.label"
      @click="setPreference(mode.id)"
    >
      <component :is="mode.icon" :size="16" weight="bold" />
    </button>
  </div>
</template>
