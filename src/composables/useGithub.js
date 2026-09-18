import { onMounted, onUnmounted, ref } from "vue";
import localProjects from "../../public/content/projects.json";
import { getGithubPinned } from "@/services/github";
import { useI18n } from "@/composables/useI18n";

function parseRepo(entry) {
  if (typeof entry === "string") return { repo: entry, featured: false };
  return { repo: entry.repo, featured: Boolean(entry.featured) };
}

function toCard(pinned, fallback) {
  const { t } = useI18n();
  if (pinned) {
    return {
      key: `${pinned.owner}/${pinned.repo}`,
      name: `${pinned.owner}/${pinned.repo}`,
      description: pinned.description || t("work.noDescription"),
      url: pinned.link,
      language: pinned.language || "Text",
      languageColor: pinned.languageColor || "#948f99",
      stars: pinned.stars ?? 0,
      forks: pinned.forks ?? 0,
    };
  }
  const [owner, name] = fallback.repo.split("/");
  return {
    key: fallback.repo,
    name: fallback.repo,
    description: t("work.fallbackDesc"),
    url: `https://github.com/${owner}/${name}`,
    language: "GitHub",
    languageColor: "#948f99",
    stars: null,
    forks: null,
  };
}

export function useGithub() {
  const projects = ref((localProjects || []).map((item) => toCard(null, parseRepo(item))));
  const loading = ref(true);
  const error = ref("");
  const section = ref(null);
  let observer;

  const load = async () => {
    const { t } = useI18n();
    loading.value = true;
    error.value = "";
    try {
      const pinned = await getGithubPinned().catch((err) => {
        error.value = t("work.errorFallback");
        console.error(err);
        return [];
      });

      const wanted = (localProjects || []).map(parseRepo);
      const pinnedMap = new Map(
        (pinned || []).map((item) => [`${item.owner}/${item.repo}`, item])
      );

      const selected = [];
      const used = new Set();

      for (const item of wanted.filter((entry) => entry.featured)) {
        selected.push(toCard(pinnedMap.get(item.repo), item));
        used.add(item.repo);
      }
      for (const item of wanted) {
        if (used.has(item.repo) || selected.length >= 6) continue;
        selected.push(toCard(pinnedMap.get(item.repo), item));
        used.add(item.repo);
      }
      for (const item of pinned || []) {
        const key = `${item.owner}/${item.repo}`;
        if (used.has(key) || selected.length >= 6) continue;
        selected.push(toCard(item, { repo: key }));
        used.add(key);
      }

      projects.value = selected;
    } catch (err) {
      error.value = t("work.loadError");
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "240px 0px" }
    );
    if (section.value) observer.observe(section.value);
    else load();
  });

  onUnmounted(() => observer?.disconnect());

  return { projects, loading, error, section };
}
