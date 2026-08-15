<script setup>
import { PhList as List, PhX as X } from "@phosphor-icons/vue";
import { onMounted, onUnmounted, ref } from "vue";
import ThemeSwitch from "./ThemeSwitch.vue";

const props = defineProps({
  active: { type: String, default: "hero" },
});

const emit = defineEmits(["navigate"]);

const links = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "interests", label: "Interests" },
  { id: "friends", label: "Friends" },
  { id: "thoughts", label: "Thoughts" },
];

const menuOpen = ref(false);
const scrolled = ref(false);

const onScroll = () => {
  scrolled.value = window.scrollY > 12;
};

const go = (id) => {
  menuOpen.value = false;
  emit("navigate", id);
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="site-header-inner">
      <a class="brand" href="#hero" @click.prevent="go('hero')">
        <img src="/icon/favicon.png" width="32" height="32" alt="" />
        RinCynar
      </a>
      <nav class="desktop-nav" aria-label="Primary">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          :aria-current="props.active === link.id"
          @click.prevent="go(link.id)"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="header-actions">
        <div class="theme-desktop">
          <ThemeSwitch />
        </div>
        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" />
          <List v-else :size="22" />
        </button>
      </div>
    </div>
  </header>
  <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Mobile">
    <a
      v-for="link in links"
      :key="link.id"
      :href="`#${link.id}`"
      @click.prevent="go(link.id)"
    >
      {{ link.label }}
    </a>
    <div class="mobile-theme">
      <ThemeSwitch />
    </div>
  </nav>
</template>
