<script setup>
import { computed, reactive, ref } from "vue";
import ThemeSwitch from "@/components/ThemeSwitch.vue";
import { config } from "@/config";

const form = reactive({
  name: "",
  contact_method: "email",
  contact_value: "",
  message: "",
});
const status = ref("");
const sending = ref(false);
const errors = reactive({ name: "", contact_value: "", message: "" });

const methods = [
  { value: "email", label: "Email", placeholder: "you@example.com" },
  { value: "qq", label: "QQ", placeholder: "QQ number" },
  { value: "wechat", label: "WeChat", placeholder: "WeChat ID" },
  { value: "phone", label: "Phone", placeholder: "Phone number" },
];

const placeholder = computed(
  () => methods.find((item) => item.value === form.contact_method)?.placeholder || ""
);

const socials = [
  { text: "GitHub", url: "https://github.com/RinCynar" },
  { text: "LINE", url: "https://line.me/ti/p/VEjru7nFpx" },
  { text: "X", url: "https://x.com/RinCynar" },
  { text: "Telegram", url: "https://t.me/Rlank39" },
  { text: "Discord", url: "https://discord.gg/qfKsfEmu" },
  { text: "Bluesky", url: "https://bsky.app/profile/rincynar.top" },
  { text: "Threads", url: "https://www.threads.net/@im.rincynar" },
  { text: "Facebook", url: "https://www.facebook.com/share/15g8vtAose/" },
];

const rules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  qq: /^[1-9][0-9]{4,11}$/,
  wechat: /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/,
  phone: /^1[3-9]\d{9}$/,
};

function validate() {
  errors.name = form.name.trim() ? "" : "Name cannot be empty";
  errors.message = form.message.trim() ? "" : "Message cannot be empty";
  if (!form.contact_value.trim()) {
    errors.contact_value = "Contact cannot be empty";
  } else if (!rules[form.contact_method].test(form.contact_value.trim())) {
    errors.contact_value = "Invalid contact format";
  } else {
    errors.contact_value = "";
  }
  return !errors.name && !errors.contact_value && !errors.message;
}

async function submit() {
  if (!validate()) return;
  sending.value = true;
  status.value = "";
  try {
    const response = await fetch(config.email.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Send failed");
    status.value = "Message sent. Thank you.";
    form.name = "";
    form.contact_value = "";
    form.message = "";
  } catch (error) {
    status.value = error.message || "Message could not be sent.";
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <header class="site-header is-scrolled">
    <div class="site-header-inner">
      <a class="brand" href="./">
        <img src="/icon/favicon.png" width="32" height="32" alt="" />
        RinCynar
      </a>
      <div class="header-actions">
        <ThemeSwitch />
      </div>
    </div>
  </header>
  <main class="page-shell">
    <form class="form-card" @submit.prevent="submit" novalidate>
      <h1>Contact</h1>
      <p class="lede">Leave a note. I’ll read it when I wander back.</p>
      <label class="field">
        Your name
        <input v-model="form.name" type="text" autocomplete="name" required />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </label>
      <label class="field">
        How to reach you
        <select v-model="form.contact_method">
          <option v-for="method in methods" :key="method.value" :value="method.value">
            {{ method.label }}
          </option>
        </select>
      </label>
      <label class="field">
        Contact
        <input v-model="form.contact_value" :placeholder="placeholder" required />
        <span v-if="errors.contact_value" class="field-error">{{ errors.contact_value }}</span>
      </label>
      <label class="field">
        Message
        <textarea v-model="form.message" maxlength="500" required></textarea>
        <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
      </label>
      <button class="btn btn-filled" type="submit" :disabled="sending">
        {{ sending ? "Sending…" : "Send" }}
      </button>
      <p v-if="status" class="form-status" aria-live="polite">{{ status }}</p>
      <div class="social-row">
        <a v-for="item in socials" :key="item.text" :href="item.url" target="_blank" rel="noopener noreferrer">
          {{ item.text }}
        </a>
      </div>
    </form>
  </main>
</template>
