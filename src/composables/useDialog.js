import { nextTick, onUnmounted, watch } from "vue";

export function useDialog(openRef, { onClose } = {}) {
  let lastFocus = null;

  const lockScroll = (locked) => {
    document.body.style.overflow = locked ? "hidden" : "";
  };

  const onKey = (event) => {
    if (!openRef.value) return;
    if (event.key === "Escape") {
      event.preventDefault();
      onClose?.();
    }
    if (event.key !== "Tab") return;
    const root = document.querySelector("[data-dialog-root]");
    if (!root) return;
    const nodes = [...root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter((el) => !el.hasAttribute("disabled"));
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  watch(
    openRef,
    async (open) => {
      lockScroll(open);
      if (open) {
        lastFocus = document.activeElement;
        document.addEventListener("keydown", onKey);
        await nextTick();
        document.querySelector("[data-dialog-root] button, [data-dialog-root] [href]")
          ?.focus();
      } else {
        document.removeEventListener("keydown", onKey);
        if (lastFocus instanceof HTMLElement) lastFocus.focus();
      }
    }
  );

  onUnmounted(() => {
    document.removeEventListener("keydown", onKey);
    lockScroll(false);
  });
}
