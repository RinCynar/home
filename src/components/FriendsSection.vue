<script setup>
import { PhArrowUpRight as ArrowUpRight } from "@phosphor-icons/vue";
import friends from "../../public/content/friends.json";
</script>

<template>
  <section
    id="friends"
    class="section page-shell"
    data-section="friends"
    aria-labelledby="friends-title"
  >
    <p class="section-label">Friendly links</p>
    <h2 id="friends-title" class="section-title">People · Project · And</h2>
    <div class="friend-grid">
      <a
        v-for="friend in friends"
        :key="friend.url"
        class="friend-card"
        :href="friend.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <strong>{{ friend.text }}</strong>
          <small>{{ friend.host }}</small>
        </span>
        <ArrowUpRight :size="16" weight="bold" />
      </a>
    </div>
  </section>
</template>
