import { nextTick, onUnmounted, reactive } from "vue";
import { config } from "@/config";

const CUSTOM_KEY = "customSonglists";

function readCustom() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useMusic() {
  const state = reactive({
    open: false,
    sheetOpen: false,
    loaded: false,
    loading: false,
    error: "",
    isPlaying: false,
    progress: 0,
    volume: 0.7,
    isShuffle: false,
    playbackRate: 1,
    playlist: [],
    currentSong: {
      name: "Music",
      artist: "Tap to load",
      cover: "/icon/favicon.png",
      url: "",
    },
    currentId: config.music.defaultId,
    customLists: readCustom(),
    showPlaylist: false,
    showSwitcher: false,
    newId: "",
    newName: "",
    lrcHost: null,
    presets: [{ id: config.music.defaultId, name: config.music.defaultName }],
  });

  let player = null;
  let original = [];

  function persistCustom() {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(state.customLists));
  }

  async function fetchPlaylist(id) {
    const url = `${config.music.api}?server=${config.music.server}&type=${config.music.type}&id=${id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Music API ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error("Empty playlist");
    return data;
  }

  async function ensurePlayer(audio) {
    if (player) return player;
    await import("aplayer/dist/APlayer.min.css");
    const { default: APlayer } = await import("aplayer");
    await nextTick();
    const mount = document.getElementById("player-hidden");
    player = new APlayer({
      container: mount,
      audio,
      lrcType: 3,
      loop: "all",
    });
    player.on("play", () => (state.isPlaying = true));
    player.on("pause", () => (state.isPlaying = false));
    player.on("volumechange", () => (state.volume = player.audio.volume));
    player.on("timeupdate", () => {
      state.progress = player.audio.duration
        ? (player.audio.currentTime / player.audio.duration) * 100
        : 0;
    });
    player.on("listswitch", (data) => {
      Object.assign(state.currentSong, state.playlist[data.index] || {});
      moveLrc();
    });
    state.loaded = true;
    return player;
  }

  function moveLrc() {
    nextTick(() => {
      const lrc = document.querySelector("#player-hidden .aplayer-lrc");
      if (lrc && state.lrcHost) {
        state.lrcHost.innerHTML = "";
        state.lrcHost.appendChild(lrc);
      }
    });
  }

  async function playList(id) {
    state.loading = true;
    state.error = "";
    try {
      const audio = await fetchPlaylist(id);
      original = [...audio];
      state.isShuffle = false;
      state.playlist = audio;
      Object.assign(state.currentSong, audio[0]);
      state.currentId = id;
      const ap = await ensurePlayer(audio);
      if (ap.list.audios?.length) {
        ap.list.clear();
        ap.list.add(audio);
        ap.list.switch(0);
      }
      ap.volume(state.volume, true);
      ap.audio.playbackRate = state.playbackRate;
      ap.play();
      moveLrc();
    } catch (err) {
      console.error(err);
      state.error = "Music could not be loaded.";
    } finally {
      state.loading = false;
    }
  }

  async function openPlayer() {
    state.open = true;
    if (!state.loaded && !state.loading) {
      await playList(state.currentId);
    }
  }

  async function togglePlay() {
    if (!state.loaded) {
      await openPlayer();
      return;
    }
    player?.toggle();
  }

  function seek(event) {
    if (!player) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    player.seek(player.audio.duration * ratio);
  }

  function setVolume(value) {
    state.volume = Number(value);
    player?.volume(state.volume, true);
  }

  function toggleShuffle() {
    if (!player || original.length <= 1) return;
    state.isShuffle = !state.isShuffle;
    const current = player.list.audios[player.list.index];
    let nextList;
    if (state.isShuffle) {
      const rest = original.filter((song) => song.url !== current.url);
      for (let i = rest.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      nextList = [current, ...rest];
    } else {
      nextList = [...original];
    }
    state.playlist = nextList;
    player.list.clear();
    player.list.add(nextList);
    player.list.switch(nextList.findIndex((song) => song.url === current.url));
  }

  function cycleRate() {
    const rates = [1, 1.25, 1.5, 2, 0.5, 0.75];
    state.playbackRate =
      rates[(rates.indexOf(state.playbackRate) + 1) % rates.length];
    if (player) player.audio.playbackRate = state.playbackRate;
  }

  function addCustom() {
    const id = state.newId.trim();
    if (!/^\d+$/.test(id)) return;
    const name = state.newName.trim() || `Playlist ${id}`;
    if (!state.customLists.some((item) => item.id === id)) {
      state.customLists.push({ id, name });
      persistCustom();
    }
    state.newId = "";
    state.newName = "";
    playList(id);
  }

  function removeCustom(id) {
    state.customLists = state.customLists.filter((item) => item.id !== id);
    persistCustom();
    if (state.currentId === id) playList(config.music.defaultId);
  }

  onUnmounted(() => {
    player?.destroy();
    player = null;
  });

  return Object.assign(state, {
    openPlayer,
    togglePlay,
    playList,
    seek,
    setVolume,
    toggleShuffle,
    cycleRate,
    addCustom,
    removeCustom,
    skipBack: () => player?.skipBack(),
    skipForward: () => player?.skipForward(),
    switchIndex: (index) => player?.list.switch(index),
  });
}
