<script setup>
import { PhArrowLeft as ArrowLeft } from "@phosphor-icons/vue";
import { computed, onMounted, ref, watch } from "vue";
import { renderMarkdown } from "@/services/markdown";

const props = defineProps({
  post: { type: Object, required: true },
});

const emit = defineEmits(["back", "image"]);

const html = ref("");
const toc = ref([]);
const loading = ref(true);
const tocOpen = ref(false);

const numberedToc = computed(() =>
  toc.value.map((item, index) => ({
    ...item,
    label: `${String(index + 1).padStart(2, "0")} ${item.text}`,
  }))
);

async function load() {
  loading.value = true;
  try {
    const response = await fetch(props.post.filePath);
    if (!response.ok) throw new Error(props.post.filePath);
    const source = await response.text();
    const rendered = await renderMarkdown(source);
    html.value = rendered.html;
    toc.value = rendered.toc;
  } catch {
    html.value = "<p>This article could not be loaded.</p>";
    toc.value = [];
  } finally {
    loading.value = false;
  }
}

function onClick(event) {
  const image = event.target.closest("img[data-lightbox]");
  if (image) {
    emit("image", image.getAttribute("data-lightbox") || image.src);
  }
}

onMounted(load);
watch(() => props.post.id, load);
</script>

<template>
  <article class="article-view">
    <div class="article-toolbar">
      <button class="btn btn-tonal" type="button" @click="emit('back')">
        <ArrowLeft :size="16" />
        All thoughts
      </button>
    </div>
    <h2>{{ post.title }}</h2>
    <div v-if="post.date || post.category" class="article-meta">
      <span v-if="post.date">{{ post.date }}</span>
      <span v-if="post.category">{{ post.category }}</span>
    </div>
    <div class="article-layout">
      <nav v-if="numberedToc.length" class="toc" aria-label="Contents">
        <button
          class="toc-toggle"
          type="button"
          :aria-expanded="tocOpen"
          @click="tocOpen = !tocOpen"
        >
          Contents
        </button>
        <h3 class="toc-title">Contents</h3>
        <ol class="toc-list" :class="{ 'is-open': tocOpen }">
          <li v-for="item in numberedToc" :key="item.id">
            <a :href="`#${item.id}`">{{ item.label }}</a>
          </li>
        </ol>
      </nav>
      <div class="article-body">
        <p v-if="loading">Loading article…</p>
        <div v-else class="prose" v-html="html" @click="onClick"></div>
      </div>
    </div>
  </article>
</template>
