<script setup>
import { PhArrowUpRight as ArrowUpRight } from "@phosphor-icons/vue";
import { config } from "@/config";
import { useGithub } from "@/composables/useGithub";
import ProjectCard from "./ProjectCard.vue";

const { projects, loading, error, section } = useGithub();
</script>

<template>
  <section
    id="work"
    ref="section"
    class="section page-shell"
    data-section="work"
    aria-labelledby="work-title"
  >
    <p class="section-label">Selected work</p>
    <h2 id="work-title" class="section-title">Things I keep building</h2>
    <p v-if="error" class="article-meta">{{ error }}</p>
    <div class="card-grid" :aria-busy="loading">
      <ProjectCard v-for="project in projects" :key="project.key" :project="project" />
      <template v-if="loading && !projects.length">
        <div v-for="n in 4" :key="n" class="skeleton-card"></div>
      </template>
    </div>
    <div class="work-foot">
      <a class="btn btn-tonal" :href="config.github.spaceUrl" target="_blank" rel="noopener noreferrer">
        View all on GitHub
        <ArrowUpRight :size="16" />
      </a>
    </div>
  </section>
</template>
