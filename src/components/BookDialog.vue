<script setup>
import { PhX as X } from "@phosphor-icons/vue";
import { computed } from "vue";
import { useDialog } from "@/composables/useDialog";

const props = defineProps({
  book: { type: Object, default: null },
});
const emit = defineEmits(["close"]);
const open = computed(() => Boolean(props.book));
useDialog(open, { onClose: () => emit("close") });
</script>

<template>
  <div v-if="book" class="dialog-backdrop" data-dialog-root @click.self="emit('close')">
    <div class="dialog-panel book-dialog" role="dialog" aria-modal="true" :aria-labelledby="`book-${book.title}`">
      <img :src="book.coverUrl" :alt="book.title" width="180" height="240" />
      <div>
        <div class="article-toolbar">
          <h3 :id="`book-${book.title}`">{{ book.title }}</h3>
          <button class="icon-btn" type="button" aria-label="Close book" @click="emit('close')">
            <X :size="18" />
          </button>
        </div>
        <p class="article-meta">{{ book.author }}</p>
        <p class="article-meta" :aria-label="`${book.rating} stars`">
          <span v-for="n in 5" :key="n">{{ n <= book.rating ? "★" : "☆" }}</span>
        </p>
        <p>“{{ book.review }}”</p>
        <p style="margin-top: 20px">
          <a class="btn btn-filled" :href="book.url" target="_blank" rel="noopener noreferrer">View details</a>
        </p>
      </div>
    </div>
  </div>
</template>
