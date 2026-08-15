<script setup>
import { PhGitFork as GitFork, PhStar as Star } from "@phosphor-icons/vue";

defineProps({
  project: { type: Object, required: true },
});
</script>

<template>
  <a class="project-card" :href="project.url" target="_blank" rel="noopener noreferrer">
    <h3>{{ project.name }}</h3>
    <p>{{ project.description }}</p>
    <div class="project-meta">
      <span class="meta-item">
        <i class="lang-dot" :style="{ background: project.languageColor }" aria-hidden="true"></i>
        {{ project.language }}
      </span>
      <span v-if="project.stars != null" class="meta-item">
        <Star :size="14" weight="fill" />
        {{ project.stars }}
      </span>
      <span v-if="project.forks != null" class="meta-item">
        <GitFork :size="14" weight="bold" />
        {{ project.forks }}
      </span>
    </div>
  </a>
</template>
