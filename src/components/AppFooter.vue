<script setup>
import { PhArrowUpRight as ArrowUpRight } from "@phosphor-icons/vue";
import { config } from "@/config";
</script>

<template>
  <footer class="site-footer">
    <div class="page-shell">
      <p class="footer-name">RinCynar</p>
      <div class="footer-meta">
        <p>© {{ new Date().getFullYear() }} RinCynar</p>
        <p>
          <a :href="config.github.spaceUrl" target="_blank" rel="noopener noreferrer">
            GitHub
            <ArrowUpRight :size="12" weight="bold" />
          </a>
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
