<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { contentService } from "@/services/content";
import ArticleCard from "./ArticleCard.vue";
import ArticleView from "./ArticleView.vue";

const emit = defineEmits(["image"]);

const posts = ref([]);
const active = ref(null);
const loading = ref(true);
const section = ref(null);
let observer;

async function load() {
  try {
    posts.value = (await contentService.getBlogManifest()) || [];
  } catch {
    posts.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    },
    { rootMargin: "240px 0px" }
  );
  if (section.value) observer.observe(section.value);
  else load();
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <section
    id="thoughts"
    ref="section"
    class="section page-shell"
    data-section="thoughts"
    aria-labelledby="thoughts-title"
  >
    <template v-if="!active">
      <p class="section-label">Thoughts</p>
      <h2 id="thoughts-title" class="section-title">Notes and fragments</h2>
      <div v-if="loading" class="writing-list" aria-busy="true">
        <div class="skeleton-card"></div>
      </div>
      <div v-else class="writing-list">
        <ArticleCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @open="active = $event"
        />
      </div>
    </template>
    <ArticleView
      v-else
      :post="active"
      @back="active = null"
      @image="emit('image', $event)"
    />
  </section>
</template>
