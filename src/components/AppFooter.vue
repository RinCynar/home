<script setup>
import { computed, onMounted, ref } from "vue";
import { config } from "@/config";
import { contentService } from "@/services/content";

const links = ref({ sites: [], friends: [] });

const uptime = computed(() => {
  const days = Math.max(
    1,
    Math.ceil(Math.abs(Date.now() - new Date(config.site.startDate).getTime()) / 864e5)
  );
  return `${days} day(s)`;
});

onMounted(async () => {
  try {
    links.value = await contentService.getLinks();
  } catch {
    links.value = { sites: [], friends: [] };
  }
});
</script>

<template>
  <footer class="site-footer">
    <div class="page-shell">
      <p class="footer-name">RinCynar</p>
      <nav class="footer-links" aria-label="Site links">
        <a
          v-for="link in links.sites"
          :key="link.text"
          :href="link.url"
          :target="link.url.startsWith('http') ? '_blank' : null"
          :rel="link.url.startsWith('http') ? 'noopener noreferrer' : null"
        >
          {{ link.text }}
        </a>
      </nav>
      <nav v-if="links.friends?.length" class="friend-links" aria-label="Friend links">
        <a
          v-for="link in links.friends"
          :key="link.text"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.text }}
        </a>
      </nav>
      <div class="footer-meta">
        <p>Made with curiosity.</p>
        <p>
          © {{ new Date().getFullYear() }} RinCynar
          · The site has been running for {{ uptime }}
          <template v-if="config.site.icpNumber">
            ·
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              {{ config.site.icpNumber }}
            </a>
          </template>
        </p>
      </div>
    </div>
  </footer>
</template>
