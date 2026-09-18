<script setup>
import { PhArrowUpRight as ArrowUpRight, PhPlay as Play } from "@phosphor-icons/vue";
import { ref, watch } from "vue";
import { useI18n } from "@/composables/useI18n";
import interests from "../../public/content/interests.json";

const emit = defineEmits(["book"]);
const { t, localize } = useI18n();

const tabIds = ["main", "anime", "books"];
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
    <p class="section-label">{{ t('interests.label') }}</p>
    <h2 id="interests-title" class="section-title">{{ t('interests.title') }}</h2>

    <div class="interest-box">
      <div class="chip-row" role="tablist" :aria-label="t('interests.categories')">
        <button
          v-for="id in tabIds"
          :key="id"
          class="chip"
          type="button"
          role="tab"
          :class="{ 'is-active': active === id }"
          :aria-selected="active === id"
          :aria-controls="`interest-${id}`"
          @click="active = id"
        >
          {{ t(`interests.tabs.${id}`) }}
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
                :alt="localize(interests.main.title)"
                width="1280"
                height="720"
                loading="lazy"
                decoding="async"
              />
              <button
                class="media-card-play"
                type="button"
                :aria-label="t('interests.playLabel')"
                @click="playing = true"
              >
                <Play :size="28" weight="fill" />
              </button>
            </template>
          </div>
          <div class="media-card-copy">
            <h3>{{ localize(interests.main.title) }}</h3>
            <span>{{ localize(interests.main.subtitle) }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="active === 'anime'" id="interest-anime" class="anime-grid" role="tabpanel">
        <a
          v-for="item in interests.anime"
          :key="item.id || localize(item.title)"
          class="anime-card"
          :href="localize(item.href)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="item.poster"
            :alt="localize(item.title)"
            width="900"
            height="1200"
            loading="lazy"
            decoding="async"
          />
          <div class="anime-card-copy">
            <h3>{{ localize(item.title) }}</h3>
            <span>{{ localize(item.subtitle) }} <ArrowUpRight :size="14" weight="bold" /></span>
          </div>
        </a>
      </div>

      <div v-else id="interest-books" class="book-row" role="tabpanel">
        <button
          v-for="book in interests.books"
          :key="book.id || localize(book.title)"
          class="book-card"
          type="button"
          @click="emit('book', book)"
        >
          <img
            :src="book.coverUrl"
            :alt="localize(book.title)"
            width="160"
            height="214"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <strong>{{ localize(book.title) }}</strong>
            <span>{{ localize(book.author) }}</span>
          </figcaption>
        </button>
      </div>
    </div>
  </section>
</template>
