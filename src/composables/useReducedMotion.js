import { ref, onMounted, onUnmounted } from "vue";

export function useReducedMotion() {
  const reduced = ref(false);
  let media;

  const sync = () => {
    reduced.value = Boolean(media?.matches);
  };

  onMounted(() => {
    media = window.matchMedia("(prefers-reduced-motion: reduce)");
    sync();
    media.addEventListener("change", sync);
  });

  onUnmounted(() => {
    media?.removeEventListener("change", sync);
  });

  return reduced;
}
