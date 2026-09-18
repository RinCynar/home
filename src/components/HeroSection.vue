<script setup>
import { PhArrowUpRight as ArrowUpRight } from "@phosphor-icons/vue";
import { useI18n } from "@/composables/useI18n";

const emit = defineEmits(["navigate"]);
const { t } = useI18n();

const secondary = [
  { text: "StartPage", url: "https://start.rincynar.top" },
  { text: "TV", url: "https://tv.rincynar.top" },
  { text: "Teigi", url: "https://teigi.rincynar.top" },
  { text: "Chatroom", url: "https://chat.rincynar.top" },
  { text: "Contact", url: "https://rincynar.top/contact" },
];
</script>

<template>
  <section id="hero" class="hero page-shell" data-section="hero" aria-labelledby="hero-title">
    <p class="hero-kicker">Ciallo～(∠・ω&lt; )⌒☆</p>
    <h1 id="hero-title">RinCynar</h1>
    <p class="hero-sub">{{ t('hero.sub') }}</p>
    <div class="hero-actions">
      <a
        class="btn btn-filled"
        href="https://blog.rincynar.top"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t('hero.blog') }}
        <ArrowUpRight :size="16" weight="bold" />
      </a>
      <button class="btn btn-tonal" type="button" @click="emit('navigate', 'thoughts')">
        {{ t('hero.thoughts') }}
      </button>
    </div>
    <nav class="hero-links" :aria-label="t('hero.otherSpaces')">
      <a
        v-for="link in secondary"
        :key="link.text"
        class="btn btn-text"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ link.text }}
        <ArrowUpRight :size="14" weight="bold" />
      </a>
    </nav>
  </section>
</template>
