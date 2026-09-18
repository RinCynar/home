<script setup>
import { useI18n } from "@/composables/useI18n";

const { t } = useI18n();
</script>

<template>
  <footer class="site-footer">
    <div class="page-shell">
      <p class="footer-name">RinCynar</p>
      <div class="footer-meta">
        <p>© {{ new Date().getFullYear() }} RinCynar</p>
        <p>{{ t('footer.tagline') }}</p>
      </div>
    </div>
  </footer>
</template>
