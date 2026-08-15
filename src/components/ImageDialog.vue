<script setup>
import { PhX as X } from "@phosphor-icons/vue";
import { computed } from "vue";
import { useDialog } from "@/composables/useDialog";

const props = defineProps({
  src: { type: String, default: "" },
});
const emit = defineEmits(["close"]);
const open = computed(() => Boolean(props.src));
useDialog(open, { onClose: () => emit("close") });
</script>

<template>
  <div
    v-if="src"
    class="dialog-backdrop"
    data-dialog-root
    @click.self="emit('close')"
  >
    <div class="image-frame" role="dialog" aria-modal="true" aria-label="Image preview">
      <button class="icon-btn" type="button" aria-label="Close image" @click="emit('close')">
        <X :size="20" />
      </button>
      <img :src="src" alt="Enlarged image" />
    </div>
  </div>
</template>
