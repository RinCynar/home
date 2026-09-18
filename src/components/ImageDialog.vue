<script setup>
import { PhX as X } from "@phosphor-icons/vue";
import { computed } from "vue";
import { useI18n } from "@/composables/useI18n";
import { useDialog } from "@/composables/useDialog";

const props = defineProps({
  src: { type: String, default: "" },
});
const emit = defineEmits(["close"]);
const open = computed(() => Boolean(props.src));
const { t } = useI18n();
useDialog(open, { onClose: () => emit("close") });
</script>

<template>
  <div
    v-if="src"
    class="dialog-backdrop"
    data-dialog-root
    @click.self="emit('close')"
  >
    <div class="image-frame" role="dialog" aria-modal="true" :aria-label="t('image.preview')">
      <button class="icon-btn" type="button" :aria-label="t('image.close')" @click="emit('close')">
        <X :size="20" />
      </button>
      <img :src="src" :alt="t('image.enlarged')" />
    </div>
  </div>
</template>
