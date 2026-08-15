<script setup>
import { PhArrowUpRight as ArrowUpRight, PhPlay as Play } from "@phosphor-icons/vue";
import books from "../../public/content/books.json";
import interests from "../../public/content/interests.json";

const emit = defineEmits(["book"]);
</script>

<template>
  <section
    id="interests"
    class="section page-shell"
    data-section="interests"
    aria-labelledby="interests-title"
  >
    <p class="section-label">Interests</p>
    <h2 id="interests-title" class="section-title">Things I linger with</h2>

    <div class="interest-block">
      <h3 class="interest-heading">Main</h3>
      <a
        class="media-card"
        :href="interests.main.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          :src="interests.main.poster"
          :alt="interests.main.title"
          width="1280"
          height="720"
          loading="lazy"
          decoding="async"
        />
        <div class="media-card-play" aria-hidden="true">
          <Play :size="28" weight="fill" />
        </div>
        <div class="media-card-copy">
          <h4>{{ interests.main.title }}</h4>
          <span>{{ interests.main.subtitle }}</span>
        </div>
      </a>
    </div>

    <div class="interest-block">
      <h3 class="interest-heading">Anime</h3>
      <div class="anime-grid">
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
            <h4>{{ item.title }}</h4>
            <span>{{ item.subtitle }} <ArrowUpRight :size="14" weight="bold" /></span>
          </div>
        </a>
      </div>
    </div>

    <div class="interest-block">
      <h3 class="interest-heading">Books</h3>
      <div class="book-row">
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
