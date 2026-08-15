<script setup>
import { PhDotsThree as DotsThree, PhMusicNotes as MusicNotes, PhPause as Pause, PhPlay as Play } from "@phosphor-icons/vue";

defineProps({
  song: { type: Object, required: true },
  playing: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  variant: { type: String, default: "desktop" },
});

const emit = defineEmits(["toggle", "expand"]);
</script>

<template>
  <div class="mini-player" :class="variant === 'mobile' ? 'mini-player-mobile' : 'mini-player-desktop'">
    <button type="button" class="mini-copy" @click="emit('expand')" :aria-label="`Open player for ${song.name}`">
      <img
        v-if="song.cover"
        class="mini-cover"
        :src="song.cover"
        :alt="`${song.name} cover`"
        width="40"
        height="40"
      />
      <MusicNotes v-else :size="22" />
    </button>
    <button type="button" class="mini-copy" @click="emit('expand')">
      <strong>{{ loading ? "Loading…" : song.name }}</strong>
      <span>{{ song.artist }}</span>
    </button>
    <button class="icon-btn" type="button" :aria-label="playing ? 'Pause' : 'Play'" @click="emit('toggle')">
      <Pause v-if="playing" :size="18" weight="fill" />
      <Play v-else :size="18" weight="fill" />
    </button>
    <button class="icon-btn" type="button" aria-label="Open music sheet" @click="emit('expand')">
      <DotsThree :size="20" weight="bold" />
    </button>
  </div>
</template>
