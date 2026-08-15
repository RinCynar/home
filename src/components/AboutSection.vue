<script setup>
import aboutHtml from "../../public/content/about.md?raw";
</script>

<template>
  <section id="about" class="section page-shell" data-section="about" aria-labelledby="about-title">
    <p class="section-label">About</p>
    <h2 id="about-title" class="section-title">Until now</h2>
    <article class="about-prose" v-html="aboutHtml"></article>
  </section>
</template>
