<script setup>
import { config } from "@/config";

const emit = defineEmits(["navigate"]);
</script>

<template>
  <section id="hero" class="hero page-shell" data-section="hero" aria-labelledby="hero-title">
    <p class="hero-kicker">Ciallo～(∠・ω&lt; )⌒☆</p>
    <h1 id="hero-title">RinCynar</h1>
    <p class="hero-sub">
      A gamer, a philosopher, and someone wandering through this life.
    </p>
    <div class="hero-actions">
      <a class="btn btn-filled" :href="config.github.spaceUrl" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <button class="btn btn-tonal" type="button" @click="emit('navigate', 'writing')">
        Writing
      </button>
    </div>
  </section>
</template>
