<script setup>
import { ref } from "vue";
import posts from "../../public/content/thoughts/manifest.json";
import ArticleCard from "./ArticleCard.vue";
import ArticleView from "./ArticleView.vue";

const emit = defineEmits(["image"]);
const active = ref(null);
</script>

<template>
  <section
    id="thoughts"
    class="section page-shell"
    data-section="thoughts"
    aria-labelledby="thoughts-title"
  >
    <template v-if="!active">
      <p class="section-label">Thoughts</p>
      <h2 id="thoughts-title" class="section-title">And fragments</h2>
      <div class="thoughts-list">
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
