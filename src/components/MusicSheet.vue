<script setup>
import {
  PhList as List,
  PhPause as Pause,
  PhPlay as Play,
  PhShuffle as Shuffle,
  PhSkipBack as SkipBack,
  PhSkipForward as SkipForward,
  PhSpeakerHigh as SpeakerHigh,
  PhStack as Stack,
  PhX as X,
} from "@phosphor-icons/vue";

const props = defineProps({
  music: { type: Object, required: true },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <div class="music-sheet" role="dialog" aria-label="Music player" data-dialog-root>
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <img
        class="sheet-cover"
        :src="props.music.currentSong.cover"
        :alt="`${props.music.currentSong.name} cover`"
        width="72"
        height="72"
      />
      <div class="sheet-copy">
        <h3>{{ props.music.currentSong.name }}</h3>
        <p>{{ props.music.currentSong.artist }}</p>
      </div>
      <button class="icon-btn" type="button" aria-label="Close player" @click="emit('close')">
        <X :size="18" />
      </button>
    </div>

    <p v-if="props.music.error">{{ props.music.error }}</p>

    <div class="progress" role="slider" :aria-valuenow="Math.round(props.music.progress)" @click="props.music.seek">
      <span :style="{ width: `${props.music.progress}%` }"></span>
    </div>

    <div class="sheet-controls">
      <button class="icon-btn" type="button" aria-label="Previous" @click="props.music.skipBack()">
        <SkipBack :size="20" weight="fill" />
      </button>
      <button
        class="icon-btn"
        type="button"
        :aria-label="props.music.isPlaying ? 'Pause' : 'Play'"
        @click="props.music.togglePlay()"
      >
        <Pause v-if="props.music.isPlaying" :size="24" weight="fill" />
        <Play v-else :size="24" weight="fill" />
      </button>
      <button class="icon-btn" type="button" aria-label="Next" @click="props.music.skipForward()">
        <SkipForward :size="20" weight="fill" />
      </button>
    </div>

    <div class="sheet-tools">
      <button
        class="icon-btn"
        type="button"
        :aria-pressed="props.music.isShuffle"
        aria-label="Shuffle"
        @click="props.music.toggleShuffle()"
      >
        <Shuffle :size="18" />
      </button>
      <button class="icon-btn" type="button" :aria-label="`Playback rate ${props.music.playbackRate}x`" @click="props.music.cycleRate()">
        {{ Number(props.music.playbackRate).toFixed(1) }}x
      </button>
      <button
        class="icon-btn"
        type="button"
        :aria-pressed="props.music.showPlaylist"
        aria-label="Playlist"
        @click="props.music.showPlaylist = !props.music.showPlaylist"
      >
        <List :size="18" />
      </button>
      <button
        class="icon-btn"
        type="button"
        :aria-pressed="props.music.showSwitcher"
        aria-label="Switch playlist"
        @click="props.music.showSwitcher = !props.music.showSwitcher"
      >
        <Stack :size="18" />
      </button>
    </div>

    <label class="sheet-tools" style="margin-top: 8px">
      <SpeakerHigh :size="16" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="props.music.volume"
        aria-label="Volume"
        @input="props.music.setVolume($event.target.value)"
      />
    </label>

    <div :ref="(el) => (props.music.lrcHost = el)" class="lrc" aria-live="polite"></div>

    <div v-if="props.music.showPlaylist" class="playlist">
      <button
        v-for="(song, index) in props.music.playlist"
        :key="song.url || index"
        class="playlist-item"
        type="button"
        :class="{ 'is-active': song.url === props.music.currentSong.url }"
        @click="props.music.switchIndex(index)"
      >
        <span>{{ index + 1 }}</span>
        <span>
          <strong>{{ song.name }}</strong>
          <br />
          <small>{{ song.artist }}</small>
        </span>
      </button>
    </div>

    <div v-if="props.music.showSwitcher" class="song-switcher">
      <h4>Preset playlists</h4>
      <ul>
        <li
          v-for="list in props.music.presets"
          :key="list.id"
          :class="{ 'is-active': list.id === props.music.currentId }"
        >
          <button type="button" @click="props.music.playList(list.id)">{{ list.name }}</button>
        </li>
      </ul>
      <h5 v-if="props.music.customLists.length">My playlists</h5>
      <ul>
        <li
          v-for="list in props.music.customLists"
          :key="list.id"
          :class="{ 'is-active': list.id === props.music.currentId }"
        >
          <button type="button" @click="props.music.playList(list.id)">{{ list.name }}</button>
          <button type="button" class="icon-btn" :aria-label="`Remove ${list.name}`" @click="props.music.removeCustom(list.id)">
            <X :size="14" />
          </button>
        </li>
      </ul>
      <div class="add-row">
        <input v-model="props.music.newId" type="text" inputmode="numeric" placeholder="Playlist ID" />
        <input v-model="props.music.newName" type="text" placeholder="Name (optional)" />
        <button class="btn btn-tonal" type="button" @click="props.music.addCustom()">Add and play</button>
      </div>
    </div>
  </div>
</template>
