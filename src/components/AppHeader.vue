<script setup>
import { PhList as List, PhX as X } from "@phosphor-icons/vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "@/composables/useI18n";
import LangSwitch from "./LangSwitch.vue";
import ThemeSwitch from "./ThemeSwitch.vue";

const props = defineProps({
  active: { type: String, default: "hero" },
});

const emit = defineEmits(["navigate"]);

const { t } = useI18n();

const navIds = ["about", "work", "interests", "friends", "thoughts"];

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
      <nav class="desktop-nav" :aria-label="t('nav.primaryNav')">
        <a
          v-for="id in navIds"
          :key="id"
          :href="`#${id}`"
          :aria-current="props.active === id"
          @click.prevent="go(id)"
        >
          {{ t(`nav.${id}`) }}
        </a>
      </nav>
      <div class="header-actions">
        <div class="theme-desktop">
          <LangSwitch />
          <ThemeSwitch />
        </div>
        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" />
          <List v-else :size="22" />
        </button>
      </div>
    </div>
  </header>
  <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" :aria-label="t('nav.mobileNav')">
    <a
      v-for="id in navIds"
      :key="id"
      :href="`#${id}`"
      @click.prevent="go(id)"
    >
      {{ t(`nav.${id}`) }}
    </a>
    <div class="mobile-theme">
      <LangSwitch />
      <ThemeSwitch />
    </div>
  </nav>
</template>
