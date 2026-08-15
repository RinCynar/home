<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import AboutSection from "./components/AboutSection.vue";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
import BookDialog from "./components/BookDialog.vue";
import HeroSection from "./components/HeroSection.vue";
import ImageDialog from "./components/ImageDialog.vue";
import FriendsSection from "./components/FriendsSection.vue";
import InterestsSection from "./components/InterestsSection.vue";
import WorkSection from "./components/WorkSection.vue";
import ThoughtsSection from "./components/ThoughtsSection.vue";

const activeSection = ref("hero");
const imageSrc = ref("");
const selectedBook = ref(null);

const navigate = (id) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  activeSection.value = id;
};

let observer;
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.dataset.section) {
        activeSection.value = visible.target.dataset.section;
      }
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] }
  );
  document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <a class="skip-link" href="#about">Skip to content</a>
  <AppHeader :active="activeSection" @navigate="navigate" />
  <main>
    <HeroSection @navigate="navigate" />
    <AboutSection />
    <WorkSection />
    <InterestsSection @book="selectedBook = $event" />
    <FriendsSection />
    <ThoughtsSection @image="imageSrc = $event" />
  </main>
  <AppFooter />
  <ImageDialog :src="imageSrc" @close="imageSrc = ''" />
  <BookDialog :book="selectedBook" @close="selectedBook = null" />
</template>
