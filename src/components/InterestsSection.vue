<script setup>
import { PhArrowUpRight as ArrowUpRight, PhPlay as Play } from "@phosphor-icons/vue";
import { ref, watch } from "vue";
import books from "../../public/content/books.json";
import interests from "../../public/content/interests.json";

const emit = defineEmits(["book"]);

const tabs = [
  { id: "main", label: "Main" },
  { id: "anime", label: "Anime" },
  { id: "books", label: "Books" },
];

const active = ref("main");
const playing = ref(false);

watch(active, (id) => {
  if (id !== "main") playing.value = false;
});

const embedSrc = `${interests.main.embed}?autoplay=1&rel=0`;
</script>

<template>
  <section
    id="interests"
    class="section page-shell"
    data-section="interests"
    aria-labelledby="interests-title"
  >
    <p class="section-label">Interests</p>
    <h2 id="interests-title" class="section-title">And things I linger with</h2>

    <div class="interest-box">
      <div class="chip-row" role="tablist" aria-label="Interest categories">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="chip"
          type="button"
          role="tab"
          :class="{ 'is-active': active === tab.id }"
          :aria-selected="active === tab.id"
          :aria-controls="`interest-${tab.id}`"
          @click="active = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="active === 'main'" id="interest-main" role="tabpanel">
        <div class="media-card">
          <div class="media-frame">
            <iframe
              v-if="playing"
              class="video-frame"
              :src="embedSrc"
              title="Shelter MV"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
            <template v-else>
              <img
                :src="interests.main.poster"
                :alt="interests.main.title"
                width="1280"
                height="720"
                loading="lazy"
                decoding="async"
              />
              <button
                class="media-card-play"
                type="button"
                aria-label="Play Shelter"
                @click="playing = true"
              >
                <Play :size="28" weight="fill" />
              </button>
            </template>
          </div>
          <div class="media-card-copy">
            <h3>{{ interests.main.title }}</h3>
            <span>{{ interests.main.subtitle }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="active === 'anime'" id="interest-anime" class="anime-grid" role="tabpanel">
        <a
          v-for="item in interests.anime"
          :key="item.title"
          class="anime-card"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="item.poster"
            :alt="item.title"
            width="900"
            height="1200"
            loading="lazy"
            decoding="async"
          />
          <div class="anime-card-copy">
            <h3>{{ item.title }}</h3>
            <span>{{ item.subtitle }} <ArrowUpRight :size="14" weight="bold" /></span>
          </div>
        </a>
      </div>

      <div v-else id="interest-books" class="book-row" role="tabpanel">
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
    </div>
  </section>
</template>
