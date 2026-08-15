<script setup>
import { PhBed as Bed, PhBook as Book, PhGameController as GameController, PhHeadphones as Headphones } from "@phosphor-icons/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { contentService } from "@/services/content";
import { renderMarkdown } from "@/services/markdown";

const emit = defineEmits(["book", "image"]);

const icons = { book: Book, bed: Bed, headphones: Headphones, game: GameController };

const interests = ref([]);
const books = ref([]);
const activeId = ref("");
const html = ref("");
const loading = ref(true);
const section = ref(null);
let observer;

const active = computed(() => interests.value.find((item) => item.id === activeId.value));

async function loadMarkdown(item) {
  if (!item) {
    html.value = "";
    return;
  }
  try {
    const source = await contentService.getMarkdown(item.mdFilePath);
    html.value = (await renderMarkdown(source)).html;
  } catch {
    html.value = "<p>This note is still unfolding.</p>";
  }
}

async function load() {
  try {
    const [interestData, bookData] = await Promise.all([
      contentService.getInterests(),
      contentService.getBooks().catch(() => []),
    ]);
    interests.value = interestData || [];
    books.value = bookData || [];
    activeId.value = interests.value[0]?.id || "";
  } finally {
    loading.value = false;
  }
}

watch(active, (item) => {
  loadMarkdown(item);
});

function onClick(event) {
  const image = event.target.closest("img[data-lightbox]");
  if (image) emit("image", image.getAttribute("data-lightbox") || image.src);
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
    id="interests"
    ref="section"
    class="section page-shell"
    data-section="interests"
    aria-labelledby="interests-title"
  >
    <p class="section-label">Interests</p>
    <h2 id="interests-title" class="section-title">Things I linger with</h2>
    <div class="chip-row" role="tablist">
      <button
        v-for="item in interests"
        :key="item.id"
        class="chip"
        type="button"
        role="tab"
        :class="{ 'is-active': item.id === activeId }"
        :aria-selected="item.id === activeId"
        @click="activeId = item.id"
      >
        <component :is="icons[item.icon] || Book" :size="16" weight="fill" />
        {{ item.title }}
      </button>
    </div>
    <div v-if="loading" class="skeleton-card" aria-busy="true"></div>
    <article v-else-if="active" class="interest-panel">
      <iframe
        v-if="active.hasVideo && active.videoUrl"
        class="video-frame"
        :src="active.videoUrl"
        title="Interest video"
        loading="lazy"
        allowfullscreen
      ></iframe>
      <div class="prose" v-html="html" @click="onClick"></div>
    </article>

    <div v-if="books.length" class="book-row">
      <button
        v-for="book in books"
        :key="book.title"
        class="book-card"
        type="button"
        @click="emit('book', book)"
      >
        <img
          :src="book.coverUrl"
          :alt="book.title"
          width="160"
          height="214"
          loading="lazy"
          decoding="async"
        />
        <figcaption>
          <strong>{{ book.title }}</strong>
          <span>{{ book.author }}</span>
        </figcaption>
      </button>
    </div>
  </section>
</template>
