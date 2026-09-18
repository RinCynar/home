<script setup>
import { useI18n } from "@/composables/useI18n";

const { t } = useI18n();

defineProps({
  post: { type: Object, required: true },
});

const emit = defineEmits(["open"]);
</script>

<template>
  <button class="article-card" type="button" @click="emit('open', post)">
    <h3>{{ post.title }}</h3>
    <p>{{ post.description || t('thoughts.openArticle') }}</p>
    <div class="article-meta">
      <span>{{ post.date }}</span>
      <span>{{ post.category }}</span>
    </div>
  </button>
</template>
